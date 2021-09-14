/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../../../../../components/centerLoadingSpinner";
import { ConfirmDialog } from "../../../../../../../../components/confirmDialog";
import { TicketDrawerContainer } from "../../../../../../../../components/ticketDrawerContainer";
import { TicketFields } from "../../../../../../../../components/ticketFields";
import { WrappedButton } from "../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { ITicket } from "../../../../../../../../models/ticket";
import { TicketType } from "../../../../../../../../models/ticket/ticketType";
import { ITicketUpdateRequest } from "../../../../../../../../models/ticketUpdateRequest";
import { IStoreState } from "../../../../../../../../redux/storeState";
import { setInitialTicketData } from "../../../../../../../../redux/ticket";
import { setWeightedTicketTemplate } from "../../../../../../../../redux/ticketTemplates";

export interface ITicketHomeProps {
    onUpdateTicket: (ticketUpdateRequest: ITicketUpdateRequest) => void;
    onDeleteTicket: (columnId: string, itemId: string) => void;
    ticketType: TicketType;
}

export function TicketHome(props: ITicketHomeProps) {
    const { boardId, companyId, ticketId } = useAppRouterParams();
    console.log("boardId: ", boardId);
    console.log("ticketId: ", ticketId);
    console.log("companyId: ", companyId);

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

        Api.tickets
            .getTicketInformationById(companyId, boardId, ticketId)
            .then(({ ticket, ticketTemplate }) => {
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

    return (
        <TicketDrawerContainer
            disallowPageNavigation={ticketUpdateInProgress || isDeletingTicket}
            ticketType={props.ticketType}
        >
            {isLoadingTicketInformation || !ticketState ? (
                <div css={classes.drawerContentContainerLoading}>
                    <CenterLoadingSpinner size="large" />
                </div>
            ) : (
                <div css={classes.drawerContentContainerLoaded}>
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
        </TicketDrawerContainer>
    );
}

const createClasses = () => {
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
        drawerInnerContentContainer,
        drawerActionButtonContainer,
        drawerContentContainerLoaded,
        drawerContentContainerLoading,
    };
};
