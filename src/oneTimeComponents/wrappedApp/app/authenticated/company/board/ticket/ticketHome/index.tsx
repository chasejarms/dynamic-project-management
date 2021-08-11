/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../../../../../components/centerLoadingSpinner";
import { Paper } from "@material-ui/core";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../../../../../components/wrappedButton";
import { ITag } from "../../../../../../../../models/tag";
import { cloneDeep } from "lodash";
import { ITicket } from "../../../../../../../../models/ticket";
import { ISimplifiedTag } from "../../../../../../../../models/simplifiedTag";
import { ITicketUpdateRequest } from "../../../../../../../../models/ticketUpdateRequest";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { useHistory } from "react-router-dom";
import { TicketPageWrapper } from "../../../../../../../../components/ticketPageWrapper";
import {
    TitleSection,
    titleSectionUniqueId,
} from "../../../../../../../../components/titleSection";
import {
    SummarySection,
    summarySectionUniqueId,
} from "../../../../../../../../components/summarySection";
import { TicketTags } from "../../../../../../../../components/ticketTags";
import { IGhostControlParams } from "../../../../../../../../models/ghostControlPattern/ghostControlParams";
import { IGhostControlParamsMapping } from "../../../../../../../../models/ghostControlPattern/ghostControlParamsMapping";
import { IStarterGhostControlParamsMapping } from "../../../../../../../../models/ghostControlPattern/starterGhostControlParamsMapping";
import { generateUniqueId } from "../../../../../../../../utils/generateUniqueId";
import { TextSection } from "../../../../../../../../components/textSection";
import { OverflowContentAndActionBar } from "../../../../../../../../components/overflowContentAndActionBar";

