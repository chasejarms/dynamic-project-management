/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../redux/storeState";
import { updatePriorityWeightingCalculation } from "../../redux/weightedTicketTemplateCreation";
import { WrappedTextField } from "../wrappedTextField";

export interface IPriorityWeightingFunctionProps {
    ticketId: string;
    disabled: boolean;
}

export function PriorityWeightingFunction(
    props: IPriorityWeightingFunctionProps
) {
    const priorityWeightingCalculation = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation
            .priorityWeightingCalculation;
    });

    const dispatch = useDispatch();

    function onChange(
        event: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>
    ) {
        const updatedPriorityFunction = event.target.value as string;
        const action = updatePriorityWeightingCalculation(
            updatedPriorityFunction
        );
        dispatch(action);
    }

    return (
        <WrappedTextField
            value={priorityWeightingCalculation.value}
            label="Priority Weighting Calculation"
            onChange={onChange}
            error={priorityWeightingCalculation.error}
            disabled={props.disabled}
        />
    );
}
