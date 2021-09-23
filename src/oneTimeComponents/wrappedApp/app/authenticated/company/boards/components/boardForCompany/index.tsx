import {
    CardContent,
    Typography,
    Button,
    Card,
    IconButton,
    CardActions,
    Popover,
    Box,
} from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import React, { useState } from "react";
import { IBoard } from "../../../../../../../../models/board";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../../../../hooks/useAppRouterParams";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../../../board/components/quickActionsPopoverContent";
import { RouteCreator } from "../../../../../utils/routeCreator";

export interface IBoardForCompanyProps {
    board: IBoard;
    isBoardAdmin: boolean;
    onClickDeleteBoardAction: () => void;
}

export function BoardForCompany(props: IBoardForCompanyProps) {
    const history = useHistory();
    const { board } = props;

    const { companyId } = useAppRouterParams();

    function openBoard(boardId: string) {
        return () => {
            const route = RouteCreator.inProgressTickets(companyId, boardId);
            history.push(route);
        };
    }

    const [optionsIsOpen, setOptionsIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    function toggleMoreOptions(event: any) {
        setAnchorEl(event.currentTarget);
        setOptionsIsOpen((previous) => !previous);
    }

    const indentedActions: IIndentedAction[] = [
        {
            header: "Board Actions",
            informationForMenuItems: [
                {
                    text: "Delete Board",
                    onClick: props.onClickDeleteBoardAction,
                },
            ],
        },
    ];

    function onClose() {
        setOptionsIsOpen(false);
    }

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
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
                        <Typography variant="h5">{board.name}</Typography>
                    </Box>
                    <div>
                        {props.isBoardAdmin && (
                            <IconButton
                                size="small"
                                onClick={toggleMoreOptions}
                            >
                                <MoreHoriz />
                            </IconButton>
                        )}
                    </div>
                </Box>
                <Typography>{board.description}</Typography>
            </CardContent>
            <CardActions>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        onClick={openBoard(board.shortenedItemId)}
                        color="primary"
                    >
                        Open Board
                    </Button>
                </Box>
            </CardActions>
            <Popover open={optionsIsOpen} anchorEl={anchorEl} onClose={onClose}>
                <QuickActionsPopoverContent
                    indentedActions={indentedActions}
                    onClose={onClose}
                />
            </Popover>
        </Card>
    );
}
