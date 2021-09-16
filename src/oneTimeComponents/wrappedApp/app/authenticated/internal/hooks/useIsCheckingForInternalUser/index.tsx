import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useInternalUser } from "../../../../../../../hooks/useInternalUser";

export function useIsCheckingForInternalUser() {
    const internalUser = useInternalUser();
    const history = useHistory();

    const [isCheckingForInternalUser, setIsCheckingForInternalUser] = useState(
        true
    );
    useEffect(() => {
        if (!internalUser) {
            history.push("/app/companies");
        } else {
            setIsCheckingForInternalUser(false);
        }
    }, [internalUser]);

    return isCheckingForInternalUser;
}
