import {
    CardContent,
    Typography,
    Card,
    IconButton,
    Box,
    Popover,
} from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../../../components/quickActionsPopoverContent";
import { ITicketTemplate } from "../../../../../../../../../models/ticketTemplate";
import { RouteCreator } from "../../../../../../utils/routeCreator";

export interface ITicketTemplateForBoardProps {
    ticketTemplate: ITicketTemplate;
    onClickDeleteTicketTemplate: () => void;
    canDeleteTicketTemplate: boolean;
}

export function TicketTemplateForBoard(props: ITicketTemplateForBoardProps) {
    const history = useHistory();
    const { ticketTemplate } = props;

    const { companyId, boardId } = useAppRouterParams();

    function openTicketTemplate() {
        const editTicketTemplateRoute = RouteCreator.ticketTemplateEdit(
            companyId,
            boardId,
            ticketTemplate.shortenedItemId
        );
        history.push(editTicketTemplateRoute);
    }

    const [optionsIsOpen, setOptionsIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    function toggleMoreOptions(event: any) {
        setAnchorEl(event.currentTarget);
        setOptionsIsOpen((previous) => !previous);
    }

    const indentedActions: IIndentedAction[] = [
        {
            header: "Quick Actions",
            informationForMenuItems: [
                {
                    text: "View Template",
                    onClick: openTicketTemplate,
                },
            ],
        },
    ];

    if (props.canDeleteTicketTemplate) {
        indentedActions[0].informationForMenuItems.push({
            text: "Delete Template",
            onClick: props.onClickDeleteTicketTemplate,
        });
    }

    function onClose() {
        setOptionsIsOpen(false);
    }

    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            marginBottom: 2,
                        }}
                    >
                        <Typography variant="h5">
                            {ticketTemplate.name}
                        </Typography>
                    </Box>
                    <div>
                        <IconButton size="small" onClick={toggleMoreOptions}>
                            <MoreHoriz />
                        </IconButton>
                    </div>
                </Box>
                <Typography>{ticketTemplate.description}</Typography>
            </CardContent>
            <Popover open={optionsIsOpen} anchorEl={anchorEl} onClose={onClose}>
                <QuickActionsPopoverContent
                    indentedActions={indentedActions}
                    onClose={onClose}
                />
            </Popover>
        </Card>
    );
}
