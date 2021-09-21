import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { RouteCreator } from "../../../../utils/routeCreator";
import { useCompanyUser } from "../useCompanyUser";

export function useIsCheckingForCompanyAccess() {
    const user = useCompanyUser();
    const isCompanyUser = !!user;
    const history = useHistory();

    const [
        isCheckingForCompanyAccess,
        setIsCheckingForCompanyAccess,
    ] = useState(true);
    useEffect(() => {
        if (!isCompanyUser) {
            const route = RouteCreator.companies();
            history.push(route);
        } else {
            setIsCheckingForCompanyAccess(false);
        }
    }, [isCompanyUser]);

    return isCheckingForCompanyAccess;
}
