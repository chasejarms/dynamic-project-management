/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../redux/storeState";
import { updateWeightedTicketTemplateCreationName } from "../../redux/weightedTicketTemplateCreation";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketTemplateNameFieldProps {
    disabled: boolean;
}

export function TicketTemplateNameField(props: ITicketTemplateNameFieldProps) {
    const value = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation.name.value;
    });

    const touched = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation.name.touched;
    });

    const error = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation.name.error;
    });

    const dispatch = useDispatch();
    function onChangeTicketTemplateName(
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const value = eventType.target.value as string;
        const action = updateWeightedTicketTemplateCreationName(value);
        dispatch(action);
    }

    return (
        <>
            <div>
                <WrappedTextField
                    value={value}
                    label="Template Name"
                    required
                    onChange={onChangeTicketTemplateName}
                    error={(touched && error) || ""}
                    disabled={props.disabled}
                />
            </div>
            <div />
        </>
    );
}
