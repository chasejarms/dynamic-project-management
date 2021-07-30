/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
} from "@material-ui/core";
import { useState, useEffect, useCallback } from "react";
import { Api } from "../../../../../../../api";
import { ControlValidator } from "../../../../../../../classes/ControlValidator";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { BottomPageToolbar } from "../../../../../../../components/bottomPageToolbar";
import { CenterLoadingSpinner } from "../../../../../../../components/centerLoadingSpinner";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../../../../components/wrappedButton";
import { useControl } from "../../../../../../../hooks/useControl";
import { IColumn } from "../../../../../../../models/column";
import { ITag } from "../../../../../../../models/tag";
import { ITicketCreateRequest } from "../../../../../../../models/ticket/ticketCreateRequest";
import { ITicketTemplate } from "../../../../../../../models/ticketTemplate";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { useHistory } from "react-router-dom";
import { TicketTags } from "../../../../../../../components/ticketTags";
import { ISimplifiedTag } from "../../../../../../../models/simplifiedTag";
import { cloneDeep } from "lodash";
import {
    TitleSection,
    titleSectionUniqueId,
} from "../../../../../../../components/titleSection";
import {
    SummarySection,
    summarySectionUniqueId,
} from "../../../../../../../components/summarySection";
import { IGhostControlParamsMapping } from "../../../../../../../models/ghostControlPattern/ghostControlParamsMapping";
import { IGhostControlParams } from "../../../../../../../models/ghostControlPattern/ghostControlParams";
import { IStarterGhostControlParamsMapping } from "../../../../../../../models/ghostControlPattern/starterGhostControlParamsMapping";
import { generateUniqueId } from "../../../../../../../utils/generateUniqueId";

