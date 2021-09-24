import { Snackbar } from "@mui/material";
import { CenterLoadingSpinner } from "../../../../components/centerLoadingSpinner";
import { BoardContainer } from "../../components/boardContainer";
import { TicketTemplate } from "../components/ticketTemplate";
import { useEditTicketTemplateEndpoints } from "./hooks/useEditTicketTemplateEndpoints";

export function EditTicketTemplate() {
    const {
        isLoadingTicketTemplate,
        ticketTemplateId,
        showSuccessSnackbar,
        closeSuccessSnackbar,
        onClickUpdateTicketTemplate,
        isUpdatingTicketTemplate,
    } = useEditTicketTemplateEndpoints();

    return (
        <BoardContainer>
            {isLoadingTicketTemplate ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <TicketTemplate
                    onClickActionButton={onClickUpdateTicketTemplate}
                    actionButtonText="Update Priority Calculation"
                    actionInProgress={isUpdatingTicketTemplate}
                    ticketTemplateId={ticketTemplateId}
                    fieldsAreDisabled={true}
                />
            )}
            <Snackbar
                open={showSuccessSnackbar}
                onClose={closeSuccessSnackbar}
                message={"Success! The priority calculation was updated."}
            />
        </BoardContainer>
    );
}
