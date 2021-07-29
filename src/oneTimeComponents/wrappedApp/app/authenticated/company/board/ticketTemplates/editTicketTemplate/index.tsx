/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { CreateEditTicketTemplateWrapper } from "../../../../../../../../components/createEditTicketTemplateWrapper";
import { ticketTemplateDescriptionUniqueId } from "../../../../../../../../components/ticketTemplateDescriptionControl";
import { ticketTemplateSummaryControlId } from "../../../../../../../../components/ticketTemplateSummaryControl";
import { ticketTemplateTitleControlId } from "../../../../../../../../components/ticketTemplateTitleControl";
import { IWrappedButtonProps } from "../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { ITicketTemplate } from "../../../../../../../../models/ticketTemplate";
import { ITicketTemplatePutRequest } from "../../../../../../../../models/ticketTemplate/ticketTemplatePutRequest";

export function EditTicketTemplate() {
    const { boardId, companyId, ticketTemplateId } = useAppRouterParams();
    const [
        { ticketTemplate, refreshToken },
        setTicketTemplateAndRefreshToken,
    ] = useState<{
        ticketTemplate: ITicketTemplate | null;
        refreshToken: {};
    }>({
        ticketTemplate: null,
        refreshToken: {},
    });

    const [controlInformation, setControlInformation] = useState<{
        [id: string]: {
            value: any;
            errorMessage: string;
            isDirty: boolean;
        };
    }>({});

    function onStateChange(
        uniqueId: string,
        value: any,
        errorMessage: string,
        isDirty: boolean
    ) {
        setControlInformation((previousControlInformation) => {
            const clonedControlInformation = cloneDeep(
                previousControlInformation
            );
            clonedControlInformation[uniqueId] = {
                value,
                errorMessage,
                isDirty,
            };

            return clonedControlInformation;
        });
    }
    const someControlsAreInvalid = Object.values(controlInformation).some(
        ({ errorMessage }) => !!errorMessage
    );

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
                setTicketTemplateAndRefreshToken({
                    ticketTemplate: ticketTemplateFromDatabase,
                    refreshToken: {},
                });
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
    useEffect(() => {
        if (!isUpdatingTicketTemplate) return;

        const ticketTemplateRequest: ITicketTemplatePutRequest = {
            name: controlInformation["ticketTemplateNameUniqueId"].value,
            description:
                controlInformation[ticketTemplateDescriptionUniqueId].value,
            title: {
                label: controlInformation[ticketTemplateTitleControlId].value,
            },
            summary: {
                label: controlInformation[ticketTemplateSummaryControlId].value,
                isRequired: true,
            },
            sections: [],
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
                setTicketTemplateAndRefreshToken(
                    (previousTicketTemplateAndRefreshToken) => {
                        return {
                            ticketTemplate: {
                                ...previousTicketTemplateAndRefreshToken.ticketTemplate!,
                                ...ticketTemplateRequest,
                            },
                            refreshToken: {},
                        };
                    }
                );
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

    return (
        <div />
        // <CreateEditTicketTemplateWrapper
        //     onClickAddAfter={() => null}
        //     ticketTemplate={ticketTemplate}
        //     wrappedButtonProps={wrappedButtonProps}
        //     isLoading={isLoadingTicketTemplate}
        //     disabled={isUpdatingTicketTemplate}
        //     onStateChange={onStateChange}
        //     refreshToken={refreshToken}
        // />
    );
}
