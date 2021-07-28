/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { ITicketTemplatePutRequest } from "../../models/ticketTemplate/ticketTemplatePutRequest";
import { BoardContainer } from "../boardContainer";
import { BottomPageToolbar } from "../bottomPageToolbar";
import { CenterLoadingSpinner } from "../centerLoadingSpinner";
import { TicketTemplateDescriptionControl } from "../ticketTemplateDescriptionControl";
import { TicketTemplateNameControl } from "../ticketTemplateNameControl";
import { TicketTemplateSummaryControl } from "../ticketTemplateSummaryControl";
import { TicketTemplateTitleControl } from "../ticketTemplateTitleControl";
import { IWrappedButtonProps } from "../wrappedButton";

export interface ICreateEditTicketTemplateWrapperProps {
    ticketTemplate: ITicketTemplatePutRequest | null;
    wrappedButtonProps: IWrappedButtonProps[];
    isLoading: boolean;
    disabled: boolean;
    onStateChange: (
        uniqueId: string,
        value: string,
        error: string,
        isDirty: boolean
    ) => void;
}

export function CreateEditTicketTemplateWrapper(
    props: ICreateEditTicketTemplateWrapperProps
) {
    const classes = createClasses();
    const {
        ticketTemplate,
        disabled,
        wrappedButtonProps,
        onStateChange,
    } = props;

    return (
        <BoardContainer>
            {props.isLoading || !ticketTemplate ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.container}>
                    <div css={classes.innerContentContainer}>
                        <div css={classes.columnInputContainer}>
                            <TicketTemplateNameControl
                                templateName={ticketTemplate.name}
                                onStateChange={onStateChange}
                                disabled={disabled}
                            />
                        </div>
                        <div css={classes.columnInputContainer}>
                            <TicketTemplateDescriptionControl
                                templateDescription={ticketTemplate.description}
                                onStateChange={onStateChange}
                                disabled={disabled}
                            />
                        </div>
                        <div css={classes.columnInputContainer}>
                            <TicketTemplateTitleControl
                                title={ticketTemplate.title.label}
                                onStateChange={onStateChange}
                                disabled={disabled}
                            />
                        </div>
                        <div css={classes.columnInputContainer}>
                            <TicketTemplateSummaryControl
                                summary={ticketTemplate.summary.label}
                                onStateChange={onStateChange}
                                disabled={disabled}
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
