import { useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { HttpStatusCode } from "../../models/httpStatusCode";
import Axios from "axios";
import { environmentVariables } from "../../environmentVariables";
import { cognitoUserSingleton } from "../../classes/CognitoUserSingleton";
import { CognitoUserSession } from "amazon-cognito-identity-js";

export const useAxiosInterceptor = () => {
    const history = useHistory();
    useLayoutEffect(() => {
        Axios.interceptors.response.use(undefined, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            if (error.response.status === HttpStatusCode.Unauthorized) {
                history.push("/sign-in");
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
