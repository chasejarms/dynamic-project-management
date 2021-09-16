/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    CardContent,
    Typography,
    Button,
    Card,
    IconButton,
    CardActions,
    Theme,
    useTheme,
    Popover,
    makeStyles,
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import React, { useState } from "react";
import { IBoard } from "../../../../../../../../models/board";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../../../board/components/quickActionsPopoverContent";

export interface IBoardForCompanyProps {
    board: IBoard;
    isBoardAdmin: boolean;
    onClickDeleteBoardAction: () => void;
}

const useStyles = makeStyles({
    cardRoot: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
});

export function BoardForCompany(props: IBoardForCompanyProps) {
    const history = useHistory();
    const { board } = props;

    const { companyId } = useAppRouterParams();

    function openBoard(boardId: string) {
        return () => {
            history.push(`/app/company/${companyId}/board/${boardId}/tickets`);
        };
    }

    const theme = useTheme();
    const classes = createClasses(theme);
    const materialClasses = useStyles();
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
        <Card className={materialClasses.cardRoot}>
            <CardContent>
                <div css={classes.titleAndActionIconContainer}>
                    <div css={classes.titleContainer}>
                        <Typography variant="h5">{board.name}</Typography>
                    </div>
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
                </div>
                <Typography>{board.description}</Typography>
            </CardContent>
            <CardActions>
                <div css={classes.actionButtonContainer}>
                    <Button
                        onClick={openBoard(board.shortenedItemId)}
                        color="primary"
                    >
                        Open Board
                    </Button>
                </div>
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

const createClasses = (theme: Theme) => {
    const titleAndActionIconContainer = css`
        display: flex;
        flex-direction: row;
    `;

    const titleContainer = css`
        flex-grow: 1;
        margin-bottom: ${theme.spacing() * 2}px;
    `;

    const actionButtonContainer = css`
        width: 100%;
        display: flex;
        justify-content: flex-end;
    `;

    return {
        titleAndActionIconContainer,
        titleContainer,
        actionButtonContainer,
    };
};
