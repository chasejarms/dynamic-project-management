import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../../redux/storeState";
import {
    updatePriorityWeightingCalculation,
    ITicketTemplateNumberSectionControlState,
} from "../../../../../../../../../../redux/ticketTemplates";
import { TagChip } from "../../../../components/tagChip";
import { WrappedTextField } from "../../../../../../../components/wrappedTextField";
import { ChangeEventHandler } from "react";
import { Box } from "@mui/material";

export interface IPriorityWeightingFunctionProps {
    ticketId: string;
    disabled: boolean;
    ticketTemplateId: string;
}

export function PriorityWeightingFunction(
    props: IPriorityWeightingFunctionProps
) {
    const weightedTicketTemplateCreation = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId];
    });

    const {
        sections,
        priorityWeightingCalculation,
    } = weightedTicketTemplateCreation;

    const validAliasList = sections
        .filter((section) => {
            return section.value.type === "number" && !!section.value.alias;
        })
        .map(
            (section) =>
                (section as ITicketTemplateNumberSectionControlState).value
                    .alias
        );

    const dispatch = useDispatch();

    const onChange: ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (event) => {
        const updatedPriorityFunction = event.target.value as string;
        const action = updatePriorityWeightingCalculation({
            priorityWeightingCalculation: updatedPriorityFunction,
            ticketTemplateId: props.ticketTemplateId,
        });
        dispatch(action);
    };

    return (
        <div>
            <Box
                sx={{
                    paddingBottom: validAliasList.length === 0 ? 0 : 1,
                }}
            >
                {validAliasList.map((aliasName) => {
                    return (
                        <Box
                            sx={{
                                marginRight: 0.5,
                                marginBottom: 0.5,
                                display: "inline-flex",
                            }}
                        >
                            <TagChip
                                size="small"
                                tagName={aliasName}
                                tagColor={"gray"}
                            />
                        </Box>
                    );
                })}
            </Box>
            <WrappedTextField
                value={priorityWeightingCalculation.value}
                label="Priority Weighting Calculation"
                onChange={onChange}
                error={priorityWeightingCalculation.error}
                disabled={props.disabled}
            />
        </div>
    );
}
