/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useSelector } from "react-redux";
import { IStoreState } from "../../redux/storeState";
import {
    WeightedNumberSectionWithControls,
    WeightedTextSectionWithControls,
} from "../../redux/weightedTicketTemplateCreation";
import { TicketTemplateNumberField } from "../ticketTemplateNumberField";
import { TicketTemplateTextField } from "../ticketTemplateTextField";

export interface ITicketTemplateSectionWrapperProps {
    disabled: boolean;
    index: number;
}

export function TicketTemplateSectionWrapper(
    props: ITicketTemplateSectionWrapperProps
) {
    const section = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation.sections[props.index];
    });

    if (section.value.type === "text") {
        return (
            <TicketTemplateTextField
                section={section as WeightedTextSectionWithControls}
                index={props.index}
                disabled={props.disabled}
            />
        );
    } else if (section.value.type === "number") {
        return (
            <TicketTemplateNumberField
                section={section as WeightedNumberSectionWithControls}
                index={props.index}
                disabled={props.disabled}
            />
        );
    } else {
        return null;
    }
}
