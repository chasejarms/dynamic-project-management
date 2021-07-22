/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ITicket } from "../../models/ticket";
import { composeCSS } from "../../styles/composeCSS";
import {
    CardContent,
    Card,
    IconButton,
    Chip,
    Typography,
    Paper,
    MenuItem,
    makeStyles,
    Popover,
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { IColumn } from "../../models/column";
import { Api } from "../../api";
import { CenterLoadingSpinner } from "../centerLoadingSpinner";
import { ConfirmDialog } from "../confirmDialog";
import { TicketType } from "../../models/ticket/ticketType";
import { doneColumnReservedId } from "../../constants/reservedColumnIds";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../quickActionsPopoverContent";

export interface ITicketForBoardProps {
    ticket: IAugmentedUITicket;
    isFirstTicket: boolean;
    adjustColumnOptions?: {
        columnOptions: IColumn[];
        onMarkTicketAsDone?: (columnId: string, itemId: string) => void;
        onUpdateTicketColumn: (
            previousColumnId: string,
            updatedTicket: IAugmentedUITicket
        ) => void;
    };
    onDeleteTicket: (columnId: string, itemId: string) => void;
    showCompletedDate?: boolean;
    ticketType: TicketType;
}

export interface IAugmentedUITicket extends ITicket {
    pointValueFromTags: number;
}

const useStyles = makeStyles({
    moreOptionsHeaderText: {
        fontWeight: 500,
    },
    menuItemRoot: {
        paddingLeft: 32,
        paddingRight: 32,
    },
});

export function TicketForBoard(props: ITicketForBoardProps) {
    const classes = createClasses();
    const materialClasses = useStyles();

    const history = useHistory();
    const { companyId, boardId } = useAppRouterParams();

    const [anchorEl, setAnchorEl] = useState(null);
    const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false);
    function toggleMoreOptions(event: any) {
        setAnchorEl(event.currentTarget);
        setMoreOptionsIsOpen((previous) => !previous);
    }

    function moveTicketToNewColumn(column: IColumn) {
        return () => {
            const ticketWithUpdatedColumn = {
                ...props.ticket,
                columnId: column.id,
            };

            setTicketToUpdate(ticketWithUpdatedColumn);
        };
    }

    const [
        nonInProgressTicketWithUpdatedColumn,
        setNonInProgressTicketWithUpdateColumn,
    ] = useState<IAugmentedUITicket | null>(null);
    useEffect(() => {
        if (nonInProgressTicketWithUpdatedColumn === null) return;

        let didCancel = false;

        Api.tickets
            .moveNonInProgressTicketToInProgress(
                companyId,
                boardId,
                props.ticket.shortenedItemId,
                nonInProgressTicketWithUpdatedColumn.columnId!
            )
            .then(() => {
                if (didCancel) return;
                props.adjustColumnOptions?.onUpdateTicketColumn(
                    "",
                    nonInProgressTicketWithUpdatedColumn
                );
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setNonInProgressTicketWithUpdateColumn(null);
            });

        return () => {
            didCancel = true;
        };
    }, [nonInProgressTicketWithUpdatedColumn]);

    function moveNonInProgressTicketToInProgress(column: IColumn) {
        return () => {
            const ticketWithUpdatedColumn = {
                ...props.ticket,
                columnId: column.id,
            };

            setNonInProgressTicketWithUpdateColumn(ticketWithUpdatedColumn);
        };
    }

    function moveTicketToDoneColumn() {
        setTicketToMarkAsDone(props.ticket);
    }

    const [
        ticketToMarkAsDone,
        setTicketToMarkAsDone,
    ] = useState<IAugmentedUITicket | null>(null);
    useEffect(() => {
        if (!ticketToMarkAsDone) return;

        let didCancel = false;

        Api.tickets
            .markTicketAsDone(
                companyId,
                boardId,
                props.ticket.shortenedItemId,
                props.ticketType
            )
            .then(() => {
                if (didCancel) return;
                if (props.adjustColumnOptions?.onMarkTicketAsDone) {
                    props.adjustColumnOptions?.onMarkTicketAsDone(
                        props.ticket.columnId!,
                        props.ticket.itemId
                    );
                }
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setTicketToMarkAsDone(null);
            });

        return () => {
            didCancel = true;
        };
    });

    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [
        ticketToUpdate,
        setTicketToUpdate,
    ] = useState<IAugmentedUITicket | null>(null);
    useEffect(() => {
        if (!ticketToUpdate) return;

        let didCancel = false;

        setMoreOptionsIsOpen(false);

        Api.tickets
            .updateTicketColumn(
                companyId,
                boardId,
                ticketToUpdate.shortenedItemId,
                ticketToUpdate.columnId as string
            )
            .then(() => {
                if (didCancel) return;
                props.adjustColumnOptions?.onUpdateTicketColumn(
                    props.ticket.columnId!,
                    ticketToUpdate
                );
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setTicketToUpdate(null);
            });

        return () => {
            didCancel = true;
        };
    }, [ticketToUpdate]);

    const [
        showConfirmDeleteTicketDialog,
        setShowConfirmDeleteTicketDialog,
    ] = useState(false);
    function onClickDeleteTicketMenuItem() {
        setShowConfirmDeleteTicketDialog(true);
    }
    const [isDeletingTicket, setIsDeletingTicket] = useState(false);
    useEffect(() => {
        if (!isDeletingTicket) return;

        let didCancel = false;

        Api.tickets
            .deleteTicket(
                companyId,
                boardId,
                props.ticket.shortenedItemId,
                props.ticketType
            )
            .then(() => {
                if (didCancel) return;
                props.onDeleteTicket(
                    props.ticket.columnId!,
                    props.ticket.itemId
                );
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsDeletingTicket(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isDeletingTicket]);

    const [isMarkingTicketAsComplete, setIsMarkingTicketAsComplete] = useState(
        false
    );
    useEffect(() => {
        if (!isMarkingTicketAsComplete) return;

        let didCancel = false;

        return () => {
            didCancel = true;
        };
    }, [isMarkingTicketAsComplete]);

    const isPerformingAction =
        !!ticketToMarkAsDone ||
        !!ticketToUpdate ||
        isDeletingTicket ||
        !!nonInProgressTicketWithUpdatedColumn;

    function formattedDate(timestamp: string) {
        return format(Number(timestamp), "MMM do uuuu");
    }

    function navigateToTicketPage() {
        history.push(
            `/app/company/${companyId}/board/${boardId}/ticket/${props.ticket.shortenedItemId}/data`
        );
    }

    const indentedActions: IIndentedAction[] = [
        {
            header: "Quick Actions",
            informationForMenuItems: [
                {
                    text: "View Ticket",
                    onClick: navigateToTicketPage,
                },
                {
                    text: "Delete Ticket",
                    onClick: onClickDeleteTicketMenuItem,
                },
            ],
        },
        {
            header: "Move To Column",
            informationForMenuItems:
                props.adjustColumnOptions?.columnOptions
                    .filter((column) => {
                        const isDoneColumn = column.id === doneColumnReservedId;
                        const canMarkTicketAsDone = !!props.adjustColumnOptions
                            ?.onMarkTicketAsDone;

                        const isInCurrentColumn =
                            column.id === props.ticket.columnId;

                        return (
                            !(isDoneColumn && !canMarkTicketAsDone) &&
                            !isInCurrentColumn
                        );
                    })
                    .map((column) => {
                        const isDoneColumn = column.id === doneColumnReservedId;

                        const ticketIsInDoneOrBacklogState =
                            props.ticketType !== TicketType.InProgress;

                        const onClick = isDoneColumn
                            ? moveTicketToDoneColumn
                            : ticketIsInDoneOrBacklogState
                            ? moveNonInProgressTicketToInProgress(column)
                            : moveTicketToNewColumn(column);

                        return {
                            text: column.name,
                            onClick,
                        };
                    }) || [],
        },
    ];

    return (
        <div
            css={composeCSS(
                props.isFirstTicket && classes.firstCard,
                classes.bottomCardPadding
            )}
        >
            <Card elevation={3}>
                <CardContent>
                    <div css={classes.spinnerOverlayContainer}>
                        {isPerformingAction && (
                            <div css={classes.spinnerOverlay}>
                                <CenterLoadingSpinner size="small" />
                            </div>
                        )}
                        <div css={classes.titleAndOptionsIconContainer}>
                            <Typography>{props.ticket.title}</Typography>
                            <div
                                css={composeCSS(
                                    isPerformingAction &&
                                        classes.visibilityHidden,
                                    classes.moreIconButtonContainer
                                )}
                            >
                                <IconButton
                                    size="small"
                                    onClick={toggleMoreOptions}
                                >
                                    <MoreHoriz />
                                </IconButton>
                            </div>
                            <Popover
                                open={moreOptionsIsOpen}
                                anchorEl={anchorEl}
                                onClose={() => {
                                    setMoreOptionsIsOpen(false);
                                }}
                            >
                                <QuickActionsPopoverContent
                                    indentedActions={indentedActions}
                                />
                            </Popover>
                        </div>
                        {!!props.showCompletedDate && (
                            <div css={classes.completedDateContainer}>
                                <Typography variant="body2">
                                    Completed:
                                    {" " +
                                        formattedDate(
                                            props.ticket.completedTimestamp
                                        )}
                                </Typography>
                            </div>
                        )}
                        {props.ticket.tags.length > 0 && (
                            <div css={classes.tagsContainer}>
                                {props.ticket.tags.map((tag) => {
                                    return (
                                        <div
                                            css={
                                                classes.individualChipContainer
                                            }
                                            key={tag.name}
                                        >
                                            <Chip
                                                size="small"
                                                label={tag.name}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            {showConfirmDeleteTicketDialog && (
                <ConfirmDialog
                    open={showConfirmDeleteTicketDialog}
                    isPerformingAction={isDeletingTicket}
                    onConfirm={() => setIsDeletingTicket(true)}
                    onClose={() => setShowConfirmDeleteTicketDialog(false)}
                    title="Delete Ticket Confirmation"
                    content={`Are you sure want to delete ticket ${props.ticket.title}? This action cannot be undone.`}
                    confirmButtonText="Yes"
                />
            )}
        </div>
    );
}

const createClasses = () => {
    const firstCard = css`
        padding-top: 16px;
    `;

    const bottomCardPadding = css`
        padding-bottom: 16px;
    `;

    const titleAndOptionsIconContainer = css`
        display: flex;
        justify-content: space-between;
    `;

    const moreIconButtonContainer = css`
        position: relative;
        bottom: 4px;
    `;

    const tagsContainer = css`
        padding-top: 16px;
    `;

    const individualChipContainer = css`
        margin-right: 4px;
        margin-bottom: 4px;
        display: inline-flex;
    `;

    const moreOptionsTextContainer = css`
        padding: 8px 16px;
    `;

    const moreOptionsContentContainer = css`
        width: 200px;
    `;

    const visibilityHidden = css`
        visibility: hidden;
    `;

    const spinnerOverlayContainer = css`
        position: relative;
    `;

    const spinnerOverlay = css`
        height: 100%;
        width: 100%;
        position: absolute;
        background-color: white;
        opacity: 0.9;
    `;

    const completedDateContainer = css`
        padding-top: 16px;
    `;

    return {
        firstCard,
        bottomCardPadding,
        titleAndOptionsIconContainer,
        moreIconButtonContainer,
        tagsContainer,
        individualChipContainer,
        moreOptionsTextContainer,
        moreOptionsContentContainer,
        visibilityHidden,
        spinnerOverlayContainer,
        spinnerOverlay,
        completedDateContainer,
    };
};
