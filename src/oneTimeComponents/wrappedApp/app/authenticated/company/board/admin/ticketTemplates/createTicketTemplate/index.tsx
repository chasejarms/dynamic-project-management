import { Snackbar } from "@mui/material";
import { useHistory } from "react-router-dom";
import { BoardAdminContainer } from "../../components/boardAdminContainer";
import { TicketTemplate } from "../components/ticketTemplate";
import { WrappedButton } from "../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { useCreateTicketTemplateCall } from "./hooks/useCreateTicketTemplateCall";
import { createTicketTemplateId } from "../../../../../../../../../redux/ticketTemplates";
import { RouteCreator } from "../../../../../../utils/routeCreator";

export function CreateTicketTemplate() {
    const { boardId, companyId } = useAppRouterParams();

    const {
        isCreatingTicketTemplate,
        onClickCreateTicketTemplate,
        showSuccessSnackbar,
        closeSuccessSnackbar,
    } = useCreateTicketTemplateCall();

    const history = useHistory();
    function navigateToTicketTemplates() {
        const route = RouteCreator.ticketTemplates(companyId, boardId);
        history.push(route);
    }

    return (
        <BoardAdminContainer>
            <TicketTemplate
                onClickActionButton={onClickCreateTicketTemplate}
                actionButtonText="Create Ticket Template"
                ticketTemplateId={createTicketTemplateId}
                fieldsAreDisabled={false}
                actionInProgress={isCreatingTicketTemplate}
            />
            <Snackbar
                open={showSuccessSnackbar}
                onClose={closeSuccessSnackbar}
                message={"Success! The ticket template was created."}
                action={
                    <WrappedButton
                        color="secondary"
                        onClick={navigateToTicketTemplates}
                    >
                        Back to Ticket Templates
                    </WrappedButton>
                }
            />
        </BoardAdminContainer>
    );
}
