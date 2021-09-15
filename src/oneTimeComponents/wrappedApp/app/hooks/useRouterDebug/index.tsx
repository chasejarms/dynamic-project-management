import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useRouterDebug = (isEnabled: boolean) => {
    const location = useLocation();
    useEffect(() => {
        if (isEnabled) {
            console.log("pathname: ", location.pathname);
        }
    }, [location.pathname]);
};
