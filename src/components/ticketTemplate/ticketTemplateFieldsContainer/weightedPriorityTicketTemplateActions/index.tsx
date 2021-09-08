/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { IconButton, Popover } from "@material-ui/core";
import React, { useState } from "react";
import { Add, DeleteForever } from "@material-ui/icons";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../../../quickActionsPopoverContent";

export interface IWeightedPriorityTicketTemplateActions {
    onClickAddAfter: (type: string) => void;
    disabled: boolean;
    onClickDelete?: () => void;
}

export function WeightedPriorityTicketTemplateActions(
    props: IWeightedPriorityTicketTemplateActions
) {
    const classes = createClasses();

    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverIsOpen, setPopoverIsOpen] = useState(false);
    function onClickAdd(event: any) {
        setAnchorEl(event.currentTarget);
        setPopoverIsOpen(true);
    }
    function onClosePopover() {
        setPopoverIsOpen(false);
    }

    const indentedActions: IIndentedAction[] = [
        {
            header: "Section Types",
            informationForMenuItems: [
                {
                    text: "Text",
                    onClick: () => props.onClickAddAfter("text"),
                },
                {
                    text: "Number",
                    onClick: () => props.onClickAddAfter("number"),
                },
            ],
        },
    ];

    return (
        <div css={classes.container}>
            <div>
                <IconButton
                    disabled={props.disabled}
                    onClick={onClickAdd}
                    color="primary"
                >
                    <Add />
                </IconButton>
            </div>
            {!!props.onClickDelete && (
                <div>
                    <IconButton
                        disabled={props.disabled}
                        onClick={props.onClickDelete}
                        color="primary"
                    >
                        <DeleteForever />
                    </IconButton>
                </div>
            )}
            <Popover
                open={popoverIsOpen}
                anchorEl={anchorEl}
                onClose={onClosePopover}
            >
                <QuickActionsPopoverContent
                    indentedActions={indentedActions}
                    onClose={onClosePopover}
                />
            </Popover>
        </div>
    );
}

const createClasses = () => {
    const container = css`
        position: relative;
        width: 80px;
        display: grid;
        grid-auto-flow: column;
    `;

    return {
        container,
    };
};
