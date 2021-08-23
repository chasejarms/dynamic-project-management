import { useSelector } from "react-redux";
import { IStoreState } from "../../redux/storeState";

export function useInternalUser() {
    const internalUser = useSelector((state: IStoreState) => {
        return state.appBootstrapInformation.internalUser;
    });

    return internalUser;
}
