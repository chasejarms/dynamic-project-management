/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomPageToolbar } from "../../../../../../../../../components/bottomPageToolbar";
import { TagChip } from "../../../../../../../../../components/tagChip";
import { IWrappedButtonProps } from "../../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../../hooks/useAppRouterParams";
import { INumberSection } from "../../../../../../../../../models/ticketTemplate/section/numberSection";
import { ITextSection } from "../../../../../../../../../models/ticketTemplate/section/textSection";
import { IStoreState } from "../../../../../../../../../redux/storeState";
import {
    deleteWeightedTicketTemplateCreationSection,
    insertWeightedTicketCreationSection,
    WeightedNumberSectionWithControls,
    WeightedTextSectionWithControls,
} from "../../../../../../../../../redux/weightedTicketTemplateCreation";
import { BoardContainer } from "../../../../../../../../../components/boardContainer";
import { Paper, makeStyles, Theme, useTheme } from "@material-ui/core";
import { ITicketTemplate } from "../../../../../../../../../models/ticketTemplate";
import { Ticket } from "../../../../../../../../../components/ticket";
import {
    setInitialTicketData,
    ticketPreviewId,
} from "../../../../../../../../../redux/ticket";
import { PriorityWeightingFunction } from "../../../../../../../../../components/priorityWeightingFunction";
import { TicketSummaryHeader } from "../../../../../../../../../components/ticketSummaryHeader";
import { TicketTemplateFieldsContainer } from "../../../../../../../../../components/ticketTemplateFieldsContainer";

const useStyles = makeStyles({
    previewPaper: {
        height: "100%",
    },
});

export function CreateTicketTemplate() {
    const { boardId, companyId } = useAppRouterParams();

    const [isCreatingTicketTemplate, setIsCreatingTicketTemplate] = useState(
        false
    );
    const dispatch = useDispatch();
    const weightedTicketTemplate = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation;
    });
    const validAliasList = weightedTicketTemplate.sections
        .filter((section) => {
            return section.value.type === "number" && !!section.value.alias;
        })
        .map(
            (section) =>
                (section as WeightedNumberSectionWithControls).value.alias
        );

    const allControlsAreValid = useSelector((store: IStoreState) => {
        const {
            name,
            description,
            title,
            summary,
            sections,
        } = store.weightedTicketTemplateCreation;

        const nameIsValid = !name.error;
        const descriptionIsValid = !description.error;
        const titleIsValid = !title.error;
        const summaryIsValid = !summary.error;
        const sectionsAreValid = sections.every((section) => {
            if (section.value.type === "text") {
                const textSectionWithControls = section as WeightedTextSectionWithControls;
                return !textSectionWithControls.error;
            } else if (section.value.type === "number") {
                const numberSectionWithControls = section as WeightedNumberSectionWithControls;
                return (
                    !numberSectionWithControls.labelError &&
                    !numberSectionWithControls.minError &&
                    !numberSectionWithControls.maxError
                );
            }
        });

        return (
            nameIsValid &&
            descriptionIsValid &&
            titleIsValid &&
            summaryIsValid &&
            sectionsAreValid
        );
    });

    useEffect(() => {
        if (!isCreatingTicketTemplate) return;
    }, [isCreatingTicketTemplate, companyId, boardId]);

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: () => {
                setIsCreatingTicketTemplate(true);
            },
            color: "primary",
            disabled: isCreatingTicketTemplate || !allControlsAreValid,
            showSpinner: isCreatingTicketTemplate,
            children: "Create Ticket Template",
        },
    ];

    useEffect(() => {
        const ticketTemplate: ITicketTemplate = {
            itemId: "",
            belongsTo: "",
            shortenedItemId: "",
            name: weightedTicketTemplate.name.value,
            description: weightedTicketTemplate.description.value,
            title: {
                label: weightedTicketTemplate.title.value,
            },
            summary: {
                label: weightedTicketTemplate.summary.value,
            },
            sections: weightedTicketTemplate.sections.map((section) => {
                return section.value;
            }),
            priorityWeightingCalculation: "",
        };

        const action = setInitialTicketData({
            ticketTemplate,
            ticketId: ticketPreviewId,
            ticket: {
                title: {
                    value: "",
                    touched: false,
                    error: "",
                },
                summary: {
                    value: "",
                    touched: false,
                    error: "",
                },
                sections: weightedTicketTemplate.sections.map((section) => {
                    return {
                        value: "",
                        touched: false,
                        error: "",
                    };
                }),
            },
            priorityWeightingFunction: {
                value: "",
                error: "",
            },
        });
        dispatch(action);
    }, [weightedTicketTemplate]);

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
                            <div>
                                <div css={classes.validAliasContainer}>
                                    {validAliasList.map((aliasName) => {
                                        return (
                                            <div
                                                css={
                                                    classes.individualChipContainer
                                                }
                                            >
                                                <TagChip
                                                    size="small"
                                                    tagName={aliasName}
                                                    tagColor={"gray"}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <PriorityWeightingFunction
                                    ticketId={ticketPreviewId}
                                    disabled={isCreatingTicketTemplate}
                                />
                            </div>
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
                    <BottomPageToolbar
                        wrappedButtonProps={wrappedButtonProps}
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
