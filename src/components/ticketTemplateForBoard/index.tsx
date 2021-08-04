/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    CardContent,
    Typography,
    Card,
    IconButton,
    Theme,
    useTheme,
    Popover,
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../quickActionsPopoverContent";
import { ITicketTemplate } from "../../models/ticketTemplate";

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
        history.push(
            `/app/company/${companyId}/board/${boardId}/admin/ticket-templates/${ticketTemplate.shortenedItemId}`
        );
    }

    const theme = useTheme();
    const classes = createClasses(theme);
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

    return (
        <Card>
            <CardContent>
                <div css={classes.titleAndActionIconContainer}>
                    <div css={classes.titleContainer}>
                        <Typography variant="h5">
                            {ticketTemplate.name}
                        </Typography>
                    </div>
                    <div>
                        <IconButton size="small" onClick={toggleMoreOptions}>
                            <MoreHoriz />
                        </IconButton>
                    </div>
                </div>
                <Typography>{ticketTemplate.description}</Typography>
            </CardContent>
            <Popover
                open={optionsIsOpen}
                anchorEl={anchorEl}
                onClose={() => {
                    setOptionsIsOpen(false);
                }}
            >
                <QuickActionsPopoverContent indentedActions={indentedActions} />
            </Popover>
        </Card>
    );
}

const createClasses = (theme: Theme) => {
    const titleAndActionIconContainer = css`
        display: flex;
        flex-direction: row;
    `;

    const titleContainer = css`
        flex-grow: 1;
        margin-bottom: ${theme.spacing() * 2}px;
    `;

    return {
        titleAndActionIconContainer,
        titleContainer,
    };
};
