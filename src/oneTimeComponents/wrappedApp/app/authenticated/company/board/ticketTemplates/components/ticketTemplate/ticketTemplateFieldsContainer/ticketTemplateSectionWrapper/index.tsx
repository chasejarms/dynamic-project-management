import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../../../redux/storeState";
import {
    ITicketTemplateNumberSectionControlState,
    ITicketTemplateTextSectionControlState,
} from "../../../../../../../../../../../redux/ticketTemplates";
import { TicketTemplateNumberField } from "./ticketTemplateNumberField";
import { TicketTemplateTextField } from "./ticketTemplateTextField";

export interface ITicketTemplateSectionWrapperProps {
    disabled: boolean;
    index: number;
    ticketTemplateId: string;
}

export function TicketTemplateSectionWrapper(
    props: ITicketTemplateSectionWrapperProps
) {
    const section = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .sections[props.index];
    });

    if (section.value.type === "text") {
        return (
            <TicketTemplateTextField
                section={section as ITicketTemplateTextSectionControlState}
                index={props.index}
                disabled={props.disabled}
                ticketTemplateId={props.ticketTemplateId}
            />
        );
    } else if (section.value.type === "number") {
        return (
            <TicketTemplateNumberField
                section={section as ITicketTemplateNumberSectionControlState}
                index={props.index}
                disabled={props.disabled}
                ticketTemplateId={props.ticketTemplateId}
            />
        );
    } else {
        return null;
    }
}
