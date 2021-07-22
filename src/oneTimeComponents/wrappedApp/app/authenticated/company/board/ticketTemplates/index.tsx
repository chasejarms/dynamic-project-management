/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Toolbar,
    makeStyles,
    Theme,
    Typography,
    IconButton,
    CircularProgress,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { Api } from "../../../../../../../api";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { ConfirmDialog } from "../../../../../../../components/confirmDialog";
import { CreateTicketTemplateDialog } from "../../../../../../../components/createTicketTemplateDialog";
import { WrappedButton } from "../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { ITicketTemplate } from "../../../../../../../models/ticketTemplate";
import { composeCSS } from "../../../../../../../styles/composeCSS";

const useStyles = makeStyles((theme: Theme) => ({
    toolbarRoot: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

export function TicketTemplates() {
    const classes = createClasses();
    const materialClasses = useStyles();
    const columns = ["Template Name", "Template Description", ""];
    const [ticketTemplates, setTicketTemplates] = useState<ITicketTemplate[]>(
        []
    );

    function onCreateSuccess(ticketTemplate: ITicketTemplate) {
        setTicketTemplates((previousTicketTemplates) => {
            return [...previousTicketTemplates, ticketTemplate];
        });
    }

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
                setTicketTemplates(ticketTemplatesFromDatabase);
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

    const hideEditAndDeleteContainer = ticketTemplates.length === 1;
    const [isShowingCreateDialog, setIsShowingCreateDialog] = useState(false);
    function showCreateDialog() {
        setIsShowingCreateDialog(true);
    }
    function closeCreateDialog() {
        setIsShowingCreateDialog(false);
    }

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

    return (
        <BoardContainer>
            <div css={classes.container}>
                {isLoadingTicketTemplates ? (
                    <div css={classes.centerLoadingSpinner}>
                        <CircularProgress
                            color="primary"
                            size={24}
                            thickness={4}
                        />
                    </div>
                ) : (
                    <Paper>
                        <Toolbar className={materialClasses.toolbarRoot}>
                            <div css={classes.innerToolbarContainer}>
                                <Typography variant="h6">
                                    Ticket Templates
                                </Typography>
                                <WrappedButton
                                    color="primary"
                                    onClick={showCreateDialog}
                                >
                                    Add Ticket Template
                                </WrappedButton>
                            </div>
                        </Toolbar>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => {
                                        return (
                                            <TableCell key={column}>
                                                {column}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ticketTemplates.map(
                                    ({
                                        name,
                                        description,
                                        shortenedItemId,
                                    }) => {
                                        return (
                                            <TableRow key={shortenedItemId}>
                                                <TableCell>{name}</TableCell>
                                                <TableCell>
                                                    {description}
                                                </TableCell>
                                                <TableCell padding="none">
                                                    <div
                                                        css={composeCSS(
                                                            classes.iconButtonsContainer,
                                                            hideEditAndDeleteContainer &&
                                                                classes.hiddenEditAndDeleteContainer
                                                        )}
                                                    >
                                                        <div>
                                                            <IconButton
                                                                onClick={onClickDeleteTicketTemplateIcon(
                                                                    shortenedItemId
                                                                )}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                )}
            </div>
            <CreateTicketTemplateDialog
                open={isShowingCreateDialog}
                onClose={closeCreateDialog}
                onCreateSuccess={onCreateSuccess}
            />
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

const createClasses = () => {
    const container = css`
        height: 100%;
        padding: 32px;
        width: 100%;
    `;

    const innerToolbarContainer = css`
        display: flex;
        justify-content: space-between;
        width: 100%;
    `;

    const iconButtonsContainer = css`
        display: flex;
        flex-direction: row;
    `;

    const centerLoadingSpinner = css`
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const hiddenEditAndDeleteContainer = css`
        visibility: hidden;
    `;

    return {
        container,
        innerToolbarContainer,
        iconButtonsContainer,
        centerLoadingSpinner,
        hiddenEditAndDeleteContainer,
    };
};
