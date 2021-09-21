import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { RouteCreator } from "../../../../../utils/routeCreator";
import { useCompanyUser } from "../../../hooks/useCompanyUser";

export function useIsCheckingForBoardAccess() {
    const user = useCompanyUser();
    const isCompanyUser = !!user;
    const history = useHistory();

    const [isCheckingForBoardAccess, setIsCheckingForBoardAccess] = useState(
        true
    );
    useEffect(() => {
        if (!isCompanyUser) {
            const route = RouteCreator.companies();
            history.push(route);
        } else {
            setIsCheckingForBoardAccess(false);
        }
    }, [isCompanyUser]);

    return isCheckingForBoardAccess;
}
