import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { DrawerContainer } from "../components/drawerContainer";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../../../hooks/useAppRouterParams";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Api } from "../../../../../../../api";
import { useIsBoardAdmin } from "../hooks/useIsBoardAdmin";
import { IColumn } from "../../../../../../../models/column";
import { ITicketCreateRequest } from "../../../../../../../models/ticket/ticketCreateRequest";
import { ITicketTemplate } from "../../../../../../../models/ticketTemplate";
import { IStoreState } from "../../../../../../../redux/storeState";
import { ticketPreviewId } from "../../../../../../../redux/ticketControlMappedState";
import {
    resetTicketCreation,
    updateTicketTemplate,
    updateStartingColumn,
} from "../../../../../../../redux/ticketCreation";
import { setWeightedTicketTemplates } from "../../../../../../../redux/ticketTemplates";
import { IWrappedButtonProps } from "../../../../components/wrappedButton";
import { SelectChangeEvent, Box } from "@mui/material";
import { CenterLoadingSpinner } from "../../../components/centerLoadingSpinner";
import { NoDataWithActionButton } from "../components/noDataWithActionButton";
import { TicketFields } from "../components/ticketFields";
import { DrawerContentsWithActionBar } from "../components/drawerContentsWithActionBar";
import { ITicket } from "../../../../../../../models/ticket";
import { TicketTemplateDropdown } from "../components/ticketTemplateDropdown";
import { RouteCreator } from "../../../../utils/routeCreator";
import {
    IWrappedDropdownOption,
    WrappedDropdown,
} from "../components/wrappedDropdown";

export interface ICreateTicketProps {
    ticketType: TicketType;
    onCreateTicket?: (newlyCreatedTicket: ITicket) => void;
}

export function CreateTicket(props: ICreateTicketProps) {
    const history = useHistory();
    const { companyId, boardId } = useAppRouterParams();

    function closeDrawer() {
        if (props.ticketType === TicketType.InProgress) {
            const route = RouteCreator.inProgressTickets(companyId, boardId);
            history.push(route);
        } else if (props.ticketType === TicketType.Backlog) {
            const route = RouteCreator.backlogTickets(companyId, boardId);
            history.push(route);
        } else {
            const route = RouteCreator.archivedTickets(companyId, boardId);
            history.push(route);
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

    function onChangeTicketTemplate(event: SelectChangeEvent<any>) {
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

    function onChangeStartingColumn(event: SelectChangeEvent<any>) {
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
            return store.ticketControlMappedState[ticketPreviewId].ticket;
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
        const route = RouteCreator.createTicketTemplate(companyId, boardId);
        history.push(route);
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
        const ticket = store.ticketControlMappedState[ticketPreviewId].ticket;

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

    const options: IWrappedDropdownOption[] = [
        {
            value: "BACKLOG",
            label: "Backlog",
            testId: "backlog-menu-item",
            key: "backlog",
        },
    ].concat(
        potentialStartingColumns.map(({ id, name }) => {
            return {
                value: id,
                label: name,
                testId: id,
                key: id,
            };
        })
    );

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
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                height: "100%",
                                width: "400px",
                            }}
                        >
                            <TicketTemplateDropdown
                                onChangeTicketTemplate={onChangeTicketTemplate}
                                disabled={!!ticketCreateRequest}
                                ticketTemplate={ticketTemplate}
                                ticketTemplates={ticketTemplates}
                                showOpenIcon={isBoardAdmin}
                            />
                            {!!ticketTemplate && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        marginTop: 2,
                                    }}
                                >
                                    <TicketFields
                                        ticketTemplateId={
                                            ticketTemplate.shortenedItemId
                                        }
                                        ticketId={ticketPreviewId}
                                        isTicketPreview={true}
                                        disabled={!!ticketCreateRequest}
                                    />
                                    <WrappedDropdown
                                        value={startingColumn}
                                        onChange={onChangeStartingColumn}
                                        disabled={!!ticketCreateRequest}
                                        label="Send Ticket To"
                                        options={options}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </DrawerContentsWithActionBar>
        </DrawerContainer>
    );
}
