import { useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { HttpStatusCode } from "../../models/httpStatusCode";
import Axios from "axios";

export const useAxiosInterceptor = () => {
    const history = useHistory();
    useLayoutEffect(() => {
        Axios.interceptors.response.use(undefined, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            if (error.response.status === HttpStatusCode.Unauthorized) {
                history.push("/development-sign-in");
            }

            return Promise.reject(error);
        });

        Axios.interceptors.request.use((config) => {
            config.headers["AuthHeader"] = localStorage.getItem("token") || "";
            return config;
        });
    }, []);
};
