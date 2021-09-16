import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
            history.push("/app/companies");
        } else {
            setIsCheckingForCompanyAccess(false);
        }
    }, [isCompanyUser]);

    return isCheckingForCompanyAccess;
}
