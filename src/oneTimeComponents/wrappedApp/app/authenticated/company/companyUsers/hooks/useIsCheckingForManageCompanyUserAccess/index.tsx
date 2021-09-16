import { useState, useEffect } from "react";
import { useCompanyUser } from "../../../hooks/useCompanyUser";
import { useHistory } from "react-router-dom";

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
            history.push(`/app/companies`);
        } else {
            setIsCheckingForManageCompanyUserAccess(false);
        }
    }, [canManageCompanyUsers]);

    return isCheckingForManageCompanyUserAccess;
}
