import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../../../redux/storeState";
import mathEvaluator from "math-expression-evaluator";

export interface ITicketPriorityScore {
    ticketTemplateId: string;
    ticketId: string;
}

export function TicketPriorityScore(props: ITicketPriorityScore) {
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
            ticketAndTicketTemplate:
                store.ticketControlMappedState[props.ticketId],
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
                return Math.round(Number(priority));
            } catch {
                return "NA";
            }
        }
    }, [priorityWeightingCalculationFunction, ticketAndTicketTemplate]);

    return (
        <Box
            sx={{
                position: "relative",
                bottom: "5px",
            }}
        >
            <Typography variant="body2">
                Priority Score: {priorityScore}
            </Typography>
        </Box>
    );
}
