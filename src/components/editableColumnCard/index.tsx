/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { CardContent, Card, CardActions } from "@material-ui/core";
import { DragIndicator } from "@material-ui/icons";
import { IColumn } from "../../models/column";
import { composeCSS } from "../../styles/composeCSS";
import { useControl } from "../../hooks/useControl";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { WrappedTextField } from "../wrappedTextField";
import { useDebounce } from "../../hooks/useDebounce";
import { Draggable } from "react-beautiful-dnd";
import { WrappedButton } from "../wrappedButton";

export interface IEditableColumnCardProps {
    column: IColumn;
    index: number;
    onDeleteColumn: (index: number) => void;
    onUpdateColumn: (index: number, column: IColumn) => void;
    disabled?: boolean;
    hideDeleteButton: boolean;
    isLastColumn?: boolean;
}

export function EditableColumnCard(props: IEditableColumnCardProps) {
    const classes = createClasses();

    function onDeleteColumnInternal() {
        props.onDeleteColumn(props.index);
    }

    const columnNameControl = useControl({
        value: props.column.name,
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const updatedName = event.target.value;
            return updatedName;
        },
        validatorError: (email: string) => {
            return ControlValidator.string()
                .required("This field is required")
                .validate(email);
        },
    });
    const shouldShowNameError =
        columnNameControl.isTouched && !columnNameControl.isValid;

    const debouncedColumn = useDebounce(columnNameControl.value, 300, 1);
    useEffect(() => {
        if (!columnNameControl.isValid) return;

        props.onUpdateColumn(props.index, {
            ...props.column,
            name: columnNameControl.value,
        });
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
                        <Card>
                            <CardContent>
                                <div css={classes.dragHandleContainer}>
                                    <div
                                        {...provided.dragHandleProps}
                                        css={composeCSS(
                                            !props.column.canBeModified &&
                                                classes.hiddenDragHandle
                                        )}
                                    >
                                        <DragIndicator />
                                    </div>
                                </div>
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
                            </CardContent>
                            <CardActions>
                                <div css={classes.columnActionContainer}>
                                    <div
                                        css={composeCSS(
                                            (!props.column.canBeModified ||
                                                props.hideDeleteButton) &&
                                                classes.hiddenDeleteButtonContainer
                                        )}
                                    >
                                        <WrappedButton
                                            onClick={onDeleteColumnInternal}
                                            color="primary"
                                            disabled={props.disabled}
                                        >
                                            Delete Column
                                        </WrappedButton>
                                    </div>
                                </div>
                            </CardActions>
                        </Card>
                    </div>
                );
            }}
        </Draggable>
    );
}

export function createClasses() {
    const columnContainer = css`
        margin-right: 16px;
        width: 300px;
        min-width: 300px;
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

    return {
        columnContainerNoMargin,
        columnContainer,
        columnActionContainer,
        hiddenDeleteButtonContainer,
        dragHandleContainer,
        hiddenDragHandle,
    };
}
