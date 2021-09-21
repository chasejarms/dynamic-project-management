/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { CircularProgress } from "@material-ui/core";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { WrappedButton } from "../../../../components/wrappedButton";
import { EditableColumnCard } from "./components/editableColumnCard";
import { BoardContainer } from "../components/boardContainer";
import { ContentWithDynamicToolbar } from "../components/contentWithDynamicToolbar";
import { useBoardColumnEditState } from "./hooks/useBoardColumnEditState";
import { CenterErrorMessage } from "./components/centerErrorMessage";

export function BoardEdit() {
    return (
        <BoardContainer>
            <BoardEditInnerContent />
        </BoardContainer>
    );
}

export function BoardEditInnerContent() {
    const classes = createClasses();

    const {
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
                                                            disableDeleteButton={
                                                                disableDeleteButton
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
        <>
            {failedToLoadColumnData ? (
                <CenterErrorMessage message="Error loading column data" />
            ) : (
                <ContentWithDynamicToolbar
                    toolbarContent={toolbarContent}
                    mainContent={mainContent}
                />
            )}
        </>
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

    const columnsContainer = css`
        width: 100%;
        display: flex;
        overflow: auto;
        padding: 32px;
        padding-top: 0;
    `;

    const columnAndHeaderContainer = css`
        width: 100%;
        height: 100%;
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
        columnsContainer,
        columnAndHeaderContainer,
        mainContentContainer,
        toolbarContainer,
        actionButtonContainer,
    };
}
