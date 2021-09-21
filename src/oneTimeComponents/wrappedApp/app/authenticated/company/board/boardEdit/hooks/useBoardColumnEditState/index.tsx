import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../redux/storeState";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { useHistory } from "react-router-dom";
import { DropResult } from "react-beautiful-dnd";
import {
    resetLocalColumnControlChanges,
    setInitialBoardColumnState,
    updateBoardColumnPosition,
} from "../../../../../../../../../redux/boardColumnEditMappedState";
import { useState, useEffect } from "react";
import { Api } from "../../../../../../../../../api";
import { RouteCreator } from "../../../../../../utils/routeCreator";

export function useBoardColumnEditState() {
    const { boardId, companyId } = useAppRouterParams();
    const dispatch = useDispatch();

    const isLoadingColumns = useSelector((store: IStoreState) => {
        return !store.boardColumnEditMappedState[boardId];
    });

    const [failedToLoadColumnData, setFailedToLoadColumnData] = useState(false);
    useEffect(() => {
        if (!isLoadingColumns) return;
        let didCancel = false;

        Api.columns
            .getColumns(companyId, boardId)
            .then((columnsFromApi) => {
                if (didCancel) return;
                const setInitialBoardColumnStateAction = setInitialBoardColumnState(
                    {
                        boardId,
                        columns: columnsFromApi,
                    }
                );
                dispatch(setInitialBoardColumnStateAction);
            })
            .catch(() => {
                if (didCancel) return;
                setFailedToLoadColumnData(true);
            })
            .finally(() => {
                if (didCancel) return;
            });

        return () => {
            didCancel = true;
        };
    }, [companyId, boardId]);

    const [isSavingColumns, setIsSavingColumns] = useState(false);
    useEffect(() => {
        if (!isSavingColumns) return;

        let didCancel = false;

        const localColumns = localColumnControls.map(
            ({ nameError, ...localColumn }) => {
                return localColumn;
            }
        );
        Api.columns
            .updateColumns(companyId, boardId, localColumns)
            .then((updatedColumns) => {
                if (didCancel) return;
                const setInitialBoardColumnStateAction = setInitialBoardColumnState(
                    {
                        boardId,
                        columns: updatedColumns,
                    }
                );
                dispatch(setInitialBoardColumnStateAction);
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsSavingColumns(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isSavingColumns]);

    function saveColumns() {
        setIsSavingColumns(true);
    }

    const { databaseColumns, localColumnControls } = useSelector(
        (store: IStoreState) => {
            return (
                store.boardColumnEditMappedState[boardId] || {
                    databaseColumns: [],
                    localColumnControls: [],
                }
            );
        },
        () => {
            return isSavingColumns;
        }
    );
    const disableDeleteButton = localColumnControls.length <= 2;

    const isInErrorState = localColumnControls.some(({ nameError }) => {
        return !!nameError;
    });
    const columnDataHasChanged =
        localColumnControls.length !== databaseColumns.length ||
        localColumnControls.some((databaseColumnControl, index) => {
            const { nameError, ...compareLocalColumn } = databaseColumnControl;

            const compareDatabaseColumn = databaseColumns[index];

            return !isEqual(compareLocalColumn, compareDatabaseColumn);
        });

    const history = useHistory();
    function navigateBackToBoard() {
        const route = RouteCreator.inProgressTickets(companyId, boardId);
        history.push(route);
    }

    function onDragEnd(result: DropResult) {
        const { destination, source } = result;
        if (!destination) return;

        const updateBoardColumnPositionAction = updateBoardColumnPosition({
            boardId,
            previousIndex: source.index,
            updatedIndex: destination.index,
        });
        dispatch(updateBoardColumnPositionAction);
    }

    function resetChanges() {
        const resetChangesAction = resetLocalColumnControlChanges({
            boardId,
        });
        dispatch(resetChangesAction);
    }

    return {
        isInErrorState,
        columnDataHasChanged,
        localColumnControls,
        navigateBackToBoard,
        disableDeleteButton,
        onDragEnd,
        isLoadingColumns,
        resetChanges,
        saveColumns,
        isSavingColumns,
        failedToLoadColumnData,
    };
}
