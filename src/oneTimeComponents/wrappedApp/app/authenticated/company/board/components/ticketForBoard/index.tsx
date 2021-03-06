import {
    CardContent,
    Card,
    Typography,
    Popover,
    IconButton,
    Box,
    useTheme,
} from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
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
import { useAppRouterParams } from "../../../../../hooks/useAppRouterParams";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../quickActionsPopoverContent";
import { IUser } from "../../../../../../../../models/user";
import { IAugmentedUITicket } from "../../../../../../../../models/augmentedUITicket";
import { RouteCreator } from "../../../../../utils/routeCreator";
import { defaultHiddenPriorityScoreValue } from "../../utils/ticketsToAugmentedUITickets";
import { ticketForBoardTestIds } from "./ticketForBoard.testIds";
import { IStoreState } from "../../../../../../../../redux/storeState";
import { useSelector } from "react-redux";
import { Color } from "../../../../../../../../models/color";
import { mapColorToMaterialThemeColorDark } from "../../initiativeManager/utils/mapColorToMaterialThemeColorDark";
import { mapColorToMaterialThemeColorLight } from "../../initiativeManager/utils/mapColorToMaterialThemeColorLight";

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

export function TicketForBoard(props: ITicketForBoardProps) {
    const history = useHistory();
    const { companyId, boardId } = useAppRouterParams();
    const theme = useTheme();

    const ticketTemplateColor = useSelector((store: IStoreState) => {
        const ticketTemplate =
            store.weightedTicketTemplateCreation[
                props.ticket.ticketTemplateShortenedItemId
            ];
        return ticketTemplate?.color || Color.Grey;
    });

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
        const ticketId = props.ticket.shortenedItemId;
        if (props.ticketType === TicketType.InProgress) {
            const route = RouteCreator.inProgressTicketData(
                companyId,
                boardId,
                ticketId
            );
            history.push(route);
        } else if (props.ticketType === TicketType.Backlog) {
            const route = RouteCreator.backlogTicketData(
                companyId,
                boardId,
                ticketId
            );
            history.push(route);
        } else {
            const route = RouteCreator.archivedTicketData(
                companyId,
                boardId,
                ticketId
            );
            history.push(route);
        }
    }

    const columnsWithBacklogAndDoneColumn: IColumn[] = [
        {
            name: "Backlog",
            id: backlogColumnReservedId,
            canBeModified: false,
        },
        ...props.columnOptions,
        {
            name: "Done",
            id: doneColumnReservedId,
            canBeModified: false,
        },
    ];
    const isDemoMode = !!props.onClickDemoTicket;
    const indentedActions: IIndentedAction[] = [
        {
            header: "Move To",
            informationForMenuItems:
                columnsWithBacklogAndDoneColumn
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
    const bgcolor = theme.palette.mode === "light" ? "grey.100" : "grey.900";
    // need to use this in a different way
    const templateLineColor =
        ticketTemplateColor === Color.Grey
            ? null
            : mapColorToMaterialThemeColorLight(ticketTemplateColor);

    return (
        <Box
            sx={{
                paddingBottom: 2,
                paddingTop: props.isFirstTicket ? 2 : 0,
            }}
        >
            <Box
                sx={{
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: "divider",
                    borderRadius: "5px",
                    bgcolor,
                    cursor: "pointer",
                    "&:hover": {
                        borderColor: "primary.main",
                    },
                }}
                onClick={navigateToTicketPage}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        padding: 2,
                    }}
                >
                    {isPerformingAction && (
                        <Box
                            sx={{
                                height: "100%",
                                width: "100%",
                                position: "absolute",
                                bgcolor: "background.default",
                                opacity: 0.9,
                                top: 0,
                                right: 0,
                            }}
                        >
                            <CenterLoadingSpinner size="small" />
                        </Box>
                    )}
                    {templateLineColor && (
                        <Box
                            sx={{
                                width: "24px",
                                height: "8px",
                                borderRadius: "5px",
                                bgcolor: templateLineColor,
                                position: "absolute",
                                left: "16px",
                                top: "4px",
                            }}
                        />
                    )}
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography>{props.ticket.title}</Typography>
                        <Box
                            sx={{
                                position: "relative",
                                bottom: "4px",
                                visibility: isPerformingAction
                                    ? "hidden"
                                    : "visible",
                            }}
                        >
                            <IconButton
                                size="small"
                                onClick={toggleMoreOptions}
                            >
                                <MoreHoriz />
                            </IconButton>
                        </Box>
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
                    </Box>

                    {!hidePointValue &&
                        props.ticket.pointValueFromTags !==
                            defaultHiddenPriorityScoreValue && (
                            <Box
                                data-testid={
                                    ticketForBoardTestIds.pointValueFromTagsContainer
                                }
                            >
                                <Typography variant="caption">
                                    Priority Score:{" "}
                                    {props.ticket.pointValueFromTags ===
                                    Infinity
                                        ? "MAX"
                                        : props.ticket.pointValueFromTags}
                                </Typography>
                            </Box>
                        )}
                    {!!props.ticket.assignedTo && (
                        <Box
                            sx={{
                                paddingTop: 0,
                            }}
                        >
                            <Typography variant="caption">
                                Assigned To: {props.ticket.assignedTo.name}
                            </Typography>
                        </Box>
                    )}
                    {!!props.showCompletedDate && (
                        <Box
                            sx={{
                                paddingTop: 2,
                            }}
                        >
                            <Typography variant="body2">
                                Completed:
                                {" " +
                                    formattedDate(
                                        props.ticket.completedTimestamp
                                    )}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
