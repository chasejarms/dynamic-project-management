/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useSelector } from "react-redux";
import { IStoreState } from "../../redux/storeState";
import { BottomPageToolbar } from "../bottomPageToolbar";
import { TicketPriorityScore } from "../ticketPriorityScore";
import { IWrappedButtonProps } from "../wrappedButton";

export interface ITicketBottomToolbarProps {
    onClickActionButton: () => void;
    actionButtonText: string;
    showActionButtonSpinner: boolean;
    ticketId: string;
    ticketTemplateId?: string;
}

export function TicketBottomToolbar(props: ITicketBottomToolbarProps) {
    const allControlsAreValid = useSelector((store: IStoreState) => {
        const ticket = store.ticket[props.ticketId].ticket;

        const titleIsValid = !ticket.title.error;
        const summaryIsValid = !ticket.summary.error;
        const sectionsAreValid = ticket.sections.every((section) => {
            return !section.error;
        });

        return titleIsValid && summaryIsValid && sectionsAreValid;
    });

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: () => {
                props.onClickActionButton();
            },
            color: "primary",
            disabled: props.showActionButtonSpinner || !allControlsAreValid,
            showSpinner: props.showActionButtonSpinner,
            children: props.actionButtonText,
        },
    ];

    const classes = createClasses();
    return (
        <BottomPageToolbar
            wrappedButtonProps={wrappedButtonProps}
            leftContent={
                !!props.ticketTemplateId ? (
                    <div css={classes.ticketPriorityContainer}>
                        <TicketPriorityScore
                            ticketId={props.ticketId}
                            ticketTemplateId={props.ticketTemplateId}
                        />
                    </div>
                ) : null
            }
        />
    );
}

const createClasses = () => {
    const ticketPriorityContainer = css`
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    return {
        ticketPriorityContainer,
    };
};
