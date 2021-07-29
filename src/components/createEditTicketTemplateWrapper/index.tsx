/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { IStarterGhostControlParamsMapping } from "../../models/ghostControlPattern/starterGhostControlParamsMapping";
import { ITextSection } from "../../models/ticketTemplate/textSection";
import { BoardContainer } from "../boardContainer";
import { BottomPageToolbar } from "../bottomPageToolbar";
import { CenterLoadingSpinner } from "../centerLoadingSpinner";
import {
    TicketTemplateDescriptionControl,
    ticketTemplateDescriptionUniqueId,
} from "../ticketTemplateDescriptionControl";
import {
    TicketTemplateNameControl,
    ticketTemplateNameUniqueId,
} from "../ticketTemplateNameControl";
import {
    TicketTemplateSummaryControl,
    ticketTemplateSummaryControlId,
} from "../ticketTemplateSummaryControl";
import { TicketTemplateTextControl } from "../ticketTemplateTextControl";
import {
    TicketTemplateTitleControl,
    ticketTemplateTitleControlId,
} from "../ticketTemplateTitleControl";
import { IWrappedButtonProps } from "../wrappedButton";

export interface ICreateEditTicketTemplateWrapperProps {
    isLoading: boolean;
    starterGhostControlParamsMapping: IStarterGhostControlParamsMapping;
    sectionOrder: string[];
    wrappedButtonProps: IWrappedButtonProps[];
    disabled: boolean;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
    onClickAddAfter: (index: number) => void;
}

export function CreateEditTicketTemplateWrapper(
    props: ICreateEditTicketTemplateWrapperProps
) {
    const {
        isLoading,
        starterGhostControlParamsMapping,
        disabled,
        onStateChange,
        refreshToken,
        sectionOrder,
        onClickAddAfter,
        wrappedButtonProps,
    } = props;

    const nameControl =
        starterGhostControlParamsMapping[ticketTemplateNameUniqueId];
    const descriptionControl =
        starterGhostControlParamsMapping[ticketTemplateDescriptionUniqueId];
    const titleControl =
        starterGhostControlParamsMapping[ticketTemplateTitleControlId];
    const summaryControl =
        starterGhostControlParamsMapping[ticketTemplateSummaryControlId];

    const classes = createClasses();
    return (
        <BoardContainer>
            {isLoading ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.container}>
                    <div css={classes.contentContainer}>
                        <div css={classes.helpCenterInnerContent} />
                        <div css={classes.innerContentContainer}>
                            <div css={classes.columnInputContainer}>
                                <TicketTemplateNameControl
                                    templateName={nameControl.value as string}
                                    onStateChange={onStateChange}
                                    disabled={disabled}
                                    refreshToken={refreshToken}
                                />
                            </div>
                            <div css={classes.columnInputContainer}>
                                <TicketTemplateDescriptionControl
                                    templateDescription={
                                        descriptionControl.value as string
                                    }
                                    onStateChange={onStateChange}
                                    disabled={disabled}
                                    refreshToken={refreshToken}
                                />
                            </div>
                            <div css={classes.columnInputContainer}>
                                <TicketTemplateTitleControl
                                    title={titleControl.value as string}
                                    onStateChange={onStateChange}
                                    disabled={disabled}
                                    refreshToken={refreshToken}
                                />
                            </div>
                            <div css={classes.columnInputContainer}>
                                <TicketTemplateSummaryControl
                                    summary={summaryControl.value as string}
                                    onStateChange={onStateChange}
                                    disabled={disabled}
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
                                            disabled={disabled}
                                            refreshToken={refreshToken}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div css={classes.helpCenterInnerContent} />
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

    const contentContainer = css`
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        padding-top: 32px;
        padding-bottom: 32px;
        overflow-y: auto;
    `;

    const bottomToolbarContainer = css`
        flex: 0 0 auto;
    `;

    const columnInputContainer = css`
        width: 300px;
    `;

    const innerContentContainer = css`
        display: flex;
        flex-direction: column;
        flex: 0 0 auto;
        padding-left: 64px;
        padding-right: 64px;
    `;

    const helpCenterInnerContent = css`
        flex-grow: 1;
    `;

    return {
        container,
        bottomToolbarContainer,
        contentContainer,
        innerContentContainer,
        columnInputContainer,
        helpCenterInnerContent,
    };
};
