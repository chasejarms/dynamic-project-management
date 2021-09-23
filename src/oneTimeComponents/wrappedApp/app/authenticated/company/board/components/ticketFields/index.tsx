import { useDispatch, useSelector } from "react-redux";
import { useSetTicketFromTicketTemplateChange } from "./hooks/useSetTicketFromTicketTemplateChange";
import { IStoreState } from "../../../../../../../../redux/storeState";
import {
    updateTicketTitle,
    updateTicketSummary,
    updateSectionValue,
} from "../../../../../../../../redux/ticketControlMappedState";
import { WrappedTextField } from "../../../../../components/wrappedTextField";
import { ChangeEventHandler } from "react";
import { Box } from "@mui/material";

export interface ITicketProps {
    ticketTemplateId: string;
    ticketId: string;
    isTicketPreview: boolean;
    disabled: boolean;
    removePadding?: boolean;
}

export function TicketFields(props: ITicketProps) {
    const dispatch = useDispatch();

    useSetTicketFromTicketTemplateChange(
        props.isTicketPreview,
        props.ticketTemplateId
    );

    const ticketState = useSelector((store: IStoreState) => {
        return store.ticketControlMappedState[props.ticketId];
    });

    if (!ticketState) {
        return <div />;
    }

    const {
        ticket: { title, summary, sections },
        ticketTemplate,
    } = ticketState;

    const onChangeTicketTitle: ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (event) => {
        const value = event.target.value as string;
        const action = updateTicketTitle({
            value,
            ticketId: props.ticketId,
        });
        dispatch(action);
    };

    const onChangeTicketSummary: ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (event) => {
        const value = event.target.value as string;
        const action = updateTicketSummary({
            value,
            ticketId: props.ticketId,
        });
        dispatch(action);
    };

    function onChangeTicketSectionValue(index: number) {
        return (
            event: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
            }>
        ) => {
            const action = updateSectionValue({
                index,
                value: event.target.value as string,
                ticketId: props.ticketId,
            });
            dispatch(action);
        };
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                padding: !!props.removePadding ? 0 : 2,
            }}
        >
            <WrappedTextField
                value={title.value}
                label={ticketTemplate.title.label}
                onChange={onChangeTicketTitle}
                error={title.touched ? title.error : ""}
                required
                disabled={props.disabled}
            />
            <WrappedTextField
                value={summary.value}
                label={ticketTemplate.summary.label}
                onChange={onChangeTicketSummary}
                error={summary.touched ? summary.error : ""}
                required
                multiline
                disabled={props.disabled}
            />
            {ticketTemplate.sections.map((ticketTemplateSection, index) => {
                const sectionFromTicket = sections[index];
                if (ticketTemplateSection.type === "text") {
                    return (
                        <WrappedTextField
                            value={sectionFromTicket.value}
                            label={ticketTemplateSection.label}
                            onChange={onChangeTicketSectionValue(index)}
                            error={
                                sectionFromTicket.touched
                                    ? sectionFromTicket.error
                                    : ""
                            }
                            required={ticketTemplateSection.required}
                            multiline={ticketTemplateSection.multiline}
                            disabled={props.disabled}
                        />
                    );
                } else if (ticketTemplateSection.type === "number") {
                    return (
                        <WrappedTextField
                            type="number"
                            value={sectionFromTicket.value}
                            label={ticketTemplateSection.label}
                            onChange={onChangeTicketSectionValue(index)}
                            error={
                                sectionFromTicket.touched
                                    ? sectionFromTicket.error
                                    : ""
                            }
                            required={ticketTemplateSection.required}
                            disabled={props.disabled}
                        />
                    );
                }
            })}
        </Box>
    );
}
