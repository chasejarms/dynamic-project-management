/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useState, useEffect, ChangeEvent } from "react";
import { CircularProgress } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { cloneDeep } from "lodash";
import { Api } from "../../../../../../../api";
import { StringValidator } from "../../../../../../../classes/StringValidator";
import { IColumn } from "../../../../../../../models/column";
import { WrappedButton } from "../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../hooks/useAppRouterParams";
import { useControl } from "../../../../hooks/useControl";
import { EditableColumnCard } from "./components/editableColumnCard";
import { generateUniqueId } from "./hooks/utils/generateUniqueId";
import { BoardContainer } from "../components/boardContainer";
import { ContentWithDynamicToolbar } from "../components/contentWithDynamicToolbar";
import { useBoardColumnEditState } from "./hooks/useBoardColumnEditState";

export function BoardEdit() {
    const classes = createClasses();

    const { boardId, companyId } = useAppRouterParams();

    const {
        isInErrorState,
        columnDataHasChanged,
        localColumnControls,
        navigateBackToBoard,
        hideDeleteButton,
        onDragEnd,
        isLoadingColumns,
    } = useBoardColumnEditState();

    const [{ databaseColumns, localColumns }, setColumnData] = useState<{
        databaseColumns: IColumn[];
        localColumns: IColumn[];
    }>({
        databaseColumns: [],
        localColumns: [],
    });

    function setLocalAndDatabaseColumns(columns: IColumn[]) {
        setColumnData(() => {
            return {
                databaseColumns: columns,
                localColumns: columns,
            };
        });
    }

    function resetChanges() {
        setColumnData((previousDatabaseAndLocalColumns) => {
            return {
                databaseColumns:
                    previousDatabaseAndLocalColumns.databaseColumns,
                localColumns: previousDatabaseAndLocalColumns.databaseColumns,
            };
        });
    }

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

    const toolbarContent = (
        <div css={classes.toolbarContainer}>
            <div>
                <WrappedButton
                    disabled={columnDataHasChanged || isSavingColumns}
                    onClick={navigateBackToBoard}
                    variant="text"
                    color="primary"
                >
                    Back To Board
                </WrappedButton>
            </div>
            <div css={classes.actionButtonContainer}>
                <WrappedButton
                    disabled={!columnDataHasChanged || isSavingColumns}
                    onClick={resetChanges}
                    variant="text"
                    color="secondary"
                >
                    Reset Changes
                </WrappedButton>
                <WrappedButton
                    disabled={!columnDataHasChanged || isSavingColumns}
                    showSpinner={isSavingColumns}
                    onClick={saveColumns}
                    variant="contained"
                    color="primary"
                >
                    Save Changes
                </WrappedButton>
            </div>
        </div>
    );

    const mainContent = (
        <div css={classes.mainContentContainer}>
            <DragDropContext onDragEnd={onDragEnd}>
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
                            <Droppable
                                droppableId="board-columns"
                                direction="horizontal"
                            >
                                {(provided) => {
                                    return (
                                        <div
                                            css={classes.columnsContainer}
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {localColumnControls.map(
                                                (column, index) => {
                                                    const isLastColumn =
                                                        localColumnControls.length -
                                                            1 ===
                                                        index;
                                                    return (
                                                        <EditableColumnCard
                                                            key={column.id}
                                                            column={column}
                                                            index={index}
                                                            onDeleteColumn={
                                                                onDeleteColumn
                                                            }
                                                            onUpdateColumn={
                                                                onUpdateColumn
                                                            }
                                                            disabled={
                                                                isSavingColumns
                                                            }
                                                            hideDeleteButton={
                                                                hideDeleteButton
                                                            }
                                                            isLastColumn={
                                                                isLastColumn
                                                            }
                                                        />
                                                    );
                                                }
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    );
                                }}
                            </Droppable>
                        </div>
                    )}
                </div>
            </DragDropContext>
        </div>
    );

    return (
        <BoardContainer>
            <ContentWithDynamicToolbar
                toolbarContent={toolbarContent}
                mainContent={mainContent}
            />
        </BoardContainer>
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
        padding-top: 0;
    `;

    const secondComponentColumnsContainer = css`
        overflow: auto;
    `;

    const columnAndHeaderContainer = css`
        width: 100%;
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

    const mainContentContainer = css`
        flex-grow: 1;
    `;

    const toolbarContainer = css`
        padding: 0px 24px 0 24px;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;

    const actionButtonContainer = css`
        display: grid;
        grid-gap: 8px;
        grid-template-columns: 1fr 1fr;
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
        mainContentContainer,
        toolbarContainer,
        actionButtonContainer,
    };
}
