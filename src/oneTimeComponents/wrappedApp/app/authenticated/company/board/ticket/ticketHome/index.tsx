/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Snackbar } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../../../../../components/centerLoadingSpinner";
import { TicketBottomToolbar } from "../../../../../../../../components/ticketBottomToolbar";
import { TicketFields } from "../../../../../../../../components/ticketFields";
import { TicketPageWrapper } from "../../../../../../../../components/ticketPageWrapper";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { ITicket } from "../../../../../../../../models/ticket";
import { ITicketUpdateRequest } from "../../../../../../../../models/ticketUpdateRequest";
import { IStoreState } from "../../../../../../../../redux/storeState";
import { setInitialTicketData } from "../../../../../../../../redux/ticket";
import { setWeightedTicketTemplate } from "../../../../../../../../redux/ticketTemplates";

export function TicketHome() {
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

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    function onCloseSnackbar() {
        setShowSuccessSnackbar(false);
    }

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
                setShowSuccessSnackbar(true);
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
        <TicketPageWrapper>
            {isLoadingTicketInformation || !ticketState ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.container}>
                    <div css={classes.ticketContentContainer}>
                        <div css={classes.ticketContentContainerInnerFields}>
                            <TicketFields
                                ticketTemplateId={
                                    ticketState.ticketTemplate.shortenedItemId
                                }
                                ticketId={ticketId}
                                isTicketPreview={false}
                                disabled={ticketUpdateInProgress}
                                removePadding
                            />
                        </div>
                    </div>
                    <TicketBottomToolbar
                        ticketTemplateId={
                            ticketState.ticketTemplate.shortenedItemId
                        }
                        ticketId={ticketId}
                        actionButtonText="Update Ticket"
                        onClickActionButton={onClickUpdate}
                        showActionButtonSpinner={ticketUpdateInProgress}
                    />
                </div>
            )}
            <Snackbar
                open={showSuccessSnackbar}
                onClose={onCloseSnackbar}
                message={"Ticket successfully updated."}
            />
        </TicketPageWrapper>
    );
}

const createClasses = () => {
    const container = css`
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    `;

    const ticketContentContainer = css`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 32px;
    `;

    const ticketContentContainerInnerFields = css`
        width: 400px;
    `;

    return {
        container,
        ticketContentContainer,
        ticketContentContainerInnerFields,
    };
};
