/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../../../../redux/storeState";
import { updateWeightedTicketTemplateCreationTitle } from "../../../../../../../../../../../../redux/ticketTemplates";
import { WrappedTextField } from "../../../../../../../../../../../components/wrappedTextField";

export interface ITicketTemplateTitleFieldProps {
    disabled: boolean;
    ticketTemplateId: string;
}

export function TicketTemplateTitleField(
    props: ITicketTemplateTitleFieldProps
) {
    const value = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .title.value;
    });

    const touched = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .title.touched;
    });

    const error = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .title.error;
    });

    const dispatch = useDispatch();
    function onChangeTicketTemplateTitle(
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const value = eventType.target.value as string;
        const action = updateWeightedTicketTemplateCreationTitle({
            title: value,
            ticketTemplateId: props.ticketTemplateId,
        });
        dispatch(action);
    }

    return (
        <>
            <div>
                <WrappedTextField
                    value={value}
                    label="Template Title"
                    onChange={onChangeTicketTemplateTitle}
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
