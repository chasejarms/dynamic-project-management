/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Delete, DragIndicator, Add } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { ChangeEvent } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IColumnControl } from "../../../../../../../../../redux/boardColumnEditMappedState";
import { composeCSS } from "../../../../../../../../../styles/composeCSS";
import { WrappedButton } from "../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../components/wrappedTextField";
import { TicketContainer } from "../../../components/ticketContainer";

export interface IEditableColumnCardProps {
    columnControl: IColumnControl;
    index: number;
    onDeleteColumn: (index: number) => void;
    onUpdateColumn: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onClickAddAfter: (index: number) => () => void;
    disabled?: boolean;
    hideDeleteButton: boolean;
    isLastColumn?: boolean;
}

export function EditableColumnCard(props: IEditableColumnCardProps) {
    const classes = createClasses();

    function onDeleteColumnInternal() {
        props.onDeleteColumn(props.index);
    }

    const { name, canBeModified, id, labelError } = props.columnControl;

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
                            bottomBarContent={true}
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
                                        onChange={props.onUpdateColumn}
                                        error={labelError}
                                        disabled={
                                            !canBeModified || props.disabled
                                        }
                                    />
                                </div>
                                <div css={classes.actionButtonContainer}>
                                    <div>
                                        <IconButton
                                            onClick={onDeleteColumnInternal}
                                            disabled={props.disabled}
                                        >
                                            <Delete />
                                        </IconButton>
                                        <IconButton
                                            onClick={props.onClickAddAfter(
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

    const columnActionContainer = css`
        width: 100%;
        display: flex;
        justify-content: flex-end;
    `;

    const hiddenDeleteButtonContainer = css`
        visibility: hidden;
    `;

    const dragHandleContainer = css`
        width: 100%;
        display: flex;
        justify-content: flex-end;
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
        columnActionContainer,
        hiddenDeleteButtonContainer,
        dragHandleContainer,
        hiddenDragHandle,
        content,
        actionButtonContainer,
    };
}
