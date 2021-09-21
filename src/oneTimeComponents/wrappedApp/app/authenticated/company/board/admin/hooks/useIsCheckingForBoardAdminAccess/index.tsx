import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { RouteCreator } from "../../../../../../utils/routeCreator";
import { useCompanyUser } from "../../../../hooks/useCompanyUser";

export function useIsCheckingForBoardAdminAccess() {
    const user = useCompanyUser();
    const { boardId } = useAppRouterParams();
    const isBoardUser = user?.boardRights[boardId];
    const isBoardAdmin = isBoardUser && !!user?.boardRights[boardId].isAdmin;
    const history = useHistory();

    const [
        isCheckingForBoardAdminAccess,
        setIsCheckingForBoardAdminAccess,
    ] = useState(true);
    useEffect(() => {
        if (!isBoardAdmin) {
            const route = RouteCreator.companies();
            history.push(route);
        } else {
            setIsCheckingForBoardAdminAccess(false);
        }
    }, [isBoardAdmin]);

    return isCheckingForBoardAdminAccess;
}
