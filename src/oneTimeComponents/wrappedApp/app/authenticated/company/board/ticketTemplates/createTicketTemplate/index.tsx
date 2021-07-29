/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { BoardContainer } from "../../../../../../../../components/boardContainer";
import { BottomPageToolbar } from "../../../../../../../../components/bottomPageToolbar";
import { CenterLoadingSpinner } from "../../../../../../../../components/centerLoadingSpinner";
import { CreateEditTicketTemplateWrapper } from "../../../../../../../../components/createEditTicketTemplateWrapper";
import { ticketTemplateDescriptionUniqueId } from "../../../../../../../../components/ticketTemplateDescriptionControl";
import {
    TicketTemplateNameControl,
    ticketTemplateNameUniqueId,
} from "../../../../../../../../components/ticketTemplateNameControl";
import {
    TicketTemplateSummaryControl,
    ticketTemplateSummaryControlId,
} from "../../../../../../../../components/ticketTemplateSummaryControl";
import { TicketTemplateTextControl } from "../../../../../../../../components/ticketTemplateTextControl";
import { ticketTemplateTitleControlId } from "../../../../../../../../components/ticketTemplateTitleControl";
import { IWrappedButtonProps } from "../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { IGhostControlParams } from "../../../../../../../../models/ghostControlPattern/ghostControlParams";
import { IGhostControlParamsMapping } from "../../../../../../../../models/ghostControlPattern/ghostControlParamsMapping";
import { IStarterGhostControlParams } from "../../../../../../../../models/ghostControlPattern/starterGhostControlParams";
import { IStarterGhostControlParamsMapping } from "../../../../../../../../models/ghostControlPattern/starterGhostControlParamsMapping";
import { ITextSection } from "../../../../../../../../models/ticketTemplate/textSection";
import { ITicketTemplatePutRequest } from "../../../../../../../../models/ticketTemplate/ticketTemplatePutRequest";
import { generateUniqueId } from "../../../../../../../../utils/generateUniqueId";

const defaultStarterGhostControlParamsMapping: IStarterGhostControlParamsMapping = {
    [ticketTemplateNameUniqueId]: {
        uniqueId: ticketTemplateNameUniqueId,
        value: "",
    },
    [ticketTemplateSummaryControlId]: {
        uniqueId: ticketTemplateSummaryControlId,
        value: "",
    },
};

