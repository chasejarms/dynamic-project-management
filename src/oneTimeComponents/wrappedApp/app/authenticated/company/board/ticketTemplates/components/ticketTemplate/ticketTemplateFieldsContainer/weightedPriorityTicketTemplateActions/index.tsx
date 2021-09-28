import { IconButton, Popover, Box } from "@mui/material";
import React, { useState } from "react";
import { Add, DeleteForever } from "@mui/icons-material";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../../../../../components/quickActionsPopoverContent";

export interface IWeightedPriorityTicketTemplateActions {
    onClickAddAfter: (type: string) => void;
    disabled: boolean;
    onClickDelete?: () => void;
}

export function WeightedPriorityTicketTemplateActions(
    props: IWeightedPriorityTicketTemplateActions
) {
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
        <Box
            sx={{
                position: "relative",
                width: "80px",
                display: "grid",
                gridAutoFlow: "column",
                top: "16px",
            }}
        >
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
        </Box>
    );
}
