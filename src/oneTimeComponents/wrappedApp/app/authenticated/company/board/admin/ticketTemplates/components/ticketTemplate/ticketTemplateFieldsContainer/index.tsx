/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../../../redux/storeState";
import { composeCSS } from "../../../../../../../../../../../styles/composeCSS";
import { TicketTemplateNameField } from "./ticketTemplateNameField";
import { TicketTemplateDescriptionField } from "./ticketTemplateDescriptionField";
import { TicketTemplateTitleField } from "./ticketTemplateTitleField";
import { TicketTemplateSummaryField } from "./ticketTemplateSummaryField";
import { TicketTemplateSectionWrapper } from "./ticketTemplateSectionWrapper";

export interface ITicketTemplateFieldsContainerProps {
    disabled: boolean;
    ticketTemplateId: string;
}

export function TicketTemplateFieldsContainer(
    props: ITicketTemplateFieldsContainerProps
) {
    const sectionLength = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .sections.length;
    });

    const classes = createClasses();

    const sections = [];
    for (let i = 0; i < sectionLength; i++) {
        sections.push(
            <div
                css={composeCSS(
                    classes.columnInputContainer,
                    classes.sectionControlContainer
                )}
                key={i}
            >
                <TicketTemplateSectionWrapper
                    disabled={props.disabled}
                    index={i}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </div>
        );
    }

    return (
        <div css={classes.formBuilderContainer}>
            <div css={classes.columnInputContainer}>
                <TicketTemplateNameField
                    disabled={props.disabled}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </div>
            <div css={classes.columnInputContainer}>
                <TicketTemplateDescriptionField
                    disabled={props.disabled}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </div>
            <div css={classes.columnInputContainer}>
                <TicketTemplateTitleField
                    disabled={props.disabled}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </div>
            <div css={classes.columnInputContainer}>
                <TicketTemplateSummaryField
                    disabled={props.disabled}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </div>
            {sections}
        </div>
    );
}

const createClasses = () => {
    const formBuilderContainer = css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 32px;
        overflow-y: auto;
        padding-right: 16px;
    `;

    const columnInputContainer = css`
        display: grid;
        grid-template-columns: 1fr 96px;
        grid-gap: 16px;
    `;

    const sectionControlContainer = css`
        margin-top: 16px;
    `;

    return {
        formBuilderContainer,
        columnInputContainer,
        sectionControlContainer,
    };
};
