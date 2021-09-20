/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { CardContent, Card, CardActions } from "@material-ui/core";
import { DragIndicator } from "@material-ui/icons";
import { ChangeEvent, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { StringValidator } from "../../../../../../../../../classes/StringValidator";
import { doneColumnReservedId } from "../../../../../../../../../constants/reservedColumnIds";
import { IColumn } from "../../../../../../../../../models/column";
import { composeCSS } from "../../../../../../../../../styles/composeCSS";
import { WrappedButton } from "../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../components/wrappedTextField";
import { useControl } from "../../../../../../hooks/useControl";
import { TicketContainer } from "../../../components/ticketContainer";
import { useDebounce } from "../../hooks/useDebounce";

export interface IEditableColumnCardProps {
    column: IColumn;
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

    const isDoneColumn = props.column.id === doneColumnReservedId;
    const columnNameControl = useControl({
        value: isDoneColumn ? "Archive" : props.column.name,
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
    const shouldShowNameError =
        columnNameControl.isTouched && !columnNameControl.isValid;

    const debouncedColumn = useDebounce(columnNameControl.value, 300, 1);
    useEffect(() => {
        if (!columnNameControl.isValid) return;

        props.onUpdateColumn({
            target: {
                value: columnNameControl.value,
            },
        } as any);
    }, [debouncedColumn]);

    return (
        <Draggable draggableId={props.column.id} index={props.index}>
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
                            title={columnNameControl.value}
                            bottomBarContent={true}
                            topRightIcon={
                                <div
                                    {...provided.dragHandleProps}
                                    css={composeCSS(
                                        !props.column.canBeModified &&
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
                                        value={columnNameControl.value}
                                        label="Column Name"
                                        onChange={columnNameControl.onChange}
                                        error={
                                            shouldShowNameError
                                                ? columnNameControl.errorMessage
                                                : ""
                                        }
                                        disabled={
                                            !props.column.canBeModified ||
                                            props.disabled
                                        }
                                    />
                                </div>
                                <div css={classes.actionButtonContainer}>
                                    <div>
                                        <WrappedButton
                                            onClick={onDeleteColumnInternal}
                                            color="primary"
                                            disabled={props.disabled}
                                        >
                                            Delete Column
                                        </WrappedButton>
                                    </div>
                                    <div>
                                        <WrappedButton
                                            onClick={props.onClickAddAfter(
                                                props.index
                                            )}
                                            color="primary"
                                            disabled={props.disabled}
                                        >
                                            Add Column After
                                        </WrappedButton>
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
        justify-content: space-between;
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