export function TicketHome() {
    const { boardId, companyId, ticketId } = useAppRouterParams();

    const [
        isLoadingTicketInformation,
        setIsLoadingTicketInformation,
    ] = useState(true);
    const [allTagsForBoard, setAllTagsForBoard] = useState<ITag[]>([]);
    const [ticket, setTicket] = useState<ITicket | null>(null);

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

    const [
        { starterGhostControlParamsMapping, sectionOrder },
        setStarterGhostControlParamsMappingAndSectionOrder,
    ] = useState<{
        starterGhostControlParamsMapping: IStarterGhostControlParamsMapping;
        sectionOrder: string[];
    }>({
        starterGhostControlParamsMapping: {},
        sectionOrder: [],
    });

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

    useEffect(() => {
        if (!boardId || !companyId || !ticketId) return;

        let didCancel = false;

        Promise.all([
            Api.columns.getColumns(companyId, boardId),
            Api.priorities.getAllTagsForBoard(companyId, boardId),
            Api.tickets.getTicketInformationById(companyId, boardId, ticketId),
        ])
            .then(([columnsFromDatabase, tags, ticketFromDatabase]) => {
                if (didCancel) return;
                setAllTagsForBoard(tags);
                setTicket(ticketFromDatabase);

                const mapping: IStarterGhostControlParamsMapping = {
                    [titleSectionUniqueId]: {
                        uniqueId: titleSectionUniqueId,
                        value: ticketFromDatabase.title,
                    },
                    [summarySectionUniqueId]: {
                        uniqueId: summarySectionUniqueId,
                        value: ticketFromDatabase.summary,
                    },
                };
                const sectionOrderFromDatabase: string[] = [];
                ticketFromDatabase.sections.forEach((sectionValue) => {
                    const uniqueId = generateUniqueId(3);
                    sectionOrderFromDatabase.push(uniqueId);

                    mapping[uniqueId] = {
                        uniqueId,
                        value: sectionValue,
                    };
                });
                setStarterGhostControlParamsMappingAndSectionOrder({
                    starterGhostControlParamsMapping: mapping,
                    sectionOrder: sectionOrderFromDatabase,
                });
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

    const classes = createClasses();

    const [
        ticketUpdateRequest,
        setTicketUpdateRequest,
    ] = useState<null | ITicketUpdateRequest>(null);

    const [refreshToken, setRefreshToken] = useState({});
    useEffect(() => {
        if (!ticketUpdateRequest) return;

        let didCancel = false;

        Api.tickets
            .updateTicketInformation(
                ticket?.itemId || "",
                ticket?.belongsTo || "",
                ticketUpdateRequest
            )
            .then((updatedTicket) => {
                if (didCancel) return;
                setTicket((previousTicket) => {
                    return {
                        ...(previousTicket as ITicket),
                        ...ticketUpdateRequest,
                    };
                });

                const updatedStarterGhostControlParamsMapping: IStarterGhostControlParamsMapping = {};
                Object.keys(ghostControlParamsMapping).forEach((key) => {
                    const ghostControlParamsValue =
                        ghostControlParamsMapping[key];
                    updatedStarterGhostControlParamsMapping[key] = {
                        uniqueId: key,
                        value: ghostControlParamsValue.value,
                    };
                });
                setStarterGhostControlParamsMappingAndSectionOrder(
                    (previous) => {
                        return {
                            ...previous,
                            starterGhostControlParamsMapping: updatedStarterGhostControlParamsMapping,
                        };
                    }
                );
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

    function onClickUpdate() {
        const title = ghostControlParamsMapping[titleSectionUniqueId].value;
        const summary = ghostControlParamsMapping[summarySectionUniqueId].value;
        const sections = sectionOrder.map((sectionId) => {
            const sectionValue = ghostControlParamsMapping[sectionId].value;
            return sectionValue;
        });

        setTicketUpdateRequest({
            title,
            summary,
            tags: tagsState.simplifiedTags,
            sections,
        });
    }

    const titleControl = starterGhostControlParamsMapping[titleSectionUniqueId];
    const summaryControl =
        starterGhostControlParamsMapping[summarySectionUniqueId];

    const wrappedButtonProps: IWrappedButtonProps = {
        color: "primary",
        variant: "contained",
        disabled: someControlsAreInvalid || !!ticketUpdateRequest,
        showSpinner: !!ticketUpdateRequest,
        onClick: onClickUpdate,
        children: "Update Ticket",
    };

    return (
        <TicketPageWrapper>
            {isLoadingTicketInformation ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <OverflowContentAndActionBar
                    wrappedButtonProps={wrappedButtonProps}
                >
                    <div css={classes.container}>
                        <div css={classes.ticketContentContainer}>
                            <div css={classes.nonTagTicketInformationContainer}>
                                <div css={classes.ticketSectionsContainer}>
                                    <TitleSection
                                        title={titleControl.value}
                                        label={
                                            ticket?.simplifiedTicketTemplate
                                                .title.label || ""
                                        }
                                        onStateChange={onStateChange}
                                        refreshToken={refreshToken}
                                    />
                                    <SummarySection
                                        summary={summaryControl.value}
                                        label={
                                            ticket?.simplifiedTicketTemplate
                                                .summary.label || ""
                                        }
                                        onStateChange={onStateChange}
                                        refreshToken={refreshToken}
                                    />
                                    {sectionOrder.map((sectionId, index) => {
                                        const section =
                                            starterGhostControlParamsMapping[
                                                sectionId
                                            ];
                                        const ticketTemplateSection = ticket
                                            ?.simplifiedTicketTemplate.sections[
                                            index
                                        ]!;

                                        if (!ticketTemplateSection) return null;
                                        return (
                                            <TextSection
                                                uniqueId={sectionId}
                                                label={
                                                    ticketTemplateSection.label
                                                }
                                                multiline={
                                                    ticketTemplateSection.multiline
                                                }
                                                onStateChange={onStateChange}
                                                refreshToken={refreshToken}
                                                value={section.value}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                            <TicketTags
                                tags={ticket?.tags || []}
                                allTagsForBoard={allTagsForBoard}
                                onTagsChange={onTagsChange}
                            />
                        </div>
                    </div>
                </OverflowContentAndActionBar>
            )}
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
        display: grid;
        padding: 32px;
        grid-gap: 32px;
        grid-template-columns: 1fr 1fr 1fr;
    `;

    const ticketActionBarContainer = css`
        flex: 0 0 auto;
    `;

    const ticketActionBarInnerContainer = css`
        display: flex;
        padding: 8px 16px;
        justify-content: flex-end;
    `;

    const nonTagTicketInformationContainer = css`
        height: 100%;
    `;

    const ticketSectionsContainer = css`
        display: flex;
        flex-direction: column;
        margin-top: 16px;
    `;

    return {
        container,
        ticketContentContainer,
        ticketActionBarContainer,
        ticketActionBarInnerContainer,
        nonTagTicketInformationContainer,
        ticketSectionsContainer,
    };
};
