/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Theme, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Api } from "../../../../../../../../../api";
import { BoardAdminContainer } from "../../components/boardAdminContainer";
import { CenterLoadingSpinner } from "../../../../../components/centerLoadingSpinner";
import { ConfirmDialog } from "../../../../components/confirmDialog";
import { NoDataWithActionButton } from "../../../components/noDataWithActionButton";
import { TicketTemplateForBoard } from "../components/ticketTemplateForBoard";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { ITicketTemplate } from "../../../../../../../../../models/ticketTemplate";
import { RouteCreator } from "../../../../../../utils/routeCreator";

export function TicketTemplatesHome() {
    const history = useHistory();
    const theme = useTheme();
    const classes = createClasses(theme);
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
        <BoardAdminContainer>
            {isLoadingTicketTemplates ? (
                <div css={classes.loadingSpinnerContainer}>
                    <CenterLoadingSpinner size="large" />
                </div>
            ) : ticketTemplates.length === 0 ? (
                <NoDataWithActionButton
                    text="No ticket templates have been created for this board"
                    wrappedButtonProps={createTicketTemplateButtonProps}
                />
            ) : (
                <div css={classes.contentContainer}>
                    <div css={classes.addTicketTemplateButtonContainer}>
                        <WrappedButton {...createTicketTemplateButtonProps} />
                    </div>
                    <div css={classes.ticketTemplatesContainer}>
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
                    </div>
                </div>
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
        </BoardAdminContainer>
    );
}

const createClasses = (theme: Theme) => {
    const innerToolbarContainer = css`
        display: flex;
        justify-content: space-between;
        width: 100%;
    `;

    const iconButtonsContainer = css`
        display: flex;
        flex-direction: row;
    `;

    const loadingSpinnerContainer = css`
        height: 100%;
        width: 100%;
        display: flex;
    `;

    const hiddenEditAndDeleteContainer = css`
        visibility: hidden;
    `;

    const ticketTemplatesContainer = css`
        flex-grow: 1;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-auto-rows: min-content;
        grid-gap: ${Number(theme.spacing()) * 2}px;
        padding: ${Number(theme.spacing()) * 4}px;
        width: 100%;
        padding-top: ${Number(theme.spacing()) * 2}px;
    `;

    const contentContainer = css`
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    `;

    const addTicketTemplateButtonContainer = css`
        flex: 0 0 auto;
        padding-top: 16px;
        padding-left: 32px;
    `;

    return {
        loadingSpinnerContainer,
        innerToolbarContainer,
        iconButtonsContainer,
        hiddenEditAndDeleteContainer,
        ticketTemplatesContainer,
        contentContainer,
        addTicketTemplateButtonContainer,
    };
};
