import { Box, Paper } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ticketPreviewId } from "../../../../../../../../../redux/ticketControlMappedState";
import {
    createTicketTemplateId,
    resetWeightedTicketTemplateCreationState,
} from "../../../../../../../../../redux/ticketTemplates";
import { TicketFields } from "../../../components/ticketFields";
import { TicketSummaryHeader } from "./ticketSummaryHeader";
import { TicketTemplateBottomToolbar } from "./ticketTemplateBottomToolbar";
import { TicketTemplateFieldsContainer } from "./ticketTemplateFieldsContainer";

export interface ITicketTemplateProps {
    ticketTemplateId: string;
    fieldsAreDisabled: boolean;
    onClickActionButton: () => void;
    actionButtonText: string;
    actionInProgress: boolean;
}

export function TicketTemplate(props: ITicketTemplateProps) {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            if (props.ticketTemplateId !== createTicketTemplateId) return;
            const action = resetWeightedTicketTemplateCreationState();
            dispatch(action);
        };
    }, []);

    return (
        <Box
            sx={{
                height: "100%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    overflow: "auto",
                    bgcolor: "action.selected",
                    padding: 4,
                }}
            >
                <TicketSummaryHeader
                    ticketId={ticketPreviewId}
                    ticketTemplateId={props.ticketTemplateId}
                />
                <TicketFields
                    ticketId={ticketPreviewId}
                    isTicketPreview={true}
                    disabled={props.actionInProgress}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </Box>
            <Box
                sx={{
                    height: "100%",
                    overflow: "auto",
                    display: "grid",
                    gridTemplateRows: "1fr auto",
                }}
            >
                <Box
                    sx={{
                        padding: 4,
                        paddingRight: 2,
                        height: "100%",
                        overflow: "auto",
                    }}
                >
                    <TicketTemplateFieldsContainer
                        disabled={
                            props.actionInProgress || props.fieldsAreDisabled
                        }
                        ticketTemplateId={props.ticketTemplateId}
                    />
                </Box>
                <TicketTemplateBottomToolbar
                    onClickActionButton={props.onClickActionButton}
                    showActionButtonSpinner={props.actionInProgress}
                    actionButtonText={props.actionButtonText}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </Box>
        </Box>
    );
}
