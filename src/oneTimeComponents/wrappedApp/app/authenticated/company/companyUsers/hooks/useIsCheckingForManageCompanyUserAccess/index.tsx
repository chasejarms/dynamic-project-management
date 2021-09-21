import { useState, useEffect } from "react";
import { useCompanyUser } from "../../../hooks/useCompanyUser";
import { useHistory } from "react-router-dom";
import { RouteCreator } from "../../../../../utils/routeCreator";

export function useIsCheckingForManageCompanyUserAccess() {
    const user = useCompanyUser();
    const canManageCompanyUsers = !!user?.canManageCompanyUsers;
    const history = useHistory();

    const [
        isCheckingForManageCompanyUserAccess,
        setIsCheckingForManageCompanyUserAccess,
    ] = useState(true);
    useEffect(() => {
        if (!canManageCompanyUsers) {
            const route = RouteCreator.companies();
            history.push(route);
        } else {
            setIsCheckingForManageCompanyUserAccess(false);
        }
    }, [canManageCompanyUsers]);

    return isCheckingForManageCompanyUserAccess;
}
