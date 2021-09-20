import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../redux/storeState";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { useHistory } from "react-router-dom";
import { DropResult } from "react-beautiful-dnd";
import {
    setInitialBoardColumnState,
    updateBoardColumnPosition,
} from "../../../../../../../../../redux/boardColumnEditMappedState";
import { useState, useEffect } from "react";
import { Api } from "../../../../../../../../../api";

export function useBoardColumnEditState() {
    const { boardId, companyId } = useAppRouterParams();
    const dispatch = useDispatch();

    const isLoadingColumns = useSelector((store: IStoreState) => {
        return !store.boardColumnEditMappedState[boardId];
    });

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
                // maybe do some sort of error logic
            })
            .finally(() => {
                if (didCancel) return;
            });

        return () => {
            didCancel = true;
        };
    }, [companyId, boardId]);

    const { databaseColumns, localColumnControls } = useSelector(
        (store: IStoreState) => {
            return (
                store.boardColumnEditMappedState[boardId] || {
                    databaseColumns: [],
                    localColumnControls: [],
                }
            );
        }
    );
    const hideDeleteButton = localColumnControls.length <= 2;

    const isInErrorState = localColumnControls.some(({ labelError }) => {
        return !!labelError;
    });
    const columnDataHasChanged =
        localColumnControls.length !== databaseColumns.length ||
        localColumnControls.some((databaseColumnControl, index) => {
            const { labelError, ...compareLocalColumn } = databaseColumnControl;

            const compareDatabaseColumn = databaseColumns[index];

            return !isEqual(compareLocalColumn, compareDatabaseColumn);
        });

    const history = useHistory();
    function navigateBackToBoard() {
        history.push(`/app/company/${companyId}/board/${boardId}/tickets/`);
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

    return {
        isInErrorState,
        columnDataHasChanged,
        localColumnControls,
        navigateBackToBoard,
        hideDeleteButton,
        onDragEnd,
        isLoadingColumns,
    };
}
