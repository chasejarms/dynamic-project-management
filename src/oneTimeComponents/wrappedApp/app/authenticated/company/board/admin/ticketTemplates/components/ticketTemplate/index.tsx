/** @jsxImportSource @emotion/react */
import { jsx, css, Theme, useTheme } from "@emotion/react";
import { makeStyles, Paper } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ticketPreviewId } from "../../../../../../../../../../redux/ticket";
import { resetWeightedTicketTemplateCreationState } from "../../../../../../../../../../redux/ticketTemplates";
import { PriorityWeightingFunction } from "./priorityWeightingFunction";
import { TicketFields } from "../../../../components/ticketFields";
import { TicketSummaryHeader } from "./ticketSummaryHeader";
import { TicketTemplateBottomToolbar } from "./ticketTemplateBottomToolbar";
import { TicketTemplateFieldsContainer } from "./ticketTemplateFieldsContainer";

const useStyles = makeStyles({
    previewPaper: {
        height: "100%",
    },
});

export interface ITicketTemplateProps {
    ticketTemplateId: string;
    fieldsAreDisabled: boolean;
    onClickActionButton: () => void;
    actionButtonText: string;
    actionInProgress: boolean;
}

export function TicketTemplate(props: ITicketTemplateProps) {
    const theme = useTheme();
    const classes = createClasses(theme);
    const materialClasses = useStyles();

    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            const action = resetWeightedTicketTemplateCreationState();
            dispatch(action);
        };
    }, []);

    return (
        <div css={classes.container}>
            <div css={classes.flexContentContainer}>
                <div css={classes.gridContentContainer}>
                    <TicketTemplateFieldsContainer
                        disabled={
                            props.actionInProgress || props.fieldsAreDisabled
                        }
                        ticketTemplateId={props.ticketTemplateId}
                    />
                    <div css={classes.priorityWeightAndPreviewContainer}>
                        <PriorityWeightingFunction
                            ticketId={ticketPreviewId}
                            disabled={props.actionInProgress}
                            ticketTemplateId={props.ticketTemplateId}
                        />
                        <div>
                            <Paper className={materialClasses.previewPaper}>
                                <div css={classes.ticketPreviewContainer}>
                                    <TicketSummaryHeader
                                        ticketId={ticketPreviewId}
                                        ticketTemplateId={
                                            props.ticketTemplateId
                                        }
                                    />
                                    <TicketFields
                                        ticketId={ticketPreviewId}
                                        isTicketPreview={true}
                                        disabled={props.actionInProgress}
                                        ticketTemplateId={
                                            props.ticketTemplateId
                                        }
                                    />
                                </div>
                            </Paper>
                        </div>
                    </div>
                </div>
            </div>
            <div css={classes.bottomToolbarContainer}>
                <TicketTemplateBottomToolbar
                    onClickActionButton={props.onClickActionButton}
                    showActionButtonSpinner={props.actionInProgress}
                    actionButtonText={props.actionButtonText}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </div>
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const container = css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    `;

    const gridContentContainer = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        flex-grow: 1;
    `;

    const flexContentContainer = css`
        display: flex;
        flex-grow: 1;
        overflow-y: auto;
    `;

    const bottomToolbarContainer = css`
        flex: 0 0 auto;
    `;

    const priorityWeightAndPreviewContainer = css`
        flex-grow: 1;
        display: grid;
        grid-template-rows: auto 1fr;
        grid-gap: 16px;
        padding: 32px;
        padding-left: 16px;
    `;

    const individualChipContainer = css`
        margin-right: 4px;
        margin-bottom: 4px;
        display: inline-flex;
    `;

    const validAliasContainer = css`
        padding-bottom: 8px;
    `;

    const ticketPreviewContainer = css`
        display: grid;
        grid-template-rows: auto 1fr;
    `;

    return {
        ticketPreviewContainer,
        container,
        gridContentContainer,
        bottomToolbarContainer,
        flexContentContainer,
        priorityWeightAndPreviewContainer,
        individualChipContainer,
        validAliasContainer,
    };
};
