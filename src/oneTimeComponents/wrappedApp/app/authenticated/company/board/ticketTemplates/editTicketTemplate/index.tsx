/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { CreateEditTicketTemplateWrapper } from "../../../../../../../../components/createEditTicketTemplateWrapper";
import { ticketTemplateDescriptionUniqueId } from "../../../../../../../../components/ticketTemplateDescriptionControl";
import { ticketTemplateNameUniqueId } from "../../../../../../../../components/ticketTemplateNameControl";
import { ticketTemplateSummaryControlId } from "../../../../../../../../components/ticketTemplateSummaryControl";
import { ticketTemplateTitleControlId } from "../../../../../../../../components/ticketTemplateTitleControl";
import { IWrappedButtonProps } from "../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { IGhostControlParams } from "../../../../../../../../models/ghostControlPattern/ghostControlParams";
import { IGhostControlParamsMapping } from "../../../../../../../../models/ghostControlPattern/ghostControlParamsMapping";
import { IStarterGhostControlParamsMapping } from "../../../../../../../../models/ghostControlPattern/starterGhostControlParamsMapping";
import { ITicketTemplate } from "../../../../../../../../models/ticketTemplate";
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
    [ticketTemplateDescriptionUniqueId]: {
        uniqueId: ticketTemplateDescriptionUniqueId,
        value: "",
    },
    [ticketTemplateTitleControlId]: {
        uniqueId: ticketTemplateTitleControlId,
        value: "",
    },
};

export function EditTicketTemplate() {
    const { boardId, companyId, ticketTemplateId } = useAppRouterParams();
    const [
        starterGhostControlParamsMapping,
        setStarterGhostControlParamsMapping,
    ] = useState<IStarterGhostControlParamsMapping>(
        defaultStarterGhostControlParamsMapping
    );

    const [refreshToken, setRefreshToken] = useState({});
    const [ghostControlParamsMapping, setGhostControlParamsMapping] = useState<
        IGhostControlParamsMapping
    >({});

    console.log("ghost control mapping: ", ghostControlParamsMapping);

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

    function setStarterGhostControlParamsMappingFromTicketTemplate(
        ticketTemplate: ITicketTemplate
    ) {
        const mapping: IStarterGhostControlParamsMapping = {
            [ticketTemplateNameUniqueId]: {
                uniqueId: ticketTemplateNameUniqueId,
                value: ticketTemplate.name,
            },
            [ticketTemplateDescriptionUniqueId]: {
                uniqueId: ticketTemplateDescriptionUniqueId,
                value: ticketTemplate.description,
            },
            [ticketTemplateTitleControlId]: {
                uniqueId: ticketTemplateTitleControlId,
                value: ticketTemplate.title.label,
            },
            [ticketTemplateSummaryControlId]: {
                uniqueId: ticketTemplateSummaryControlId,
                value: ticketTemplate.summary.label,
            },
        };

        ticketTemplate.sections.forEach((section) => {
            const uniqueId = generateUniqueId(3);
            mapping[uniqueId] = {
                uniqueId,
                value: section,
            };
        });

        setStarterGhostControlParamsMapping(mapping);
    }

    const someControlsAreInvalid = Object.values(
        ghostControlParamsMapping
    ).some(({ error }) => !!error);

    const [isLoadingTicketTemplate, setIsLoadingTicketTemplate] = useState(
        true
    );
    useEffect(() => {
        let didCancel = false;

        if (!isLoadingTicketTemplate) return;

        Api.ticketTemplates
            .getTicketTemplateForBoard(companyId, boardId, ticketTemplateId)
            .then((ticketTemplateFromDatabase) => {
                if (didCancel) return;
                setStarterGhostControlParamsMappingFromTicketTemplate(
                    ticketTemplateFromDatabase
                );
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingTicketTemplate(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isLoadingTicketTemplate]);

    const [isUpdatingTicketTemplate, setIsUpdatingTicketTemplate] = useState(
        false
    );
    function triggerTicketTemplateUpdate() {
        setIsUpdatingTicketTemplate(true);
    }
    const [sectionOrder, setSectionOrder] = useState<string[]>([]);
    useEffect(() => {
        if (!isUpdatingTicketTemplate) return;

        const nameControl =
            ghostControlParamsMapping[ticketTemplateNameUniqueId];
        const descriptionControl =
            ghostControlParamsMapping[ticketTemplateDescriptionUniqueId];
        const titleControl =
            ghostControlParamsMapping[ticketTemplateTitleControlId];
        const summaryControl =
            ghostControlParamsMapping[ticketTemplateSummaryControlId];

        const ticketTemplateRequest: ITicketTemplatePutRequest = {
            name: nameControl.value,
            description: descriptionControl.value,
            title: {
                label: titleControl.value,
            },
            summary: {
                label: summaryControl.value,
                isRequired: true,
            },
            sections: sectionOrder.map((sectionId) => {
                const textSection = ghostControlParamsMapping[sectionId]
                    .value as ITextSection;
                return textSection;
            }),
        };

        let didCancel = false;

        Api.ticketTemplates
            .updateTicketTemplateForBoard(
                companyId,
                boardId,
                ticketTemplateId,
                ticketTemplateRequest
            )
            .then(() => {
                if (didCancel) return;
                // set the refresh token and the starter potentially
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsUpdatingTicketTemplate(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isUpdatingTicketTemplate]);

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: triggerTicketTemplateUpdate,
            color: "primary",
            disabled: someControlsAreInvalid || isUpdatingTicketTemplate,
            showSpinner: isUpdatingTicketTemplate,
            children: "Update Ticket Template",
        },
    ];

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
                const beforeSections = previousSectionOrder.slice(0, index + 1);
                const afterSections = previousSectionOrder.slice(index + 1);

                return [...beforeSections, uniqueId, ...afterSections];
            });
        }
    }

    function onClickDelete(index: number, uniqueId: string) {
        setSectionOrder((previousSectionOrder) => {
            return previousSectionOrder.filter((unused, compareIndex) => {
                return compareIndex !== index;
            });
        });

        setStarterGhostControlParamsMapping(
            (previousStarterGhostControlParamsMapping) => {
                delete previousStarterGhostControlParamsMapping[uniqueId];
                return previousStarterGhostControlParamsMapping;
            }
        );

        setGhostControlParamsMapping((previousGhostControlParamsMapping) => {
            delete previousGhostControlParamsMapping[uniqueId];
            return previousGhostControlParamsMapping;
        });
    }

    return (
        <CreateEditTicketTemplateWrapper
            sectionOrder={sectionOrder}
            onClickAddAfter={onClickAddAfter}
            starterGhostControlParamsMapping={starterGhostControlParamsMapping}
            wrappedButtonProps={wrappedButtonProps}
            isLoading={isLoadingTicketTemplate}
            disabled={isUpdatingTicketTemplate}
            onStateChange={onStateChange}
            refreshToken={refreshToken}
            onClickDelete={onClickDelete}
        />
    );
}
