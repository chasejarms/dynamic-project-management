/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Paper, makeStyles, Theme, useTheme } from "@material-ui/core";
import { ticketPreviewId } from "../../../../../../../../../redux/ticket";
import { PriorityWeightingFunction } from "../../../../../../../../../components/priorityWeightingFunction";
import { TicketSummaryHeader } from "../../../../../../../../../components/ticketSummaryHeader";
import { TicketTemplateFieldsContainer } from "../../../../../../../../../components/ticketTemplateFieldsContainer";
import { TicketTemplateBottomToolbar } from "../../../../../../../../../components/ticketTemplateBottomToolbar";
import { BoardContainer } from "../../../../../../../../../components/boardContainer";
import { Ticket } from "../../../../../../../../../components/ticket";
import { useSetTicketFromTicketTemplateChange } from "../../../../../../../../../hooks/useSetTicketFromTicketTemplateChange";
import { useCreateTicketTemplateCall } from "../../../../../../../../../hooks/useCreateTicketTemplateCall";

const useStyles = makeStyles({
    previewPaper: {
        height: "100%",
    },
});

export function CreateTicketTemplate() {
    const {
        isCreatingTicketTemplate,
        onClickCreateTicketTemplate,
    } = useCreateTicketTemplateCall();

    useSetTicketFromTicketTemplateChange();

    const theme = useTheme();
    const classes = createClasses(theme);
    const materialClasses = useStyles();

    return (
        <BoardContainer>
            <div css={classes.container}>
                <div css={classes.flexContentContainer}>
                    <div css={classes.gridContentContainer}>
                        <TicketTemplateFieldsContainer
                            disabled={isCreatingTicketTemplate}
                        />
                        <div css={classes.priorityWeightAndPreviewContainer}>
                            <PriorityWeightingFunction
                                ticketId={ticketPreviewId}
                                disabled={isCreatingTicketTemplate}
                            />
                            <div>
                                <Paper className={materialClasses.previewPaper}>
                                    <div css={classes.ticketPreviewContainer}>
                                        <TicketSummaryHeader
                                            ticketId={ticketPreviewId}
                                        />
                                        <Ticket ticketId={ticketPreviewId} />
                                    </div>
                                </Paper>
                            </div>
                        </div>
                    </div>
                </div>
                <div css={classes.bottomToolbarContainer}>
                    <TicketTemplateBottomToolbar
                        onClickCreateTicketTemplate={
                            onClickCreateTicketTemplate
                        }
                        isCreatingTicketTemplate={isCreatingTicketTemplate}
                    />
                </div>
            </div>
        </BoardContainer>
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
