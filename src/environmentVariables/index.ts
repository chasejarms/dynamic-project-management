export const environmentVariables = {
    basePublicApiUrl: process.env.REACT_APP_UNAUTHENTICATED_URL,
    baseAuthenticatedApiUrl: process.env.REACT_APP_AUTHENTICATED_URL,
    isLocalDevelopment: process.env.REACT_APP_DEV_ENVIRONMENT === "LOCAL",
};
