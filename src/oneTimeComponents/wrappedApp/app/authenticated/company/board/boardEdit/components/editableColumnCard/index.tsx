/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Delete, DragIndicator, Add } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import { composeCSS } from "../../../../../../../../../styles/composeCSS";
import { WrappedTextField } from "../../../../../../components/wrappedTextField";
import { TicketContainer } from "../../../components/ticketContainer";
import { useIndividualBoardColumnEditState } from "../../hooks/useIndividualBoardColumnEditState";
import React from "react";
import { uncategorizedColumnReservedId } from "../../../../../../../../../constants/reservedColumnIds";
import { editableColumnCardTestsIds } from "./editableColumnCard.testIds";

export interface IEditableColumnCardProps {
    index: number;
    disabled?: boolean;
    disableDeleteButton: boolean;
    isLastColumn?: boolean;
}

function NonMemoizedEditableColumnCard(props: IEditableColumnCardProps) {
    const classes = createClasses();

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
                    <div
                        css={composeCSS(
                            classes.columnContainer,
                            !!props.isLastColumn &&
                                classes.columnContainerNoMargin
                        )}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <TicketContainer
                            title={name}
                            topRightIcon={
                                <div
                                    {...provided.dragHandleProps}
                                    css={composeCSS(
                                        !canBeModified &&
                                            classes.hiddenDragHandle
                                    )}
                                >
                                    <DragIndicator />
                                </div>
                            }
                        >
                            <div css={classes.content}>
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
                                            editableColumnCardTestsIds.nameTextField
                                        }
                                    />
                                </div>
                                <div css={classes.actionButtonContainer}>
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
                                            >
                                                <Delete />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            onClick={onClickAddAfter(
                                                props.index
                                            )}
                                            disabled={props.disabled}
                                        >
                                            <Add />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        </TicketContainer>
                    </div>
                );
            }}
        </Draggable>
    );
}

export const EditableColumnCard = React.memo(NonMemoizedEditableColumnCard);

function createClasses() {
    const columnContainer = css`
        margin-right: 16px;
        width: 360px;
        min-width: 360px;
        padding: 2px;
    `;

    const columnContainerNoMargin = css`
        margin-right: 0;
    `;

    const hiddenDragHandle = css`
        visibility: hidden;
    `;

    const content = css`
        padding: 16px 0px;
    `;

    const actionButtonContainer = css`
        display: flex;
        justify-content: flex-end;
        flex-direction: row;
    `;

    return {
        columnContainerNoMargin,
        columnContainer,
        hiddenDragHandle,
        content,
        actionButtonContainer,
    };
}
