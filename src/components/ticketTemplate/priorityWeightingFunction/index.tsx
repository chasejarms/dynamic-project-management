/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../../redux/storeState";
import {
    updatePriorityWeightingCalculation,
    ITicketTemplateNumberSectionControlState,
} from "../../../redux/ticketTemplates";
import { TagChip } from "../../tagChip";
import { WrappedTextField } from "../../wrappedTextField";

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

    function onChange(
        event: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>
    ) {
        const updatedPriorityFunction = event.target.value as string;
        const action = updatePriorityWeightingCalculation({
            priorityWeightingCalculation: updatedPriorityFunction,
            ticketTemplateId: props.ticketTemplateId,
        });
        dispatch(action);
    }

    const classes = createClasses();
    return (
        <div>
            <div css={classes.validAliasContainer}>
                {validAliasList.map((aliasName) => {
                    return (
                        <div css={classes.individualChipContainer}>
                            <TagChip
                                size="small"
                                tagName={aliasName}
                                tagColor={"gray"}
                            />
                        </div>
                    );
                })}
            </div>
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

const createClasses = () => {
    const validAliasContainer = css`
        padding-bottom: 8px;
    `;

    const individualChipContainer = css`
        margin-right: 4px;
        margin-bottom: 4px;
        display: inline-flex;
    `;

    return {
        validAliasContainer,
        individualChipContainer,
    };
};
