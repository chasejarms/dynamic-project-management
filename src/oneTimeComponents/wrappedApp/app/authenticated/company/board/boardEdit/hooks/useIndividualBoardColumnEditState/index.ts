import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addColumnAfter,
    deleteColumn,
    updateLocalColumnControl,
} from "../../../../../../../../../redux/boardColumnEditMappedState";
import { IStoreState } from "../../../../../../../../../redux/storeState";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";

export function useIndividualBoardColumnEditState(index: number) {
    const { boardId } = useAppRouterParams();

    const nameError = useSelector((store: IStoreState) => {
        return store.boardColumnEditMappedState[boardId].localColumnControls[
            index
        ].nameError;
    });

    const id = useSelector((store: IStoreState) => {
        return store.boardColumnEditMappedState[boardId].localColumnControls[
            index
        ].id;
    });

    const name = useSelector((store: IStoreState) => {
        return store.boardColumnEditMappedState[boardId].localColumnControls[
            index
        ].name;
    });

    const canBeModified = useSelector((store: IStoreState) => {
        return store.boardColumnEditMappedState[boardId].localColumnControls[
            index
        ].canBeModified;
    });

    const dispatch = useDispatch();
    function onDeleteColumn(index: number) {
        return () => {
            const deleteColumnAction = deleteColumn({
                boardId,
                index,
            });
            dispatch(deleteColumnAction);
        };
    }

    function onUpdateColumn(index: number) {
        return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const updatedValue = event.target.value;
            const updateColumnAction = updateLocalColumnControl({
                boardId,
                updatedValue,
                index,
            });
            dispatch(updateColumnAction);
        };
    }

    function onClickAddAfter(index: number) {
        return () => {
            const addColumnAfterAction = addColumnAfter({
                boardId,
                index,
            });
            dispatch(addColumnAfterAction);
        };
    }

    return {
        nameError,
        id,
        name,
        canBeModified,
        onDeleteColumn,
        onUpdateColumn,
        onClickAddAfter,
    };
}
