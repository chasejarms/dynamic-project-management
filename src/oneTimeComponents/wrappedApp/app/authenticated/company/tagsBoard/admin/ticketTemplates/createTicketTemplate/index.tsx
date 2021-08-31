/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Api } from "../../../../../../../../../api";
import { CreateEditTicketTemplateWrapper } from "../../../../../../../../../components/createEditTicketTemplateWrapper";
import { ticketTemplateDescriptionUniqueId } from "../../../../../../../../../components/ticketTemplateDescriptionControl";
import { ticketTemplateNameUniqueId } from "../../../../../../../../../components/ticketTemplateNameControl";
import { ticketTemplateSummaryControlId } from "../../../../../../../../../components/ticketTemplateSummaryControl";
import { ticketTemplateTitleControlId } from "../../../../../../../../../components/ticketTemplateTitleControl";
import { IWrappedButtonProps } from "../../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../../hooks/useAppRouterParams";
import { IGhostControlParams } from "../../../../../../../../../models/ghostControlPattern/ghostControlParams";
import { IGhostControlParamsMapping } from "../../../../../../../../../models/ghostControlPattern/ghostControlParamsMapping";
import { IStarterGhostControlParamsMapping } from "../../../../../../../../../models/ghostControlPattern/starterGhostControlParamsMapping";
import { ITextSection } from "../../../../../../../../../models/ticketTemplate/textSection";
import { ITicketTemplatePutRequest } from "../../../../../../../../../models/ticketTemplate/ticketTemplatePutRequest";
import { generateUniqueId } from "../../../../../../../../../utils/generateUniqueId";

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

    useEffect(() => {
        if (!isCreatingTicketTemplate) return;

        let didCancel = false;

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

        Api.ticketTemplates
            .createTicketTemplateForBoard(
                companyId,
                boardId,
                ticketTemplateRequest
            )
            .then((ticketTemplate) => {
                if (didCancel) return;
                setRefreshToken({});
                setSectionOrder([]);
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsCreatingTicketTemplate(false);
            });

        return () => {
            didCancel = true;
        };
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

    return (
        <CreateEditTicketTemplateWrapper
            isLoading={false}
            starterGhostControlParamsMapping={starterGhostControlParamsMapping}
            sectionOrder={sectionOrder}
            wrappedButtonProps={wrappedButtonProps}
            disabled={isCreatingTicketTemplate}
            onStateChange={onStateChange}
            refreshToken={refreshToken}
            onClickAddAfter={onClickAddAfter}
            onClickDelete={onClickDelete}
        />
    );
}
