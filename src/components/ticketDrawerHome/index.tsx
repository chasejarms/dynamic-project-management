/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { IconButton, Typography } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "../../api";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import { ITicket } from "../../models/ticket";
import { ITicketUpdateRequest } from "../../models/ticketUpdateRequest";
import { IStoreState } from "../../redux/storeState";
import { setInitialTicketData } from "../../redux/ticket";
import { setWeightedTicketTemplate } from "../../redux/ticketTemplates";
import { TicketFields } from "../ticketFields";
import { WrappedButton } from "../wrappedButton";
import { useHistory } from "react-router-dom";
import { CenterLoadingSpinner } from "../centerLoadingSpinner";
import { TicketType } from "../../models/ticket/ticketType";
import { ConfirmDialog } from "../confirmDialog";

export interface ITicketDrawerHomeProps {
    onUpdateTicket: (ticketUpdateRequest: ITicketUpdateRequest) => void;
    onDeleteTicket: (columnId: string, itemId: string) => void;
    ticketType: TicketType;
}

export function TicketDrawerHome(props: ITicketDrawerHomeProps) {
    const { boardId, companyId, ticketId } = useAppRouterParams();

    const [
        isLoadingTicketInformation,
        setIsLoadingTicketInformation,
    ] = useState(true);

    const ticketState = useSelector((store: IStoreState) => {
        return store.ticket[ticketId];
    });
    const [loadedTicket, setLoadedTicket] = useState<null | ITicket>();

    const dispatch = useDispatch();
    useEffect(() => {
        if (!boardId || !companyId || !ticketId) return;

        let didCancel = false;

        Promise.all([
            Api.tickets.getTicketInformationById(companyId, boardId, ticketId),
        ])
            .then(([{ ticket, ticketTemplate }]) => {
                if (didCancel) return;

                setLoadedTicket(ticket);

                const setWeightedTicketTemplateAction = setWeightedTicketTemplate(
                    {
                        ticketTemplate,
                        ticketTemplateId: ticketTemplate.shortenedItemId,
                    }
                );
                dispatch(setWeightedTicketTemplateAction);

                const action = setInitialTicketData({
                    ticket: {
                        title: {
                            value: ticket.title,
                            touched: false,
                            error: "",
                        },
                        summary: {
                            value: ticket.summary,
                            touched: false,
                            error: "",
                        },
                        sections: ticket.sections.map((section) => {
                            return {
                                value: section,
                                touched: false,
                                error: "",
                            };
                        }),
                    },
                    ticketTemplate,
                    priorityWeightingFunction: {
                        value: ticketTemplate.priorityWeightingCalculation,
                        error: "",
                    },
                    ticketId: ticket.shortenedItemId,
                });
                dispatch(action);
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingTicketInformation(false);
            });

        return () => {
            didCancel = true;
        };
    }, [boardId, companyId]);

    const [
        ticketUpdateRequest,
        setTicketUpdateRequest,
    ] = useState<null | ITicketUpdateRequest>(null);

    useEffect(() => {
        if (!ticketUpdateRequest) return;

        let didCancel = false;

        Api.tickets
            .updateTicketInformation(
                loadedTicket?.itemId || "",
                loadedTicket?.belongsTo || "",
                ticketUpdateRequest
            )
            .then(() => {
                if (didCancel) return;
                props.onUpdateTicket(ticketUpdateRequest);
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setTicketUpdateRequest(null);
            });

        return () => {
            didCancel = true;
        };
    }, [ticketUpdateRequest]);

    const ticket = useSelector(
        (store: IStoreState) => {
            return store.ticket[ticketId]?.ticket;
        },
        () => {
            return !!ticketUpdateRequest;
        }
    );

    const [
        showConfirmDeleteTicketDialog,
        setShowConfirmDeleteTicketDialog,
    ] = useState(false);
    function onClickDeleteTicketButton() {
        setShowConfirmDeleteTicketDialog(true);
    }

    const [isDeletingTicket, setIsDeletingTicket] = useState(false);
    useEffect(() => {
        if (!isDeletingTicket || !loadedTicket) return;

        let didCancel = false;

        Api.tickets
            .deleteTicket(
                companyId,
                boardId,
                loadedTicket.shortenedItemId,
                props.ticketType
            )
            .then(() => {
                if (didCancel) return;
                props.onDeleteTicket(
                    loadedTicket.columnId!,
                    loadedTicket.itemId
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

    function onClickUpdate() {
        const title = ticket.title.value;
        const summary = ticket.summary.value;
        const sections = ticket.sections.map((section) => {
            return section.value;
        });

        setTicketUpdateRequest({
            title,
            summary,
            sections,
        });
    }

    const classes = createClasses();
    const ticketUpdateInProgress = !!ticketUpdateRequest;
    const history = useHistory();

    function closeDrawer() {
        history.push(`/app/company/${companyId}/board/${boardId}/tickets`);
    }

    return (
        <div css={classes.drawerContainer}>
            <div css={classes.drawerDarkOpacityContainer}></div>
            <div css={classes.drawerContentContainer}>
                {isLoadingTicketInformation || !ticketState ? (
                    <div css={classes.drawerContentContainerLoading}>
                        <CenterLoadingSpinner size="large" />
                    </div>
                ) : (
                    <div css={classes.drawerContentContainerLoaded}>
                        <div css={classes.drawerHeaderContainer}>
                            <Typography variant="h6">Edit Ticket</Typography>
                            <IconButton
                                disabled={
                                    ticketUpdateInProgress || isDeletingTicket
                                }
                                onClick={closeDrawer}
                            >
                                <Clear />
                            </IconButton>
                        </div>
                        <div css={classes.drawerInnerContentContainer}>
                            <TicketFields
                                ticketTemplateId={
                                    ticketState.ticketTemplate.shortenedItemId
                                }
                                ticketId={ticketId}
                                isTicketPreview={false}
                                disabled={
                                    ticketUpdateInProgress || isDeletingTicket
                                }
                                removePadding
                            />
                        </div>
                        <div css={classes.drawerActionButtonContainer}>
                            <WrappedButton
                                variant="text"
                                onClick={onClickDeleteTicketButton}
                                color="secondary"
                                disabled={
                                    ticketUpdateInProgress || isDeletingTicket
                                }
                                showSpinner={isDeletingTicket}
                                children={"Delete"}
                            />
                            <WrappedButton
                                variant="contained"
                                onClick={onClickUpdate}
                                color="primary"
                                disabled={
                                    ticketUpdateInProgress || isDeletingTicket
                                }
                                showSpinner={ticketUpdateInProgress}
                                children={"Update"}
                            />
                        </div>
                    </div>
                )}
            </div>
            {showConfirmDeleteTicketDialog && (
                <ConfirmDialog
                    open={showConfirmDeleteTicketDialog}
                    isPerformingAction={isDeletingTicket}
                    onConfirm={() => setIsDeletingTicket(true)}
                    onClose={() => setShowConfirmDeleteTicketDialog(false)}
                    title="Delete Ticket Confirmation"
                    content={`Are you sure want to delete ticket ${loadedTicket?.title}? This action cannot be undone.`}
                    confirmButtonText="Yes"
                />
            )}
        </div>
    );
}

const createClasses = () => {
    const drawerContainer = css`
        position: absolute;
        right: 0;
        z-index: 1;
        display: grid;
        grid-template-columns: auto 400px;
        height: 100%;
        width: 100%;
    `;

    const drawerDarkOpacityContainer = css`
        background-color: rgba(0, 0, 0, 0.5);
    `;

    const drawerContentContainer = css`
        background-color: white;
        box-shadow: 0px 8px 10px -5px rgb(0 0 0 / 20%),
            0px 16px 24px 2px rgb(0 0 0 / 14%),
            0px 6px 30px 5px rgb(0 0 0 / 12%);
        display: flex;
    `;

    const drawerContentContainerLoaded = css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    `;

    const drawerContentContainerLoading = css`
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const drawerHeaderContainer = css`
        flex: 0 0 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px 0 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    `;

    const drawerInnerContentContainer = css`
        padding: 16px;
        flex-grow: 1;
        overflow-y: auto;
        height: 0px;
    `;

    const drawerActionButtonContainer = css`
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        flex: 0 0 60px;
        overflow: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
    `;

    return {
        drawerContainer,
        drawerDarkOpacityContainer,
        drawerContentContainer,
        drawerHeaderContainer,
        drawerInnerContentContainer,
        drawerActionButtonContainer,
        drawerContentContainerLoaded,
        drawerContentContainerLoading,
    };
};
