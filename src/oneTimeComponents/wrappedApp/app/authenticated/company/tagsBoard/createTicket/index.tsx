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
import { BottomPageToolbar } from "../../../../../../../components/bottomPageToolbar";
import { CenterLoadingSpinner } from "../../../../../../../components/centerLoadingSpinner";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../../../../components/wrappedButton";
import { IColumn } from "../../../../../../../models/column";
import { ITag } from "../../../../../../../models/tag";
import { ITicketCreateRequest } from "../../../../../../../models/ticket/ticketCreateRequest";
import { ITicketTemplate } from "../../../../../../../models/ticketTemplate";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { useHistory } from "react-router-dom";
import { TicketTags } from "../../../../../../../components/ticketTags";
import { ISimplifiedTag } from "../../../../../../../models/simplifiedTag";
import { WrappedTextField } from "../../../../../../../components/wrappedTextField";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../redux/storeState";
import {
    updateTicketTitle,
    updateTicketSummary,
    updateTicketTemplate,
    resetTicketCreation,
    updateSection,
    updateStartingColumn,
} from "../../../../../../../redux/ticketCreation";
import { TagsBoardContainer } from "../../../../../../../components/tagsBoardContainer";

export function CreateTicket() {
    const history = useHistory();
    const { boardId, companyId } = useAppRouterParams();

    const {
        title,
        summary,
        ticketTemplate,
        sections,
        startingColumn,
    } = useSelector((store: IStoreState) => {
        return store.ticketCreation;
    });
    const dispatch = useDispatch();
    useEffect(() => {
        // clear the form state when this component is first loaded
        const action = resetTicketCreation();
        dispatch(action);
    }, []);

    const showTicketTitleError = title.touched && title.error;
    function onChangeTicketTitle(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const updatedTicketTitle = event.target.value;
        const action = updateTicketTitle(updatedTicketTitle);
        dispatch(action);
    }

    const showSummaryError = summary.touched && summary.error;
    function onChangeTicketSummary(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const updatedTicketSummary = event.target.value;
        const action = updateTicketSummary(updatedTicketSummary);
        dispatch(action);
    }

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

    function onChangeSectionValue(index: number) {
        return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const updatedSectionValue = event.target.value;
            const action = updateSection({
                value: updatedSectionValue,
                index,
            });
            dispatch(action);
        };
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

    const controlsAreInvalid = !!title.error || !!summary.error;

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
                const action = resetTicketCreation();
                dispatch(action);
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
        history.push(`/app/company/${companyId}/tags-board/${boardId}/tickets`);
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
        const sectionValues = sections.map((section) => section.value);

        setTicketCreateRequest({
            title: title.value,
            summary: summary.value,
            sections: sectionValues,
            tags: tagsState.simplifiedTags,
            simplifiedTicketTemplate: {
                title: ticketTemplate!.title,
                summary: ticketTemplate!.summary,
                sections: ticketTemplate!.sections,
            },
            startingColumnId:
                startingColumn === "BACKLOG" ? "" : startingColumn,
        });
    }

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            color: "primary",
            variant: "contained",
            disabled: controlsAreInvalid || !!ticketCreateRequest,
            showSpinner: !!ticketCreateRequest,
            onClick: onClickCreate,
            children: "Create Ticket",
        },
    ];

    return (
        <TagsBoardContainer>
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
                                    <WrappedTextField
                                        value={title.value}
                                        label={"Title"}
                                        onChange={onChangeTicketTitle}
                                        error={
                                            showTicketTitleError
                                                ? title.error
                                                : ""
                                        }
                                    />
                                    <WrappedTextField
                                        multiline
                                        value={summary.value}
                                        label={"Summary"}
                                        onChange={onChangeTicketSummary}
                                        error={
                                            showSummaryError
                                                ? summary.error
                                                : ""
                                        }
                                    />
                                    {sections.map((section, index) => {
                                        const equivalentTicketTemplateSection =
                                            ticketTemplate.sections[index];

                                        return (
                                            <WrappedTextField
                                                key={index}
                                                multiline={
                                                    equivalentTicketTemplateSection.multiline
                                                }
                                                value={section.value}
                                                label={
                                                    equivalentTicketTemplateSection.label
                                                }
                                                onChange={onChangeSectionValue(
                                                    index
                                                )}
                                                error={""}
                                            />
                                        );
                                    })}
                                    <FormControl fullWidth>
                                        <InputLabel>Send Ticket To</InputLabel>
                                        <Select
                                            value={startingColumn}
                                            onChange={onChangeStartingColumn}
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
        </TagsBoardContainer>
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
