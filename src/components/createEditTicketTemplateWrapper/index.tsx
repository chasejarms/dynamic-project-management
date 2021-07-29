/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { IStarterGhostControlParamsMapping } from "../../models/ghostControlPattern/starterGhostControlParamsMapping";
import { ITextSection } from "../../models/ticketTemplate/textSection";
import { ITicketTemplatePutRequest } from "../../models/ticketTemplate/ticketTemplatePutRequest";
import { BoardContainer } from "../boardContainer";
import { BottomPageToolbar } from "../bottomPageToolbar";
import { CenterLoadingSpinner } from "../centerLoadingSpinner";
import { TicketTemplateDescriptionControl } from "../ticketTemplateDescriptionControl";
import {
    TicketTemplateNameControl,
    ticketTemplateNameUniqueId,
} from "../ticketTemplateNameControl";
import {
    TicketTemplateSummaryControl,
    ticketTemplateSummaryControlId,
} from "../ticketTemplateSummaryControl";
import { TicketTemplateTextControl } from "../ticketTemplateTextControl";
import { TicketTemplateTitleControl } from "../ticketTemplateTitleControl";
import { IWrappedButtonProps } from "../wrappedButton";

export interface ICreateEditTicketTemplateWrapperProps {
    starterGhostControlParamsMapping: IStarterGhostControlParamsMapping;
    orderedSectionIds: string[];
    wrappedButtonProps: IWrappedButtonProps[];
    isLoading: boolean;
    disabled: boolean;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
    onClickAddAfter: (index: number) => void;
}

export function CreateEditTicketTemplateWrapper(
    props: ICreateEditTicketTemplateWrapperProps
) {
    const classes = createClasses();
    const {
        starterGhostControlParamsMapping,
        disabled,
        wrappedButtonProps,
        onStateChange,
    } = props;

    const nameControl =
        starterGhostControlParamsMapping[ticketTemplateNameUniqueId];
    const summaryControl =
        starterGhostControlParamsMapping[ticketTemplateSummaryControlId];

    return (
        <BoardContainer>
            {props.isLoading ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.container}>
                    <div css={classes.innerContentContainer}>
                        <div css={classes.columnInputContainer}>
                            <TicketTemplateNameControl
                                templateName={nameControl.value as string}
                                onStateChange={onStateChange}
                                disabled={disabled}
                                refreshToken={props.refreshToken}
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
                                disabled={disabled}
                                refreshToken={props.refreshToken}
                                onClickAddAfter={props.onClickAddAfter}
                            />
                        </div>
                        {props.orderedSectionIds.map((sectionId) => {
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
                                        disabled={disabled}
                                        refreshToken={props.refreshToken}
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