export function CreateTicket() {
    const history = useHistory();
    const { boardId, companyId } = useAppRouterParams();

    const [isLoadingTicketTemplates, setIsLoadingTicketTemplates] = useState(
        true
    );
    const [ticketTemplates, setTicketTemplates] = useState<ITicketTemplate[]>(
        []
    );
    const [potentialStartingColumns, setPotentialStartingColumns] = useState<
        IColumn[]
    >([]);
    const [allTagsForBoard, setAllTagsForBoard] = useState<ITag[]>([]);

    useEffect(() => {
        if (!boardId || !companyId) return;

        let didCancel = false;

        Promise.all([
            Api.ticketTemplates.getTicketTemplatesForBoard(companyId, boardId),
            Api.columns.getColumns(companyId, boardId),
            Api.priorities.getAllTagsForBoard(companyId, boardId),
        ])
            .then(
                ([ticketTemplatesFromDatabase, columnsFromDatabase, tags]) => {
                    if (didCancel) return;
                    setTicketTemplates(ticketTemplatesFromDatabase);
                    setAllTagsForBoard(tags);

                    const startingColumns = columnsFromDatabase.filter(
                        (compareColumn) => {
                            return (
                                compareColumn.id !== "INTERNAL:UNCATEGORIZED" &&
                                compareColumn.id !== "INTERNAL:DONE"
                            );
                        }
                    );

                    setPotentialStartingColumns(startingColumns);
                }
            )
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

    const ticketTemplateControl = useControl({
        value: "",
        onChange: (
            event: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
            }>
        ) => {
            return event.target.value as string;
        },
        validatorError: (ticketTemplateId: string) => {
            return ControlValidator.string()
                .required("This field is required")
                .validate(ticketTemplateId);
        },
    });

    const selectedTicketTemplate = ticketTemplates.find(
        (compareTicketTemplate) => {
            return (
                compareTicketTemplate.shortenedItemId ===
                ticketTemplateControl.value
            );
        }
    );

    const [sectionOrder, setSectionOrder] = useState<string[]>([]);
    useEffect(() => {
        if (!selectedTicketTemplate) return;

        const mapping: IStarterGhostControlParamsMapping = {
            [titleSectionUniqueId]: {
                uniqueId: titleSectionUniqueId,
                value: "",
            },
            [summarySectionUniqueId]: {
                uniqueId: summarySectionUniqueId,
                value: "",
            },
        };

        const sectionOrder: string[] = [];
        selectedTicketTemplate.sections.forEach((section) => {
            const uniqueId = generateUniqueId(3);
            sectionOrder.push(uniqueId);
            mapping[uniqueId] = {
                uniqueId,
                value: section,
            };
        });

        setSectionOrder(sectionOrder);
        setStarterGhostControlParamsMapping(mapping);
        setRefreshToken({});
    }, [selectedTicketTemplate]);

    const [
        starterGhostControlParamsMapping,
        setStarterGhostControlParamsMapping,
    ] = useState<IStarterGhostControlParamsMapping>({});

    const [ghostControlParamsMapping, setGhostControlParamsMapping] = useState<
        IGhostControlParamsMapping
    >({});
    const onStateChange = useCallback(
        (ghostControlParams: IGhostControlParams) => {
            setGhostControlParamsMapping((previousGhostControlParams) => {
                const updatedGhostControlParams = {
                    ...previousGhostControlParams,
                    [ghostControlParams.uniqueId]: ghostControlParams,
                };

                return updatedGhostControlParams;
            });
        },
        []
    );

    const someControlsAreInvalid = Object.values(
        ghostControlParamsMapping
    ).some(({ error }) => !!error);

    const startingColumnControl = useControl({
        value: "BACKLOG",
        onChange: (
            event: React.ChangeEvent<{
                name?: string;
                value: unknown;
            }>
        ) => {
            return event.target.value as string;
        },
    });

    const classes = createClasses();

    const [
        ticketCreateRequest,
        setTicketCreateRequest,
    ] = useState<null | ITicketCreateRequest>(null);

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    function onCloseSnackbar() {
        setShowSuccessSnackbar(false);
    }

    const [refreshToken, setRefreshToken] = useState({});
    useEffect(() => {
        if (!ticketCreateRequest) return;

        let didCancel = false;

        Api.tickets
            .createTicket(companyId, boardId, ticketCreateRequest)
            .then(() => {
                if (didCancel) return;
                setShowSuccessSnackbar(true);
                ticketTemplateControl.resetControlState("");
                startingColumnControl.resetControlState("BACKLOG");
                setRefreshToken({});
                setTagsState({
                    simplifiedTags: [],
                    isDirty: false,
                });
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

    const [tagsState, setTagsState] = useState<{
        simplifiedTags: ISimplifiedTag[];
        isDirty: boolean;
    }>({
        simplifiedTags: [],
        isDirty: false,
    });
    function onTagsChange(simplifiedTags: ISimplifiedTag[], isDirty: boolean) {
        setTagsState({
            simplifiedTags,
            isDirty,
        });
    }

    function onClickCreate() {
        const title = ghostControlParamsMapping[titleSectionUniqueId].value;
        const summary = ghostControlParamsMapping[summarySectionUniqueId].value;

        setTicketCreateRequest({
            title,
            summary,
            sections: [],
            tags: tagsState.simplifiedTags,
            simplifiedTicketTemplate: {
                title: selectedTicketTemplate!.title,
                summary: selectedTicketTemplate!.summary,
                sections: selectedTicketTemplate!.sections,
            },
            startingColumnId:
                startingColumnControl.value === "BACKLOG"
                    ? ""
                    : startingColumnControl.value,
        });
    }

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            color: "primary",
            variant: "contained",
            disabled:
                !startingColumnControl.isValid ||
                !!ticketCreateRequest ||
                someControlsAreInvalid,
            showSpinner: !!ticketCreateRequest,
            onClick: onClickCreate,
            children: "Create Ticket",
        },
    ];

    const titleControl = starterGhostControlParamsMapping[titleSectionUniqueId];
    const summaryControl =
        starterGhostControlParamsMapping[summarySectionUniqueId];

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
                                    value={ticketTemplateControl.value}
                                    onChange={ticketTemplateControl.onChange}
                                >
                                    {ticketTemplates.map((ticketTemplate) => {
                                        return (
                                            <MenuItem
                                                value={
                                                    ticketTemplate.shortenedItemId
                                                }
                                                key={
                                                    ticketTemplate.shortenedItemId
                                                }
                                            >
                                                {ticketTemplate.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                            {!!selectedTicketTemplate &&
                                !!titleControl &&
                                !!summaryControl && (
                                    <div css={classes.ticketSectionsContainer}>
                                        <TitleSection
                                            title={titleControl.value}
                                            label={
                                                selectedTicketTemplate?.title
                                                    .label || ""
                                            }
                                            onStateChange={onStateChange}
                                            refreshToken={refreshToken}
                                        />
                                        {/* <SummarySection
                                        summary={summaryControl.value}
                                        label={
                                            selectedTicketTemplate?.summary
                                                .label || ""
                                        }
                                        onStateChange={onStateChange}
                                    /> */}
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                Send Ticket To
                                            </InputLabel>
                                            <Select
                                                value={
                                                    startingColumnControl.value
                                                }
                                                onChange={
                                                    startingColumnControl.onChange
                                                }
                                            >
                                                <MenuItem value={"BACKLOG"}>
                                                    Backlog
                                                </MenuItem>
                                                {potentialStartingColumns.map(
                                                    (
                                                        potentialStartingColumn
                                                    ) => {
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
                        <TicketTags
                            tags={tagsState.simplifiedTags}
                            allTagsForBoard={allTagsForBoard}
                            onTagsChange={onTagsChange}
                        />
                    </div>
                    <BottomPageToolbar
                        wrappedButtonProps={wrappedButtonProps}
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
        display: grid;
        padding: 32px;
        grid-gap: 32px;
        grid-template-columns: 1fr 1fr 1fr;
    `;

    const nonTagTicketInformationContainer = css`
        height: 100%;
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
