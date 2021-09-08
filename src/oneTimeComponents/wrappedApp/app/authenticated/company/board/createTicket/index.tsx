/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
} from "@material-ui/core";
import { useState, useEffect, ChangeEvent } from "react";
import { Api } from "../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../../../../components/centerLoadingSpinner";
import { WrappedButton } from "../../../../../../../components/wrappedButton";
import { IColumn } from "../../../../../../../models/column";
import { ITicketCreateRequest } from "../../../../../../../models/ticket/ticketCreateRequest";
import { ITicketTemplate } from "../../../../../../../models/ticketTemplate";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../redux/storeState";
import {
    updateTicketTemplate,
    resetTicketCreation,
    updateStartingColumn,
} from "../../../../../../../redux/ticketCreation";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { TicketFields } from "../../../../../../../components/ticketFields";
import { ticketPreviewId } from "../../../../../../../redux/ticket";
import { setWeightedTicketTemplates } from "../../../../../../../redux/ticketTemplates";
import { TicketBottomToolbar } from "../../../../../../../components/ticketBottomToolbar";

export function CreateTicket() {
    const history = useHistory();
    const { boardId, companyId } = useAppRouterParams();

    const { ticketTemplate, startingColumn } = useSelector(
        (store: IStoreState) => {
            return store.ticketCreation;
        }
    );
    const dispatch = useDispatch();
    useEffect(() => {
        // clear the form state when this component is first loaded
        const action = resetTicketCreation();
        dispatch(action);
    }, []);

    function onChangeTicketTemplate(
        event: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>
    ) {
        const updatedTicketTemplateShortenedItemId = event.target
            .value as string;
        const updatedTicketTemplate =
            ticketTemplates.find((compareTicketTemplate) => {
                return (
                    compareTicketTemplate.shortenedItemId ===
                    updatedTicketTemplateShortenedItemId
                );
            }) || null;
        const action = updateTicketTemplate(updatedTicketTemplate);
        dispatch(action);
    }

    function onChangeStartingColumn(
        event: ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>
    ) {
        const updatedStartingColumn = event.target.value as string;
        const action = updateStartingColumn(updatedStartingColumn);
        dispatch(action);
    }

    const [isLoadingTicketTemplates, setIsLoadingTicketTemplates] = useState(
        true
    );
    const [ticketTemplates, setTicketTemplates] = useState<ITicketTemplate[]>(
        []
    );
    const [potentialStartingColumns, setPotentialStartingColumns] = useState<
        IColumn[]
    >([]);

    useEffect(() => {
        if (!boardId || !companyId) return;

        let didCancel = false;

        Promise.all([
            Api.ticketTemplates.getTicketTemplatesForBoard(companyId, boardId),
            Api.columns.getColumns(companyId, boardId),
        ])
            .then(([ticketTemplatesFromDatabase, columnsFromDatabase]) => {
                if (didCancel) return;

                const availableTicketTemplates = ticketTemplatesFromDatabase.filter(
                    (ticketTemplate) => {
                        return !ticketTemplate.hasBeenDeleted;
                    }
                );

                const action = setWeightedTicketTemplates(
                    availableTicketTemplates
                );
                dispatch(action);
                setTicketTemplates(availableTicketTemplates);

                const startingColumns = columnsFromDatabase.filter(
                    (compareColumn) => {
                        return (
                            compareColumn.id !== "INTERNAL:UNCATEGORIZED" &&
                            compareColumn.id !== "INTERNAL:DONE"
                        );
                    }
                );

                setPotentialStartingColumns(startingColumns);
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
    }, [boardId, companyId]);

    const classes = createClasses();

    const [
        ticketCreateRequest,
        setTicketCreateRequest,
    ] = useState<null | ITicketCreateRequest>(null);

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    function onCloseSnackbar() {
        setShowSuccessSnackbar(false);
    }

    useEffect(() => {
        if (!ticketCreateRequest) return;

        let didCancel = false;

        Api.tickets
            .createTicket(companyId, boardId, ticketCreateRequest)
            .then(() => {
                if (didCancel) return;
                setShowSuccessSnackbar(true);
                const action = resetTicketCreation();
                dispatch(action);
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setTicketCreateRequest(null);
            });

        return () => {
            didCancel = true;
        };
    }, [ticketCreateRequest]);

    function navigateToBoard() {
        history.push(`/app/company/${companyId}/board/${boardId}/tickets`);
    }

    const ticket = useSelector(
        (store: IStoreState) => {
            return store.ticket[ticketPreviewId].ticket;
        },
        () => {
            return !!ticketCreateRequest;
        }
    );

    function onClickCreate() {
        const sectionValues = ticket.sections.map((section) => section.value);

        setTicketCreateRequest({
            title: ticket.title.value,
            summary: ticket.summary.value,
            sections: sectionValues,
            ticketTemplateShortenedItemId:
                ticketTemplate?.shortenedItemId || "",
            startingColumnId:
                startingColumn === "BACKLOG" ? "" : startingColumn,
        });
    }

    return (
        <BoardContainer>
            {isLoadingTicketTemplates ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.container}>
                    <div css={classes.ticketContentContainer}>
                        <div css={classes.nonTagTicketInformationContainer}>
                            <FormControl fullWidth>
                                <InputLabel>Ticket Template</InputLabel>
                                <Select
                                    value={
                                        ticketTemplate?.shortenedItemId || ""
                                    }
                                    onChange={onChangeTicketTemplate}
                                    disabled={!!ticketCreateRequest}
                                >
                                    {ticketTemplates.map(
                                        (ticketTemplateFromDatabase) => {
                                            return (
                                                <MenuItem
                                                    value={
                                                        ticketTemplateFromDatabase.shortenedItemId
                                                    }
                                                    key={
                                                        ticketTemplateFromDatabase.shortenedItemId
                                                    }
                                                >
                                                    {
                                                        ticketTemplateFromDatabase.name
                                                    }
                                                </MenuItem>
                                            );
                                        }
                                    )}
                                </Select>
                            </FormControl>
                            {!!ticketTemplate && (
                                <div css={classes.ticketSectionsContainer}>
                                    <TicketFields
                                        ticketTemplateId={
                                            ticketTemplate.shortenedItemId
                                        }
                                        ticketId={ticketPreviewId}
                                        isTicketPreview={true}
                                        disabled={!!ticketCreateRequest}
                                        removePadding
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel>Send Ticket To</InputLabel>
                                        <Select
                                            value={startingColumn}
                                            onChange={onChangeStartingColumn}
                                            disabled={!!ticketCreateRequest}
                                        >
                                            <MenuItem value={"BACKLOG"}>
                                                Backlog
                                            </MenuItem>
                                            {potentialStartingColumns.map(
                                                (potentialStartingColumn) => {
                                                    return (
                                                        <MenuItem
                                                            value={
                                                                potentialStartingColumn.id
                                                            }
                                                            key={
                                                                potentialStartingColumn.id
                                                            }
                                                        >
                                                            {
                                                                potentialStartingColumn.name
                                                            }
                                                        </MenuItem>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </FormControl>
                                </div>
                            )}
                        </div>
                    </div>
                    <TicketBottomToolbar
                        ticketTemplateId={ticketTemplate?.shortenedItemId}
                        ticketId={ticketPreviewId}
                        actionButtonText="Create Ticket"
                        onClickActionButton={onClickCreate}
                        showActionButtonSpinner={!!ticketCreateRequest}
                    />
                </div>
            )}
            <Snackbar
                open={showSuccessSnackbar}
                onClose={onCloseSnackbar}
                message={"Ticket successfully created"}
                action={
                    <WrappedButton color="secondary" onClick={navigateToBoard}>
                        Return To Board
                    </WrappedButton>
                }
            />
        </BoardContainer>
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

    const nonTagTicketInformationContainer = css`
        height: 100%;
        width: 400px;
    `;

    const ticketSectionsContainer = css`
        display: flex;
        flex-direction: column;
        margin-top: 16px;
    `;

    const ticketTagsInnerContainer = css`
        padding: 16px;
        display: flex;
        flex-direction: column;
        height: 100%;
    `;

    const outerTicketTagsContainer = css`
        display: grid;
        height: 100%;
        grid-template-rows: 1fr 1fr;
    `;

    const outerTagsOptionsContainer = css`
        display: grid;
        height: 100%;
        grid-template-rows: 1fr 1fr;
    `;

    const allChipsSpacingContainer = css`
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 8px;
    `;

    const individualChipContainer = css`
        margin-right: 4px;
        margin-bottom: 4px;
    `;

    const centerAllTagsMessageContainer = css`
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        padding: 16px;
        text-align: center;
    `;

    return {
        container,
        ticketContentContainer,
        nonTagTicketInformationContainer,
        ticketSectionsContainer,
        ticketTagsInnerContainer,
        outerTicketTagsContainer,
        outerTagsOptionsContainer,
        allChipsSpacingContainer,
        individualChipContainer,
        centerAllTagsMessageContainer,
    };
};
