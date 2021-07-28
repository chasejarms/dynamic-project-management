/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { BoardContainer } from "../../../../../../../../components/boardContainer";
import { BottomPageToolbar } from "../../../../../../../../components/bottomPageToolbar";
import { CenterLoadingSpinner } from "../../../../../../../../components/centerLoadingSpinner";
import {
    TicketTemplateDescriptionControl,
    ticketTemplateDescriptionUniqueId,
} from "../../../../../../../../components/ticketTemplateDescriptionControl";
import {
    TicketTemplateNameControl,
    ticketTemplateNameUniqueId,
} from "../../../../../../../../components/ticketTemplateNameControl";
import { IWrappedButtonProps } from "../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { ITicketTemplate } from "../../../../../../../../models/ticketTemplate";
import { ITicketTemplatePutRequest } from "../../../../../../../../models/ticketTemplate/ticketTemplatePutRequest";

export function EditTicketTemplate() {
    const classes = createClasses();

    const { boardId, companyId, ticketTemplateId } = useAppRouterParams();
    const [
        ticketTemplate,
        setTicketTemplate,
    ] = useState<ITicketTemplate | null>(null);

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
                setTicketTemplate(ticketTemplateFromDatabase);
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
            name: controlInformation[ticketTemplateNameUniqueId].value,
            description:
                controlInformation[ticketTemplateDescriptionUniqueId].value,
            title: {
                label: "Title",
            },
            summary: {
                label: "Summary",
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
                setTicketTemplate((previousTicketTemplate) => {
                    return {
                        ...(previousTicketTemplate as ITicketTemplate),
                        ...ticketTemplateRequest,
                    };
                });
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
        <BoardContainer>
            {isLoadingTicketTemplate ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.container}>
                    <div css={classes.innerContentContainer}>
                        <div css={classes.columnInputContainer}>
                            <TicketTemplateNameControl
                                templateName={ticketTemplate!.name}
                                onStateChange={onStateChange}
                                disabled={isUpdatingTicketTemplate}
                            />
                        </div>
                        <div css={classes.columnInputContainer}>
                            <TicketTemplateDescriptionControl
                                templateDescription={
                                    ticketTemplate!.description
                                }
                                onStateChange={onStateChange}
                                disabled={isUpdatingTicketTemplate}
                            />
                        </div>
                    </div>
                    <div css={classes.bottomToolbarContainer}>
                        <BottomPageToolbar
                            wrappedButtonProps={wrappedButtonProps}
                        />
                    </div>
                </div>
            )}
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
