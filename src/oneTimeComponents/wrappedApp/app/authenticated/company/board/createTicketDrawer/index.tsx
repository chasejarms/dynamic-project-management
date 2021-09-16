/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { DrawerContainer } from "../components/drawerContainer";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { useEffect, ChangeEvent, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Api } from "../../../../../../../api";
import { useIsBoardAdmin } from "../../../../../../../hooks/useIsBoardAdmin";
import { IColumn } from "../../../../../../../models/column";
import { ITicketCreateRequest } from "../../../../../../../models/ticket/ticketCreateRequest";
import { ITicketTemplate } from "../../../../../../../models/ticketTemplate";
import { IStoreState } from "../../../../../../../redux/storeState";
import { ticketPreviewId } from "../../../../../../../redux/ticket";
import {
    resetTicketCreation,
    updateTicketTemplate,
    updateStartingColumn,
} from "../../../../../../../redux/ticketCreation";
import { setWeightedTicketTemplates } from "../../../../../../../redux/ticketTemplates";
import { IWrappedButtonProps } from "../../../../components/wrappedButton";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { CenterLoadingSpinner } from "../../../components/centerLoadingSpinner";
import { NoDataWithActionButton } from "../../../../../../../components/noDataWithActionButton";
import { TicketFields } from "../components/ticketFields";
import { DrawerContentsWithActionBar } from "../components/drawerContentsWithActionBar";
import { ITicket } from "../../../../../../../models/ticket";

export interface ICreateTicketDrawerProps {
    ticketType: TicketType;
    onCreateTicket?: (newlyCreatedTicket: ITicket) => void;
}

export function CreateTicketDrawer(props: ICreateTicketDrawerProps) {
    const history = useHistory();
    const { companyId, boardId } = useAppRouterParams();

    function closeDrawer() {
        if (props.ticketType === TicketType.InProgress) {
            history.push(`/app/company/${companyId}/board/${boardId}/tickets`);
        } else if (props.ticketType === TicketType.Backlog) {
            history.push(
                `/app/company/${companyId}/board/${boardId}/backlog-tickets`
            );
        } else {
            history.push(
                `/app/company/${companyId}/board/${boardId}/archived-tickets`
            );
        }
    }

    const isBoardAdmin = useIsBoardAdmin();

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
    const isCreatingTicket = !!ticketCreateRequest;

    useEffect(() => {
        if (!ticketCreateRequest) return;

        let didCancel = false;

        Api.tickets
            .createTicket(companyId, boardId, ticketCreateRequest)
            .then((newlyCreatedTicket) => {
                if (didCancel) return;
                if (
                    !!props.onCreateTicket &&
                    ticketCreateRequest.startingColumnId === "" &&
                    props.ticketType === TicketType.Backlog
                ) {
                    props.onCreateTicket(newlyCreatedTicket);
                } else if (
                    !!props.onCreateTicket &&
                    ticketCreateRequest.startingColumnId !== "" &&
                    props.ticketType === TicketType.InProgress
                ) {
                    props.onCreateTicket(newlyCreatedTicket);
                }
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

    function navigateToCreateTicketTemplatePage() {
        history.push(
            `/app/company/${companyId}/board/${boardId}/admin/ticket-templates/create-ticket-template`
        );
    }

    const createTicketTemplateButtonProps:
        | IWrappedButtonProps
        | undefined = isBoardAdmin
        ? {
              color: "primary",
              onClick: navigateToCreateTicketTemplatePage,
              children: "Create Ticket Template",
          }
        : undefined;

    const allControlsAreValid = useSelector((store: IStoreState) => {
        const ticket = store.ticket[ticketPreviewId].ticket;

        const titleIsValid = !ticket.title.error;
        const summaryIsValid = !ticket.summary.error;
        const sectionsAreValid = ticket.sections.every((section) => {
            return !section.error;
        });

        return titleIsValid && summaryIsValid && sectionsAreValid;
    });

    const rightWrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: onClickCreate,
            color: "primary",
            disabled:
                isCreatingTicket || !allControlsAreValid || !ticketTemplate,
            showSpinner: isCreatingTicket,
            children: "Create Ticket",
        },
    ];

    return (
        <DrawerContainer
            darkOpacityOnClick={isCreatingTicket ? undefined : closeDrawer}
        >
            <DrawerContentsWithActionBar
                title="Create Ticket"
                rightWrappedButtonProps={rightWrappedButtonProps}
            >
                {isLoadingTicketTemplates ? (
                    <CenterLoadingSpinner size="large" />
                ) : ticketTemplates.length === 0 ? (
                    <NoDataWithActionButton
                        text={
                            "No ticket templates have been created for this board"
                        }
                        wrappedButtonProps={createTicketTemplateButtonProps}
                    />
                ) : (
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
                )}
            </DrawerContentsWithActionBar>
        </DrawerContainer>
    );
}

const createClasses = () => {
    const ticketContentContainer = css`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
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

    return {
        ticketContentContainer,
        nonTagTicketInformationContainer,
        ticketSectionsContainer,
    };
};
