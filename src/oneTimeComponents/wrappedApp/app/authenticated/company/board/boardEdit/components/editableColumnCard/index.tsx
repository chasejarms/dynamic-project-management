import { Delete, DragIndicator, Add } from "@mui/icons-material";
import { IconButton, Box } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { WrappedTextField } from "../../../../../../components/wrappedTextField";
import { TicketContainer } from "../../../components/ticketContainer";
import { useIndividualBoardColumnEditState } from "../../hooks/useIndividualBoardColumnEditState";
import React from "react";
import { uncategorizedColumnReservedId } from "../../../../../../../../../constants/reservedColumnIds";
import { editableColumnCardTestIds } from "./editableColumnCard.testIds";

export interface IEditableColumnCardProps {
    index: number;
    disabled?: boolean;
    disableDeleteButton: boolean;
    isLastColumn?: boolean;
}

function NonMemoizedEditableColumnCard(props: IEditableColumnCardProps) {
    const {
        name,
        canBeModified,
        id,
        nameError,
        onDeleteColumn,
        onUpdateColumn,
        onClickAddAfter,
    } = useIndividualBoardColumnEditState(props.index);

    const showDeleteButton = id !== uncategorizedColumnReservedId;
    return (
        <Draggable draggableId={id} index={props.index}>
            {(provided) => {
                return (
                    <Box
                        sx={{
                            marginRight: !!props.isLastColumn ? 0 : 2,
                            width: "360px",
                            minWidth: "360px",
                            padding: "2px",
                        }}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <TicketContainer
                            title={name}
                            topRightIcon={
                                <Box
                                    {...provided.dragHandleProps}
                                    sx={{
                                        visibility: canBeModified
                                            ? "visible"
                                            : "hidden",
                                    }}
                                >
                                    <DragIndicator />
                                </Box>
                            }
                        >
                            <Box
                                sx={{
                                    py: 2,
                                    px: 0,
                                }}
                            >
                                <div>
                                    <WrappedTextField
                                        value={name}
                                        label="Column Name"
                                        onChange={onUpdateColumn(props.index)}
                                        error={nameError}
                                        disabled={
                                            !canBeModified || props.disabled
                                        }
                                        testIds={
                                            editableColumnCardTestIds.nameTextField
                                        }
                                    />
                                </div>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        flexDirection: "row",
                                    }}
                                >
                                    <div>
                                        {showDeleteButton && (
                                            <IconButton
                                                onClick={onDeleteColumn(
                                                    props.index
                                                )}
                                                disabled={
                                                    props.disabled ||
                                                    !!props.disableDeleteButton
                                                }
                                                data-testid={
                                                    editableColumnCardTestIds.deleteButton
                                                }
                                            >
                                                <Delete />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            onClick={onClickAddAfter(
                                                props.index
                                            )}
                                            disabled={props.disabled}
                                            data-testid={
                                                editableColumnCardTestIds.addButton
                                            }
                                        >
                                            <Add />
                                        </IconButton>
                                    </div>
                                </Box>
                            </Box>
                        </TicketContainer>
                    </Box>
                );
            }}
        </Draggable>
    );
}

export const EditableColumnCard = React.memo(NonMemoizedEditableColumnCard);
