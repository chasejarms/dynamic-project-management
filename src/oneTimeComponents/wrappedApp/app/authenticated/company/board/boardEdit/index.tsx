/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { CircularProgress } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { WrappedButton } from "../../../../components/wrappedButton";
import { EditableColumnCard } from "./components/editableColumnCard";
import { BoardContainer } from "../components/boardContainer";
import { ContentWithDynamicToolbar } from "../components/contentWithDynamicToolbar";
import { useBoardColumnEditState } from "./hooks/useBoardColumnEditState";

export function BoardEdit() {
    const classes = createClasses();

    const {
        isInErrorState,
        columnDataHasChanged,
        localColumnControls,
        navigateBackToBoard,
        hideDeleteButton,
        onDragEnd,
        isLoadingColumns,
        resetChanges,
        saveColumns,
        isSavingColumns,
    } = useBoardColumnEditState();

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
                    disabled={
                        !columnDataHasChanged ||
                        isSavingColumns ||
                        isInErrorState
                    }
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
                                                            index={index}
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
