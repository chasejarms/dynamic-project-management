import { Box } from "@mui/material";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { WrappedButton } from "../../../../components/wrappedButton";
import { EditableColumnCard } from "./components/editableColumnCard";
import { BoardContainer } from "../components/boardContainer";
import { ContentWithDynamicToolbar } from "../components/contentWithDynamicToolbar";
import { useBoardColumnEditState } from "./hooks/useBoardColumnEditState";
import { CenterErrorMessage } from "./components/centerErrorMessage";
import { boardEditTestIds } from "./boardEdit.testIds";
import { CenterLoadingSpinner } from "../../../components/centerLoadingSpinner";

export function BoardEdit() {
    return (
        <BoardContainer>
            <BoardEditInnerContent />
        </BoardContainer>
    );
}

export function BoardEditInnerContent() {
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
        <Box
            sx={{
                py: 0,
                px: 3,
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <div>
                <WrappedButton
                    disabled={columnDataHasChanged || isSavingColumns}
                    onClick={navigateBackToBoard}
                    variant="outlined"
                    color="primary"
                    testIds={boardEditTestIds.backToBoardButton}
                >
                    Back To Board
                </WrappedButton>
            </div>
            <Box
                sx={{
                    display: "grid",
                    gap: 1,
                    gridTemplateColumns: "1fr 1fr",
                }}
            >
                <WrappedButton
                    disabled={!columnDataHasChanged || isSavingColumns}
                    onClick={resetChanges}
                    variant="outlined"
                    color="secondary"
                    testIds={boardEditTestIds.resetChangesButton}
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
                    testIds={boardEditTestIds.saveButton}
                >
                    Save Changes
                </WrappedButton>
            </Box>
        </Box>
    );

    const mainContent = (
        <Box
            sx={{
                height: "100%",
            }}
        >
            <DragDropContext onDragEnd={onDragEnd}>
                <Box
                    sx={{
                        height: "100%",
                    }}
                >
                    {isLoadingColumns ? (
                        <CenterLoadingSpinner size="large" />
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <Droppable
                                droppableId="board-columns"
                                direction="horizontal"
                            >
                                {(provided) => {
                                    return (
                                        <Box
                                            sx={{
                                                width: "100%",
                                                display: "flex",
                                                overflow: "auto",
                                                padding: 4,
                                                paddingTop: 0,
                                            }}
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
                                        </Box>
                                    );
                                }}
                            </Droppable>
                        </Box>
                    )}
                </Box>
            </DragDropContext>
        </Box>
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
