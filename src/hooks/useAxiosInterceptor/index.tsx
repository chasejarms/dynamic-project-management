import Axios from "axios";
import { useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { HttpStatusCode } from "../../models/httpStatusCode";

export const axiosInstance = Axios.create();

export const useAxiosInterceptor = () => {
    const history = useHistory();
    useLayoutEffect(() => {
        axiosInstance.interceptors.response.use(undefined, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            console.log("error: ", error);
            if (error.response.status === HttpStatusCode.Unauthorized) {
                history.push("/development-sign-in");
            }

            return Promise.reject(error);
        });

        axiosInstance.interceptors.request.use((config) => {
            config.headers["AuthHeader"] = localStorage.getItem("token") || "";
            return config;
        });
    }, []);
};
