/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ITicket } from "../../../../../../../../models/ticket";
import { composeCSS } from "../../../../../../../../styles/composeCSS";
import {
    CardContent,
    Card,
    Typography,
    Popover,
    makeStyles,
    IconButton,
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { IColumn } from "../../../../../../../../models/column";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../components/centerLoadingSpinner";
import { TicketType } from "../../../../../../../../models/ticket/ticketType";
import {
    backlogColumnReservedId,
    doneColumnReservedId,
    uncategorizedColumnReservedId,
} from "../../../../../../../../constants/reservedColumnIds";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../../../../../../../../components/quickActionsPopoverContent";
import { IUser } from "../../../../../../../../models/user";
import { IAugmentedUITicket } from "../../../../../../../../models/augmentedUITicket";

export interface ITicketForBoardProps {
    ticket: IAugmentedUITicket;
    isFirstTicket: boolean;
    columnOptions: IColumn[];
    onUpdateTicketColumn: (
        previousColumnId: string,
        updatedTicket: IAugmentedUITicket
    ) => void;
    onMarkTicketAsDone?: (columnId: string, itemId: string) => void;
    onDeleteTicket: (columnId: string, itemId: string) => void;
    onMoveTicketToBacklog?: (columnId: string, itemId: string) => void;
    onChangeAssignTo?: (updatedTicket: IAugmentedUITicket) => void;
    showCompletedDate?: boolean;
    ticketType: TicketType;
    usersForBoard?: IUser[];
    onClickDemoTicket?: () => void;
}

const useStyles = makeStyles({
    cardContentRoot: {
        "&:last-child": {
            paddingBottom: 16,
        },
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
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setMoreOptionsIsOpen((previous) => !previous);
    }

    const [{ assignTo, isAssigningTicket }, setAssignToInformation] = useState<{
        assignTo:
            | ""
            | {
                  userId: string;
                  name: string;
              };
        isAssigningTicket: boolean;
    }>({
        assignTo: "",
        isAssigningTicket: false,
    });
    function onClickAssignTicket(
        assignTo:
            | ""
            | {
                  userId: string;
                  name: string;
              }
    ) {
        return () => {
            setAssignToInformation({
                assignTo,
                isAssigningTicket: true,
            });
        };
    }

    useEffect(() => {
        if (!isAssigningTicket) return;

        let didCancel = false;

        Api.tickets
            .setAssignedToTicketField(
                companyId,
                boardId,
                props.ticket.shortenedItemId,
                assignTo
            )
            .then(() => {
                if (didCancel) return;
                if (props.onChangeAssignTo) {
                    props.onChangeAssignTo({
                        ...props.ticket,
                        assignedTo: assignTo,
                    });
                }
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setAssignToInformation((previous) => {
                    return {
                        assignTo: "",
                        isAssigningTicket: false,
                    };
                });
            });

        return () => {
            didCancel = true;
        };
    }, [isAssigningTicket]);

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
                props.onUpdateTicketColumn(
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
                if (props.onMarkTicketAsDone) {
                    props.onMarkTicketAsDone(
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
                props.onUpdateTicketColumn(
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

    const [isMovingTicketToBacklog, setIsMovingTicketToBacklog] = useState(
        false
    );
    useEffect(() => {
        if (!isMovingTicketToBacklog) return;

        let didCancel = false;

        Api.tickets
            .moveNonBacklogTicketToBacklog(
                companyId,
                boardId,
                props.ticket.shortenedItemId
            )
            .then(() => {
                if (didCancel) return;
                if (props.onMoveTicketToBacklog) {
                    props.onMoveTicketToBacklog(
                        props.ticket.columnId || "",
                        props.ticket.itemId
                    );
                }
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsMovingTicketToBacklog(false);
            });
        // move the ticket to the backlog then call the prop

        return () => {
            didCancel = true;
        };
    }, [isMovingTicketToBacklog]);

    function moveTicketToBacklog() {
        setIsMovingTicketToBacklog(true);
    }

    const isPerformingAction =
        !!ticketToMarkAsDone ||
        !!ticketToUpdate ||
        !!nonInProgressTicketWithUpdatedColumn ||
        isMovingTicketToBacklog ||
        isAssigningTicket;

    function formattedDate(timestamp: string) {
        return format(Number(timestamp), "MMM do uuuu");
    }

    function navigateToTicketPage() {
        if (props.ticketType === TicketType.InProgress) {
            history.push(
                `/app/company/${companyId}/board/${boardId}/tickets/${props.ticket.shortenedItemId}/data`
            );
        } else if (props.ticketType === TicketType.Backlog) {
            history.push(
                `/app/company/${companyId}/board/${boardId}/backlog-tickets/${props.ticket.shortenedItemId}/data`
            );
        } else {
            history.push(
                `/app/company/${companyId}/board/${boardId}/archived-tickets/${props.ticket.shortenedItemId}/data`
            );
        }
    }

    const columnsWithBacklogColumn: IColumn[] = [
        {
            name: "Backlog",
            id: backlogColumnReservedId,
            canBeModified: false,
        },
        ...props.columnOptions,
    ];
    const isDemoMode = !!props.onClickDemoTicket;
    const indentedActions: IIndentedAction[] = [
        {
            header: "Move To",
            informationForMenuItems:
                columnsWithBacklogColumn
                    .filter((column) => {
                        const isUncategorizedColumn =
                            column.id === uncategorizedColumnReservedId;

                        if (isUncategorizedColumn) return false;

                        const isDoneColumn = column.id === doneColumnReservedId;
                        const canMarkTicketAsDone = !!props.onMarkTicketAsDone;

                        if (isDoneColumn && !canMarkTicketAsDone) return false;

                        const isBacklogColumn =
                            column.id === backlogColumnReservedId;
                        const canMoveTicketToBacklog = !!props.onMoveTicketToBacklog;
                        if (isBacklogColumn && !canMoveTicketToBacklog)
                            return false;

                        const isInCurrentColumn =
                            props.ticketType === TicketType.InProgress &&
                            column.id === props.ticket.columnId;

                        return !isInCurrentColumn;
                    })
                    .map((column) => {
                        const isDoneColumn = column.id === doneColumnReservedId;

                        const isBacklogColumn =
                            column.id === backlogColumnReservedId;

                        const ticketIsInDoneOrBacklogState =
                            props.ticketType !== TicketType.InProgress;

                        const onClick = isDoneColumn
                            ? moveTicketToDoneColumn
                            : isBacklogColumn
                            ? moveTicketToBacklog
                            : ticketIsInDoneOrBacklogState
                            ? moveNonInProgressTicketToInProgress(column)
                            : moveTicketToNewColumn(column);

                        return {
                            text: isDoneColumn ? "Archive" : column.name,
                            onClick: isDemoMode
                                ? props.onClickDemoTicket
                                : onClick,
                        };
                    }) || [],
        },
        !!props.usersForBoard && {
            header: "Assign To",
            informationForMenuItems: [
                {
                    text: "Unassigned",
                    onClick: onClickAssignTicket(""),
                },
                ...props.usersForBoard.map((user) => {
                    return {
                        text: user.name,
                        onClick: onClickAssignTicket({
                            userId: user.shortenedItemId,
                            name: user.name,
                        }),
                    };
                }),
            ],
        },
    ].filter((action) => !!action) as IIndentedAction[];

    function onClose(event: any) {
        event.preventDefault();
        event.stopPropagation();
        setMoreOptionsIsOpen(false);
    }

    const hidePointValue = props.ticketType === TicketType.Done;
    return (
        <div
            css={composeCSS(
                props.isFirstTicket && classes.firstCard,
                classes.bottomCardPadding,
                classes.container
            )}
            onClick={navigateToTicketPage}
        >
            <Card elevation={3}>
                <CardContent className={materialClasses.cardContentRoot}>
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
                                onClose={onClose}
                            >
                                <QuickActionsPopoverContent
                                    indentedActions={indentedActions}
                                    onClose={onClose}
                                />
                            </Popover>
                        </div>
                        {!hidePointValue &&
                            props.ticket.pointValueFromTags !== -20000000 && (
                                <div css={classes.assignedToContainer}>
                                    <Typography variant="caption">
                                        Priority Score:{" "}
                                        {props.ticket.pointValueFromTags}
                                    </Typography>
                                </div>
                            )}
                        {!!props.ticket.assignedTo && (
                            <div css={classes.assignedToContainer}>
                                <Typography variant="caption">
                                    Assigned To: {props.ticket.assignedTo.name}
                                </Typography>
                            </div>
                        )}
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
                        {/* {props.ticket.tags.length > 0 && (
                            <div css={classes.tagsContainer}>
                                {props.ticket.tags.map((tag) => {
                                    return (
                                        <div
                                            css={
                                                classes.individualChipContainer
                                            }
                                            key={tag.name}
                                        >
                                            <TagChip
                                                size="small"
                                                tagName={tag.name}
                                                tagColor={tag.color}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )} */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const createClasses = () => {
    const container = css`
        cursor: pointer;
    `;

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

    const assignedToContainer = css`
        padding-top: 0px;
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
        assignedToContainer,
        container,
    };
};
