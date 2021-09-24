import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../../redux/storeState";
import { TicketTemplateNameField } from "./ticketTemplateNameField";
import { TicketTemplateDescriptionField } from "./ticketTemplateDescriptionField";
import { TicketTemplateTitleField } from "./ticketTemplateTitleField";
import { TicketTemplateSummaryField } from "./ticketTemplateSummaryField";
import { TicketTemplateSectionWrapper } from "./ticketTemplateSectionWrapper";
import { Box } from "@mui/material";

export interface ITicketTemplateFieldsContainerProps {
    disabled: boolean;
    ticketTemplateId: string;
}

export function TicketTemplateFieldsContainer(
    props: ITicketTemplateFieldsContainerProps
) {
    const sectionLength = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .sections.length;
    });

    const sections = [];
    for (let i = 0; i < sectionLength; i++) {
        sections.push(
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 96px",
                    gap: 2,
                    marginTop: 2,
                }}
                key={i}
            >
                <TicketTemplateSectionWrapper
                    disabled={props.disabled}
                    index={i}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                padding: 4,
                paddingLeft: 0,
                overflowY: "auto",
                paddingRight: 2,
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 96px",
                    gap: 2,
                }}
            >
                <TicketTemplateNameField
                    disabled={props.disabled}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 96px",
                    gap: 2,
                }}
            >
                <TicketTemplateDescriptionField
                    disabled={props.disabled}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 96px",
                    gap: 2,
                }}
            >
                <TicketTemplateTitleField
                    disabled={props.disabled}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 96px",
                    gap: 2,
                }}
            >
                <TicketTemplateSummaryField
                    disabled={props.disabled}
                    ticketTemplateId={props.ticketTemplateId}
                />
            </Box>
            {sections}
        </Box>
    );
}
