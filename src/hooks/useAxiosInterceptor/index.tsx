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
            config.headers["AuthHeader"] = localStorage.getItem("token") || "";

            const isAuthenticatedApi = config?.url?.startsWith(
                environmentVariables.baseAuthenticatedApiUrl || "unused"
            );
            if (isAuthenticatedApi) {
                const session = await new Promise<CognitoUserSession | null>(
                    (resolve, reject) => {
                        cognitoUserSingleton.cognitoUser.getSession(
                            (
                                error: Error | null,
                                session: CognitoUserSession | null
                            ) => {
                                resolve(session);
                            }
                        );
                    }
                );

                if (session === null) {
                    return config;
                }

                const refreshToken = session.getRefreshToken();
                await new Promise<void>((resolve, reject) => {
                    cognitoUserSingleton.cognitoUser.refreshSession(
                        refreshToken,
                        (error, session) => {
                            localStorage.setItem(
                                "token",
                                session.getIdToken().getJwtToken()
                            );
                            resolve();
                        }
                    );
                });
            }

            return Promise.resolve(config);
        });
    }, []);
};
