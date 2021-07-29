/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { Section } from "../../models/ticketTemplate/section";
import { ITicketTemplatePutRequest } from "../../models/ticketTemplate/ticketTemplatePutRequest";
import { BoardContainer } from "../boardContainer";
import { BottomPageToolbar } from "../bottomPageToolbar";
import { CenterLoadingSpinner } from "../centerLoadingSpinner";
import { TicketTemplateDescriptionControl } from "../ticketTemplateDescriptionControl";
import { TicketTemplateSummaryControl } from "../ticketTemplateSummaryControl";
import { TicketTemplateTextControl } from "../ticketTemplateTextControl";
import { TicketTemplateTitleControl } from "../ticketTemplateTitleControl";
import { IWrappedButtonProps } from "../wrappedButton";

export interface ICreateEditTicketTemplateWrapperProps {
    committedTicketTemplate: ITicketTemplatePutRequest | null;
    stagedTicketTemplate: ITicketTemplatePutRequest | null;
    wrappedButtonProps: IWrappedButtonProps[];
    isLoading: boolean;
    disabled: boolean;
    onStateChange: (
        uniqueId: string,
        value: string,
        isDirty: boolean,
        errorMessage: string
    ) => void;
    onClickAddAfter: (index: number) => void;
}

export function CreateEditTicketTemplateWrapper(
    props: ICreateEditTicketTemplateWrapperProps
) {
    const classes = createClasses();
    const {
        committedTicketTemplate,
        stagedTicketTemplate,
        disabled,
        wrappedButtonProps,
        onStateChange,
    } = props;

    return (
        <BoardContainer>
            {props.isLoading ||
            !committedTicketTemplate ||
            !stagedTicketTemplate ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.container}>
                    <div css={classes.innerContentContainer}>
                        <div css={classes.columnInputContainer}>
                            {/* <TicketTemplateNameControl
                                committedValue={committedTicketTemplate.name}
                                stagedValue={stagedTicketTemplate.name}
                            /> */}
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
                        </div>
                        <div css={classes.columnInputContainer}>
                            <TicketTemplateSummaryControl
                                summary={ticketTemplate.summary.label}
                                onStateChange={onStateChange}
                                disabled={disabled}
                                refreshToken={props.refreshToken}
                                onClickAddAfter={props.onClickAddAfter}
                            />
                        </div>
                        {ticketTemplate.sections.map((section, index) => {
                            return (
                                <div css={classes.columnInputContainer}>
                                    <TicketTemplateTextControl
                                        value={section}
                                        disabled={disabled}
                                        index={index}
                                        onStateChange={onStateChange}
                                        refreshToken={props.refreshToken}
                                    />
                                </div>
                            );
                        })} */}
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
