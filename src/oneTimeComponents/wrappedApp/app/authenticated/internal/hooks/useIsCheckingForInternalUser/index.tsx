import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { RouteCreator } from "../../../../utils/routeCreator";
import { useInternalUser } from "./useInternalUser";

export function useIsCheckingForInternalUser() {
    const internalUser = useInternalUser();
    const history = useHistory();

    const [isCheckingForInternalUser, setIsCheckingForInternalUser] = useState(
        true
    );
    useEffect(() => {
        if (!internalUser) {
            const route = RouteCreator.companies();
            history.push(route);
        } else {
            setIsCheckingForInternalUser(false);
        }
    }, [internalUser]);

    return isCheckingForInternalUser;
}
