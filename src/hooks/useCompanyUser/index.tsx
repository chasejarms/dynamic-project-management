import { useSelector } from "react-redux";
import { IStoreState } from "../../redux/storeState";
import { useAppRouterParams } from "../useAppRouterParams";

export function useCompanyUser() {
    const { companyId } = useAppRouterParams();
    const user = useSelector((state: IStoreState) => {
        return state.appBootstrapInformation.users.find((user) => {
            return user.belongsTo.includes(companyId);
        });
    });

    return user;
}
