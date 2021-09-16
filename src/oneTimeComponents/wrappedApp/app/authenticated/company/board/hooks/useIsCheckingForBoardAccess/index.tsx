import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useCompanyUser } from "../../../../../../../../hooks/useCompanyUser";

export function useIsCheckingForBoardAccess() {
    const user = useCompanyUser();
    const isCompanyUser = !!user;
    const history = useHistory();

    const [isCheckingForBoardAccess, setIsCheckingForBoardAccess] = useState(
        true
    );
    useEffect(() => {
        if (!isCompanyUser) {
            history.push(`/app/companies`);
        } else {
            setIsCheckingForBoardAccess(false);
        }
    }, [isCompanyUser]);

    return isCheckingForBoardAccess;
}