export function CreateTicketTemplate() {
    const { boardId, companyId } = useAppRouterParams();

    const [
        starterGhostControlParamsMapping,
        setStarterGhostControlParamsMapping,
    ] = useState<IStarterGhostControlParamsMapping>(
        cloneDeep(defaultStarterGhostControlParamsMapping)
    );

    const [ghostControlParamsMapping, setGhostControlParamsMapping] = useState<
        IGhostControlParamsMapping
    >({});

    function onStateChange(ghostControlParams: IGhostControlParams) {
        setGhostControlParamsMapping((previousGhostControlParams) => {
            const updatedGhostControlParams = {
                ...previousGhostControlParams,
                [ghostControlParams.uniqueId]: ghostControlParams,
            };

            return updatedGhostControlParams;
        });
    }
    const someControlsAreInvalid = Object.values(
        ghostControlParamsMapping
    ).some(({ error }) => !!error);

    const [refreshToken, setRefreshToken] = useState({});
    const [isCreatingTicketTemplate, setIsCreatingTicketTemplate] = useState(
        false
    );

    const [sectionOrder, setSectionOrder] = useState<string[]>([]);
    function onClickAddAfter(index: number) {
        const uniqueId = generateUniqueId(3);

        const textSection: ITextSection = {
            type: "text",
            label: "",
            multiline: true,
        };

        setStarterGhostControlParamsMapping(
            (previousStarterGhostControlParamsMapping) => {
                return {
                    ...previousStarterGhostControlParamsMapping,
                    [uniqueId]: {
                        uniqueId,
                        value: textSection,
                    },
                };
            }
        );

        if (index === -1) {
            setSectionOrder((previousSectionOrder) => {
                return [uniqueId, ...previousSectionOrder];
            });
        } else {
            setSectionOrder((previousSectionOrder) => {
                const beforeSections = previousSectionOrder.slice(0, index);
                const afterSections = previousSectionOrder.slice(index);

                return [...beforeSections, uniqueId, ...afterSections];
            });
        }
    }

    useEffect(() => {
        if (!isCreatingTicketTemplate) return;

        let didCancel = false;

        // const ticketTemplateRequest: ITicketTemplatePutRequest = {
        //     name: controlInformation[ticketTemplateNameUniqueId].value,
        //     description:
        //         controlInformation[ticketTemplateDescriptionUniqueId].value,
        //     title: {
        //         label: controlInformation[ticketTemplateTitleControlId].value,
        //     },
        //     summary: {
        //         label: controlInformation[ticketTemplateSummaryControlId].value,
        //         isRequired: true,
        //     },
        //     sections: [],
        // };

        // Api.ticketTemplates
        //     .createTicketTemplateForBoard(
        //         companyId,
        //         boardId,
        //         ticketTemplateRequest
        //     )
        //     .then((ticketTemplate) => {
        //         if (didCancel) return;
        //         setRefreshToken({});
        //     })
        //     .catch((error) => {
        //         if (didCancel) return;
        //     })
        //     .finally(() => {
        //         if (didCancel) return;
        //         setIsCreatingTicketTemplate(false);
        //     });

        // return () => {
        //     didCancel = true;
        // };
    }, [isCreatingTicketTemplate, companyId, boardId]);

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: () => {
                setIsCreatingTicketTemplate(true);
            },
            color: "primary",
            disabled: isCreatingTicketTemplate || someControlsAreInvalid,
            showSpinner: isCreatingTicketTemplate,
            children: "Create Ticket Template",
        },
    ];

    const classes = createClasses();

    const nameControl =
        starterGhostControlParamsMapping[ticketTemplateNameUniqueId];
    const summaryControl =
        starterGhostControlParamsMapping[ticketTemplateSummaryControlId];

    return (
        <BoardContainer>
            <div css={classes.container}>
                <div css={classes.innerContentContainer}>
                    <div css={classes.columnInputContainer}>
                        <TicketTemplateNameControl
                            templateName={nameControl.value as string}
                            onStateChange={onStateChange}
                            disabled={isCreatingTicketTemplate}
                            refreshToken={refreshToken}
                        />
                    </div>
                    {/* <div css={classes.columnInputContainer}>
                            <TicketTemplateDescriptionControl
                                templateDescription={ticketTemplate.description}
                                onStateChange={onStateChange}
                                disabled={disabled}
                                refreshToken={props.refreshToken}
                            />
                        </div>
                        <div css={classes.columnInputContainer}>
                            <TicketTemplateTitleControl
                                title={ticketTemplate.title.label}
                                onStateChange={onStateChange}
                                disabled={disabled}
                                refreshToken={props.refreshToken}
                            />
                        </div> */}
                    <div css={classes.columnInputContainer}>
                        <TicketTemplateSummaryControl
                            summary={summaryControl.value as string}
                            onStateChange={onStateChange}
                            disabled={isCreatingTicketTemplate}
                            refreshToken={refreshToken}
                            onClickAddAfter={onClickAddAfter}
                        />
                    </div>
                    {sectionOrder.map((sectionId) => {
                        const textSection = starterGhostControlParamsMapping[
                            sectionId
                        ].value as ITextSection;

                        return (
                            <div
                                css={classes.columnInputContainer}
                                key={sectionId}
                            >
                                <TicketTemplateTextControl
                                    uniqueId={sectionId}
                                    label={textSection.label}
                                    onStateChange={onStateChange}
                                    disabled={isCreatingTicketTemplate}
                                    refreshToken={refreshToken}
                                />
                            </div>
                        );
                    })}
                    ;
                </div>
                <div css={classes.bottomToolbarContainer}>
                    <BottomPageToolbar
                        wrappedButtonProps={wrappedButtonProps}
                    />
                </div>
            </div>
        </BoardContainer>
    );
}

const createClasses = () => {
    const container = css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    `;

    const innerContentContainer = css`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    `;

    const bottomToolbarContainer = css`
        flex: 0 0 auto;
    `;

    const columnInputContainer = css`
        width: 300px;
    `;

    return {
        container,
        bottomToolbarContainer,
        innerContentContainer,
        columnInputContainer,
    };
};
