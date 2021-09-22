import { Box, Paper } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ticketPreviewId } from "../../../../../../../../../../redux/ticketControlMappedState";
import { resetWeightedTicketTemplateCreationState } from "../../../../../../../../../../redux/ticketTemplates";
import { PriorityWeightingFunction } from "./priorityWeightingFunction";
import { TicketFields } from "../../../../components/ticketFields";
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
            const action = resetWeightedTicketTemplateCreationState();
            dispatch(action);
        };
    }, []);

    return (
        <Box
            sx={{
                height: "100%",
                display: "grid",
                gridTemplateRows: "1fr auto",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    overflow: "auto",
                }}
            >
                <TicketTemplateFieldsContainer
                    disabled={props.actionInProgress || props.fieldsAreDisabled}
                    ticketTemplateId={props.ticketTemplateId}
                />
                <Box
                    sx={{
                        padding: 32,
                        paddingLeft: 16,
                    }}
                >
                    <Box
                        sx={{
                            paddingBottom: 16,
                        }}
                    >
                        <PriorityWeightingFunction
                            ticketId={ticketPreviewId}
                            disabled={props.actionInProgress}
                            ticketTemplateId={props.ticketTemplateId}
                        />
                    </Box>
                    <Paper>
                        <TicketSummaryHeader
                            ticketId={ticketPreviewId}
                            ticketTemplateId={props.ticketTemplateId}
                        />
                        <Box
                            sx={{
                                height: "300px",
                                overflow: "auto",
                            }}
                        >
                            <TicketFields
                                ticketId={ticketPreviewId}
                                isTicketPreview={true}
                                disabled={props.actionInProgress}
                                ticketTemplateId={props.ticketTemplateId}
                            />
                        </Box>
                    </Paper>
                    <div />
                </Box>
            </Box>
            <TicketTemplateBottomToolbar
                onClickActionButton={props.onClickActionButton}
                showActionButtonSpinner={props.actionInProgress}
                actionButtonText={props.actionButtonText}
                ticketTemplateId={props.ticketTemplateId}
            />
        </Box>
    );
}
