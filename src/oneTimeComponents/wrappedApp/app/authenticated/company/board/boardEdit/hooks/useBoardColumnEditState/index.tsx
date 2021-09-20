import { isEqual } from "lodash";
import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../redux/storeState";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";

export function useBoardColumnEditState() {
    const { boardId } = useAppRouterParams();

    const { databaseColumns, localColumnControls } = useSelector(
        (store: IStoreState) => {
            return store.boardColumnEditMappedState[boardId];
        }
    );

    const isInErrorState = localColumnControls.some(({ labelError }) => {
        return !!labelError;
    });
    const hasChanged =
        localColumnControls.length !== databaseColumns.length ||
        localColumnControls.some((databaseColumnControl, index) => {
            const { labelError, ...compareLocalColumn } = databaseColumnControl;

            const compareDatabaseColumn = databaseColumns[index];

            return !isEqual(compareLocalColumn, compareDatabaseColumn);
        });

    return {
        isInErrorState,
        hasChanged,
        localColumnControls,
    };
}
