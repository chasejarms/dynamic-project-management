import { useState, useEffect } from "react";
import { useCompanyUser } from "../useCompanyUser";
import { useHistory } from "react-router-dom";

export function useIsCheckingForCreateBoardsAccess() {
    const user = useCompanyUser();
    const canCreateBoards = !!user?.canCreateBoards;
    const history = useHistory();

    const [
        isCheckingForCreateBoardsAccess,
        setIsCheckingForCreateBoardsAccess,
    ] = useState(true);
    useEffect(() => {
        if (!canCreateBoards) {
            history.push(`/app/companies`);
        } else {
            setIsCheckingForCreateBoardsAccess(false);
        }
    }, [canCreateBoards]);

    return isCheckingForCreateBoardsAccess;
}
