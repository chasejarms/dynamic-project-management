import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../components/centerLoadingSpinner";
import { ConfirmDialog } from "../../../components/confirmDialog";
import { NoDataWithActionButton } from "../../components/noDataWithActionButton";
import { TicketTemplateForBoard } from "../components/ticketTemplateForBoard";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../hooks/useAppRouterParams";
import { ITicketTemplate } from "../../../../../../../../models/ticketTemplate";
import { RouteCreator } from "../../../../../utils/routeCreator";
import { Box } from "@mui/material";
import { BoardContainer } from "../../components/boardContainer";

export function TicketTemplatesHome() {
    const history = useHistory();
    const [ticketTemplates, setTicketTemplates] = useState<ITicketTemplate[]>(
        []
    );

    const { boardId, companyId } = useAppRouterParams();

    const [isLoadingTicketTemplates, setIsLoadingTicketTemplates] = useState(
        true
    );
    useEffect(() => {
        if (!isLoadingTicketTemplates || !companyId || !boardId) return;

        let didCancel = false;

        Api.ticketTemplates
            .getTicketTemplatesForBoard(companyId, boardId)
            .then((ticketTemplatesFromDatabase) => {
                if (didCancel) return;
                const availableTicketTemplates = ticketTemplatesFromDatabase.filter(
                    (ticketTemplate) => {
                        return !ticketTemplate.hasBeenDeleted;
                    }
                );
                setTicketTemplates(availableTicketTemplates);
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingTicketTemplates(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isLoadingTicketTemplates, companyId, boardId]);

    const [
        deletingTicketTemplateData,
        setDeletingTicketTemplateData,
    ] = useState({
        ticketTemplateIdToDelete: "",
        isDeletingTicketTemplate: false,
    });
    function deleteSelectedTicketTemplate() {
        setDeletingTicketTemplateData((previousDeletingTicketTemplateData) => {
            return {
                ...previousDeletingTicketTemplateData,
                isDeletingTicketTemplate: true,
            };
        });
    }
    function onClickDeleteTicketTemplateIcon(ticketTemplateId: string) {
        return () => {
            setDeletingTicketTemplateData(
                (previousDeletingTicketTemplateData) => {
                    return {
                        ...previousDeletingTicketTemplateData,
                        ticketTemplateIdToDelete: ticketTemplateId,
                    };
                }
            );
        };
    }
    function onCloseConfirmDialog() {
        setDeletingTicketTemplateData(() => {
            return {
                isDeletingTicketTemplate: false,
                ticketTemplateIdToDelete: "",
            };
        });
    }

    const confirmDialogIsOpen =
        deletingTicketTemplateData.ticketTemplateIdToDelete !== "";
    const selectedTicketTemplateToDelete = deletingTicketTemplateData.ticketTemplateIdToDelete
        ? ticketTemplates.find((compareTicketTemplate) => {
              return (
                  compareTicketTemplate.shortenedItemId ===
                  deletingTicketTemplateData.ticketTemplateIdToDelete
              );
          })!
        : null;

    useEffect(() => {
        let didCancel = false;
        if (!deletingTicketTemplateData.isDeletingTicketTemplate) return;

        Api.ticketTemplates
            .deleteTicketTemplateForBoard(
                companyId,
                boardId,
                deletingTicketTemplateData.ticketTemplateIdToDelete
            )
            .then(() => {
                if (didCancel) return;
                setTicketTemplates((previousTicketTemplates) => {
                    return previousTicketTemplates.filter((compareTemplate) => {
                        return (
                            compareTemplate.shortenedItemId !==
                            deletingTicketTemplateData.ticketTemplateIdToDelete
                        );
                    });
                });
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                onCloseConfirmDialog();
            });

        return () => {
            didCancel = true;
        };
    }, [deletingTicketTemplateData, companyId, boardId]);

    function navigateToCreateTicketTemplatePage() {
        const route = RouteCreator.createTicketTemplate(companyId, boardId);
        history.push(route);
    }

    const createTicketTemplateButtonProps: IWrappedButtonProps = {
        color: "primary",
        onClick: navigateToCreateTicketTemplatePage,
        children: "Add Ticket Template",
    };

    return (
        <BoardContainer>
            {isLoadingTicketTemplates ? (
                <Box
                    sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        overflow: "auto",
                    }}
                >
                    <CenterLoadingSpinner size="large" />
                </Box>
            ) : ticketTemplates.length === 0 ? (
                <NoDataWithActionButton
                    text="No ticket templates have been created for this board"
                    wrappedButtonProps={createTicketTemplateButtonProps}
                />
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexGrow: 1,
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            flex: "0 0 auto",
                            paddingTop: 2,
                            paddingLeft: 4,
                        }}
                    >
                        <WrappedButton {...createTicketTemplateButtonProps} />
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gridAutoRows: "min-content",
                            gap: 2,
                            padding: 4,
                            width: "100%",
                            paddingTop: 2,
                        }}
                    >
                        {ticketTemplates.map((ticketTemplate) => {
                            return (
                                <TicketTemplateForBoard
                                    key={ticketTemplate.shortenedItemId}
                                    ticketTemplate={ticketTemplate}
                                    onClickDeleteTicketTemplate={onClickDeleteTicketTemplateIcon(
                                        ticketTemplate.shortenedItemId
                                    )}
                                    canDeleteTicketTemplate={
                                        ticketTemplates.length > 1
                                    }
                                />
                            );
                        })}
                    </Box>
                </Box>
            )}
            <ConfirmDialog
                open={confirmDialogIsOpen}
                onClose={onCloseConfirmDialog}
                title="Delete Ticket Template"
                content={`Are you sure you want to delete ticket ${selectedTicketTemplateToDelete?.name}?`}
                confirmButtonText="Delete"
                onConfirm={deleteSelectedTicketTemplate}
                isPerformingAction={
                    deletingTicketTemplateData.isDeletingTicketTemplate
                }
            />
        </BoardContainer>
    );
}
