import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../useAppRouterParams";
import { useCompanyUser } from "../useCompanyUser";

export function useIsCheckingForBoardAccess() {
    const user = useCompanyUser();
    const { boardId } = useAppRouterParams();
    const isBoardUser = user?.boardRights[boardId];
    const history = useHistory();

    const [isCheckingForBoardAccess, setIsCheckingForBoardAccess] = useState(
        true
    );
    useEffect(() => {
        if (!isBoardUser) {
            history.push(`/app/companies`);
        } else {
            setIsCheckingForBoardAccess(false);
        }
    }, [isBoardUser]);

    return isCheckingForBoardAccess;
}
