import { useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { HttpStatusCode } from "../../../../../models/httpStatusCode";
import Axios from "axios";
import { environmentVariables } from "../../../../../environmentVariables";
import { RouteCreator } from "../../utils/routeCreator";

export const useAxiosInterceptor = () => {
    const history = useHistory();
    useLayoutEffect(() => {
        Axios.interceptors.response.use(undefined, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            if (error.response.status === HttpStatusCode.Unauthorized) {
                const route = RouteCreator.signIn();
                history.push(route);
            }

            return Promise.reject(error);
        });

        Axios.interceptors.request.use(async (config) => {
            const isAuthenticatedApi = config?.url?.startsWith(
                environmentVariables.baseAuthenticatedApiUrl || "unused"
            );
            if (isAuthenticatedApi) {
                config.headers["AuthHeader"] =
                    localStorage.getItem("token") || "";
            }

            return Promise.resolve(config);
        });
    }, []);
};
