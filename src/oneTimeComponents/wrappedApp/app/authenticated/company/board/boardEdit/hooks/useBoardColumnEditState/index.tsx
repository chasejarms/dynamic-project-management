import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../redux/storeState";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";

export function useBoardColumnEditState() {
    const { boardId } = useAppRouterParams();

    const { databaseColumnControls, localColumns } = useSelector(
        (store: IStoreState) => {
            return store.boardColumnEditMappedState[boardId];
        }
    );

    const isInErrorState = databaseColumnControls.some(({ labelError }) => {
        return !!labelError;
    });
    const hasChanged =
        databaseColumnControls.length !== localColumns.length ||
        databaseColumnControls.some(() => {});
}
