import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../../../redux/storeState";
import { updateWeightedTicketTemplateCreationDescription } from "../../../../../../../../../../../redux/ticketTemplates";
import { WrappedTextField } from "../../../../../../../../components/wrappedTextField";

export interface ITicketTemplateDescriptionFieldProps {
    disabled: boolean;
    ticketTemplateId: string;
}

export function TicketTemplateDescriptionField(
    props: ITicketTemplateDescriptionFieldProps
) {
    const value = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .description.value;
    });

    const touched = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .description.touched;
    });

    const error = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .description.error;
    });

    const dispatch = useDispatch();
    function onChangeTicketTemplateDescription(
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const value = eventType.target.value as string;
        const action = updateWeightedTicketTemplateCreationDescription({
            description: value,
            ticketTemplateId: props.ticketTemplateId,
        });
        dispatch(action);
    }

    return (
        <>
            <div>
                <WrappedTextField
                    value={value}
                    label="Template Description"
                    onChange={onChangeTicketTemplateDescription}
                    error={(touched && error) || ""}
                    disabled={props.disabled}
                    multiline
                    required
                />
            </div>
            <div />
        </>
    );
}
