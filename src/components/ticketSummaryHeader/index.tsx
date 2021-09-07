/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { IStoreState } from "../../redux/storeState";
import mathEvaluator from "math-expression-evaluator";
import { Theme, Typography, useTheme } from "@material-ui/core";

export interface ITicketSummaryHeaderProps {
    ticketId: string;
    ticketTemplateId: string;
}

export function TicketSummaryHeader(props: ITicketSummaryHeaderProps) {
    const {
        priorityWeightingCalculation: {
            value: priorityWeightingCalculationFunction,
            error: priorityWeightingCalculationError,
        },
        ticketAndTicketTemplate,
    } = useSelector((store: IStoreState) => {
        const priorityWeightingCalculation =
            store.weightedTicketTemplateCreation[props.ticketTemplateId]
                .priorityWeightingCalculation;
        return {
            priorityWeightingCalculation,
            ticketAndTicketTemplate: store.ticket[props.ticketId],
        };
    });
    const priorityScore = useMemo(() => {
        if (
            !!priorityWeightingCalculationError ||
            priorityWeightingCalculationFunction.trim() === ""
        ) {
            return "NA";
        }

        const requiredValuesByAliasMapping = ticketAndTicketTemplate.ticketTemplate.sections.reduce<{
            [aliasName: string]: {
                value: number | string;
                valid: boolean;
            };
        }>((mapping, section, index) => {
            if (section.type === "number") {
                if (!!section.alias) {
                    mapping[section.alias] = {
                        value:
                            ticketAndTicketTemplate.ticket.sections[index]
                                .value,
                        valid: !ticketAndTicketTemplate.ticket.sections[index]
                            .error,
                    };
                }
            }

            return mapping;
        }, {});

        const canDoCalculation = Object.values(
            requiredValuesByAliasMapping
        ).every(({ valid }) => {
            return valid;
        });

        if (!canDoCalculation) {
            return "NA";
        } else {
            let priorityWeightingCalculationFunctionValue = priorityWeightingCalculationFunction;
            Object.keys(requiredValuesByAliasMapping).forEach((alias) => {
                const value = requiredValuesByAliasMapping[alias].value;
                priorityWeightingCalculationFunctionValue = priorityWeightingCalculationFunctionValue.replaceAll(
                    alias,
                    value.toString()
                );
            });
            try {
                const priority = mathEvaluator.eval(
                    priorityWeightingCalculationFunctionValue
                );
                return priority;
            } catch {
                return "NA";
            }
        }
    }, [priorityWeightingCalculationFunction, ticketAndTicketTemplate]);

    const theme = useTheme();
    const classes = createClasses(theme);
    return (
        <div css={classes.ticketPreviewHeaderContainer}>
            <Typography variant="h6">Ticket Preview</Typography>
            <div css={classes.priorityScoreContainer}>
                <Typography>Priority Score: {priorityScore}</Typography>
            </div>
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const ticketPreviewHeaderContainer = css`
        display: flex;
        justify-content: space-between;
        background-color: ${theme.palette.grey["200"]};
        padding: 16px;
    `;

    const priorityScoreContainer = css`
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    return {
        ticketPreviewHeaderContainer,
        priorityScoreContainer,
    };
};
