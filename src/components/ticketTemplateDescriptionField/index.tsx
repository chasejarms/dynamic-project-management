/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../redux/storeState";
import { updateWeightedTicketTemplateCreationDescription } from "../../redux/weightedTicketTemplateCreation";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketTemplateDescriptionFieldProps {
    disabled: boolean;
}

export function TicketTemplateDescriptionField(
    props: ITicketTemplateDescriptionFieldProps
) {
    const value = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation.description.value;
    });

    const touched = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation.description.touched;
    });

    const error = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation.description.error;
    });

    const dispatch = useDispatch();
    function onChangeTicketTemplateDescription(
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const value = eventType.target.value as string;
        const action = updateWeightedTicketTemplateCreationDescription(value);
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
