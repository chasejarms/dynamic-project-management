/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useState, useEffect, ChangeEvent } from "react";
import {
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { isEqual, cloneDeep } from "lodash";
import { useAppRouterParams } from "../../../../../hooks/useAppRouterParams";
import { Api } from "../../../../../../../../api";
import { StringValidator } from "../../../../../../../../classes/StringValidator";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../components/wrappedTextField";
import { useControl } from "../../../../../hooks/useControl";
import { IColumn } from "../../../../../../../../models/column";
import { generateUniqueId } from "./utils/generateUniqueId";
import { EditableColumnCard } from "./components/editableColumnCard";
import { BottomPageToolbar } from "../../../components/bottomPageToolbar";
import { BoardAdminContainer } from "../components/boardAdminContainer";

export function Columns() {
    const classes = createClasses();

    const { boardId, companyId } = useAppRouterParams();

    const [{ databaseColumns, localColumns }, setColumnData] = useState<{
        databaseColumns: IColumn[];
        localColumns: IColumn[];
    }>({
        databaseColumns: [],
        localColumns: [],
    });
    const columnDataHasChanged = !isEqual(databaseColumns, localColumns);

    function setLocalAndDatabaseColumns(columns: IColumn[]) {
        setColumnData(() => {
            return {
                databaseColumns: columns,
                localColumns: columns,
            };
        });
    }

    const [showComponentOne, setShowComponentOne] = useState(true);
    function resetEditableColumnState() {
        setShowComponentOne((previous) => !previous);
    }
    function resetChanges() {
        setColumnData((previousDatabaseAndLocalColumns) => {
            return {
                databaseColumns:
                    previousDatabaseAndLocalColumns.databaseColumns,
                localColumns: previousDatabaseAndLocalColumns.databaseColumns,
            };
        });
        resetEditableColumnState();
    }

    const [isLoadingColumns, setIsLoadingColumns] = useState(true);
    useEffect(() => {
        if (!boardId || !companyId) return;
        let didCancel = false;

        Api.columns
            .getColumns(companyId, boardId)
            .then((columnsFromApi) => {
                if (didCancel) return;
                setLocalAndDatabaseColumns([...columnsFromApi]);
            })
            .catch(() => {
                if (didCancel) return;
                // maybe do some sort of error logic
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingColumns(false);
            });

        return () => {
            didCancel = true;
        };
    }, [companyId, boardId]);

    const [isSavingColumns, setIsSavingColumns] = useState(false);
    useEffect(() => {
        if (!isSavingColumns) return;

        let didCancel = false;

        // maybe consider adding a snackbar or something like that?
        Api.columns
            .updateColumns(companyId, boardId, localColumns)
            .then((updatedColumns) => {
                if (didCancel) return;
                setLocalAndDatabaseColumns(updatedColumns);
                resetEditableColumnState();
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

    function onDeleteColumn(index: number) {
        setColumnData((previousDatabaseAndLocalColumns) => {
            const columnsBeforeIndex = previousDatabaseAndLocalColumns.localColumns.slice(
                0,
                index
            );
            const columnsAfterIndex = previousDatabaseAndLocalColumns.localColumns.slice(
                index + 1
            );
            const updatedLocalColumns = columnsBeforeIndex.concat(
                columnsAfterIndex
            );

            return {
                databaseColumns:
                    previousDatabaseAndLocalColumns.databaseColumns,
                localColumns: updatedLocalColumns,
            };
        });
    }

    function onUpdateColumn(index: number, column: IColumn) {
        setColumnData((previousDatabaseAndLocalColumns) => {
            const cloneOfLocalColumns = cloneDeep(
                previousDatabaseAndLocalColumns.localColumns
            );
            cloneOfLocalColumns[index] = column;

            return {
                databaseColumns:
                    previousDatabaseAndLocalColumns.databaseColumns,
                localColumns: cloneOfLocalColumns,
            };
        });
    }

    function createColumn() {
        setColumnData((previousDatabaseAndLocalColumns) => {
            const existingIds = previousDatabaseAndLocalColumns.databaseColumns.reduce<{
                [id: string]: boolean;
            }>((columnIdMapping, column) => {
                columnIdMapping[column.id] = true;
                return columnIdMapping;
            }, {});

            let id: string = "";
            while (id === "") {
                const uniqueColumnId = generateUniqueId(1);
                if (existingIds[uniqueColumnId] === undefined) {
                    id = uniqueColumnId;
                }
            }

            const newColumn: IColumn = {
                name: columnNameControl.value,
                id,
                canBeModified: true,
            };

            const previousFirstLocalColumns = previousDatabaseAndLocalColumns.localColumns.slice(
                0,
                1
            );
            const previousAfterFirstLocalColumns = previousDatabaseAndLocalColumns.localColumns.slice(
                1
            );
            const updatedLocalColumns = previousFirstLocalColumns
                .concat([newColumn])
                .concat(previousAfterFirstLocalColumns);

            return {
                databaseColumns:
                    previousDatabaseAndLocalColumns.databaseColumns,
                localColumns: updatedLocalColumns,
            };
        });
        setColumnCreationDialogIsOpen(false);
    }

    const [
        columnCreationDialogIsOpen,
        setColumnCreationDialogIsOpen,
    ] = useState(false);
    function openColumnCreationDialog() {
        setColumnCreationDialogIsOpen(true);
    }
    function closeColumnCreationDialog() {
        setColumnCreationDialogIsOpen(false);
    }

    const columnNameControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const updatedName = event.target.value;
            return updatedName;
        },
        validatorError: (email: string) => {
            return new StringValidator()
                .required("This field is required")
                .validate(email);
        },
    });
    const showColumnNameControl =
        columnNameControl.isTouched && !columnNameControl.isValid;

    function onDragEnd(result: DropResult) {
        const { destination, source } = result;
        if (!destination) return;

        setColumnData((previousLocalAndDatabaseColumns) => {
            const previousLocalColumns =
                previousLocalAndDatabaseColumns.localColumns;

            const columnToMove = previousLocalColumns[source.index];

            const arrayBeforeItem = previousLocalColumns.slice(0, source.index);
            const arrayAfterItem = previousLocalColumns.slice(source.index + 1);
            const arrayWithItemRemoved = arrayBeforeItem.concat(arrayAfterItem);

            const updatedDestinationIndex =
                destination.index === 0
                    ? 1
                    : destination.index === previousLocalColumns.length - 1
                    ? previousLocalColumns.length - 2
                    : destination.index;

            const arrayBeforeInsertedIndex = arrayWithItemRemoved.slice(
                0,
                updatedDestinationIndex
            );
            const arrayAfterInsertedIndex = arrayWithItemRemoved.slice(
                updatedDestinationIndex
            );
            const updatedLocalColumns = arrayBeforeInsertedIndex
                .concat([columnToMove])
                .concat(arrayAfterInsertedIndex);

            return {
                databaseColumns:
                    previousLocalAndDatabaseColumns.databaseColumns,
                localColumns: updatedLocalColumns,
            };
        });
    }

    const hideDeleteButton = localColumns.length <= 3;
    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            onClick: resetChanges,
            disabled: !columnDataHasChanged || isSavingColumns,
            children: "Reset Changes",
        },
        {
            disabled: !columnDataHasChanged || isSavingColumns,
            showSpinner: isSavingColumns,
            onClick: saveColumns,
            variant: "contained",
            color: "primary",
            children: "Save Changes",
        },
    ];

    return (
        <BoardAdminContainer>
            <div css={classes.container}>
                <div css={classes.contentContainer}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Dialog
                            open={columnCreationDialogIsOpen}
                            onClose={closeColumnCreationDialog}
                        >
                            <DialogTitle>Create Column</DialogTitle>
                            <DialogContent>
                                <div css={classes.columnInputContainer}>
                                    <WrappedTextField
                                        value={columnNameControl.value}
                                        label="Column Name"
                                        onChange={columnNameControl.onChange}
                                        error={
                                            showColumnNameControl
                                                ? columnNameControl.errorMessage
                                                : ""
                                        }
                                    />
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <WrappedButton
                                    onClick={closeColumnCreationDialog}
                                >
                                    Close
                                </WrappedButton>
                                <WrappedButton
                                    variant="contained"
                                    onClick={createColumn}
                                    color="primary"
                                    disabled={!columnNameControl.isValid}
                                >
                                    Create
                                </WrappedButton>
                            </DialogActions>
                        </Dialog>
                        <div css={classes.innerContentContainer}>
                            {isLoadingColumns ? (
                                <div css={classes.spinnerContainer}>
                                    <CircularProgress
                                        color="primary"
                                        size={24}
                                        thickness={4}
                                    />
                                </div>
                            ) : (
                                <div css={classes.columnAndHeaderContainer}>
                                    <div
                                        css={
                                            classes.columnCreationHeaderContainer
                                        }
                                    >
                                        <WrappedButton
                                            onClick={openColumnCreationDialog}
                                            startIcon={<Add />}
                                            color="primary"
                                        >
                                            Add Column
                                        </WrappedButton>
                                    </div>
                                    {showComponentOne ? (
                                        <DroppableColumns
                                            columns={localColumns}
                                            onDeleteColumn={onDeleteColumn}
                                            onUpdateColumn={onUpdateColumn}
                                            isSavingColumns={isSavingColumns}
                                            hideDeleteButton={hideDeleteButton}
                                        />
                                    ) : (
                                        <div
                                            css={
                                                classes.secondComponentColumnsContainer
                                            }
                                        >
                                            <DroppableColumns
                                                columns={localColumns}
                                                onDeleteColumn={onDeleteColumn}
                                                onUpdateColumn={onUpdateColumn}
                                                isSavingColumns={
                                                    isSavingColumns
                                                }
                                                hideDeleteButton={
                                                    hideDeleteButton
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </DragDropContext>
                </div>
                <div css={classes.bottomPageToolbarContainer}>
                    <BottomPageToolbar
                        wrappedButtonProps={wrappedButtonProps}
                    />
                </div>
            </div>
        </BoardAdminContainer>
    );
}

interface IDroppableColumnsProps {
    columns: IColumn[];
    onDeleteColumn: (index: number) => void;
    onUpdateColumn: (index: number, column: IColumn) => void;
    isSavingColumns: boolean;
    hideDeleteButton: boolean;
}

function DroppableColumns(props: IDroppableColumnsProps) {
    const classes = createClasses();

    return (
        <Droppable droppableId="board-columns" direction="horizontal">
            {(provided) => {
                return (
                    <div
                        css={classes.columnsContainer}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {props.columns.map((column, index) => {
                            const isLastColumn =
                                props.columns.length - 1 === index;
                            return (
                                <EditableColumnCard
                                    key={column.id}
                                    column={column}
                                    index={index}
                                    onDeleteColumn={props.onDeleteColumn}
                                    onUpdateColumn={props.onUpdateColumn}
                                    disabled={props.isSavingColumns}
                                    hideDeleteButton={props.hideDeleteButton}
                                    isLastColumn={isLastColumn}
                                />
                            );
                        })}
                        {provided.placeholder}
                    </div>
                );
            }}
        </Droppable>
    );
}

function createClasses() {
    const innerContentContainer = css`
        height: 100%;
    `;

    const spinnerContainer = css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    `;

    const columnContainer = css`
        margin-right: 16px;
        width: 300px;
        min-width: 300px;
    `;

    const columnActionContainer = css`
        width: 100%;
        display: flex;
        justify-content: flex-end;
    `;

    const columnsContainer = css`
        width: 100%;
        display: flex;
        overflow: auto;
        padding: 32px;
        padding-top: 16px;
    `;

    const secondComponentColumnsContainer = css`
        overflow: auto;
    `;

    const columnAndHeaderContainer = css`
        width: 100%;
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
    `;

    const columnCreationHeaderContainer = css`
        display: flex;
        justify-content: flex-start;
        padding: 16px 32px 0 32px;
    `;

    const columnInputContainer = css`
        width: 300px;
    `;

    const bottomPageToolbarContainer = css`
        flex: 0 0 auto;
    `;

    const contentContainer = css`
        flex-grow: 1;
    `;

    const container = css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    `;

    return {
        innerContentContainer,
        spinnerContainer,
        columnContainer,
        columnActionContainer,
        columnsContainer,
        columnAndHeaderContainer,
        columnCreationHeaderContainer,
        columnInputContainer,
        secondComponentColumnsContainer,
        contentContainer,
        bottomPageToolbarContainer,
        container,
    };
}
