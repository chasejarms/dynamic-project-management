/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { CreateEditTicketTemplateWrapper } from "../../../../../../../../components/createEditTicketTemplateWrapper";
import { ticketTemplateDescriptionUniqueId } from "../../../../../../../../components/ticketTemplateDescriptionControl";
import { ticketTemplateNameUniqueId } from "../../../../../../../../components/ticketTemplateNameControl";
import { ticketTemplateSummaryControlId } from "../../../../../../../../components/ticketTemplateSummaryControl";
import { ticketTemplateTitleControlId } from "../../../../../../../../components/ticketTemplateTitleControl";
import { IWrappedButtonProps } from "../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { ITicketTemplatePutRequest } from "../../../../../../../../models/ticketTemplate/ticketTemplatePutRequest";

const defaultTicketTemplate: ITicketTemplatePutRequest = {
    name: "",
    description: "",
    title: {
        label: "Title",
    },
    summary: {
        isRequired: true,
        label: "Summary",
    },
    sections: [],
};

export function CreateTicketTemplate() {
    const { boardId, companyId } = useAppRouterParams();

    const [controlInformation, setControlInformation] = useState<{
        [id: string]: {
            value: any;
            errorMessage: string;
            isDirty: boolean;
        };
    }>({});

    function onStateChange(
        uniqueId: string,
        value: string,
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

    const [refreshToken, setRefreshToken] = useState({});
    const [isCreatingTicketTemplate, setIsCreatingTicketTemplate] = useState(
        false
    );
    useEffect(() => {
        if (!isCreatingTicketTemplate) return;

        let didCancel = false;

        const ticketTemplateRequest: ITicketTemplatePutRequest = {
            name: controlInformation[ticketTemplateNameUniqueId].value,
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

        Api.ticketTemplates
            .createTicketTemplateForBoard(
                companyId,
                boardId,
                ticketTemplateRequest
            )
            .then((ticketTemplate) => {
                if (didCancel) return;
                setRefreshToken({});
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
            ticketTemplate={defaultTicketTemplate}
            wrappedButtonProps={wrappedButtonProps}
            isLoading={false}
            disabled={isCreatingTicketTemplate}
            onStateChange={onStateChange}
            refreshToken={refreshToken}
        />
    );
}
