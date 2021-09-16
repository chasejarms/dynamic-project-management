/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Snackbar } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { BoardAdminContainer } from "../../components/boardAdminContainer";
import { TicketTemplate } from "../components/ticketTemplate";
import { WrappedButton } from "../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { useCreateTicketTemplateCall } from "./hooks/useCreateTicketTemplateCall";
import { createTicketTemplateId } from "../../../../../../../../../redux/ticketTemplates";

export function CreateTicketTemplate() {
    const { boardId, companyId } = useAppRouterParams();

    const {
        isCreatingTicketTemplate,
        onClickCreateTicketTemplate,
        showSuccessSnackbar,
        closeSuccessSnackbar,
    } = useCreateTicketTemplateCall();

    const history = useHistory();
    function navigateToTicketTemplate() {
        history.push(
            `/app/company/${companyId}/board/${boardId}/admin/ticket-templates`
        );
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
                        onClick={navigateToTicketTemplate}
                    >
                        Back to Ticket Templates
                    </WrappedButton>
                }
            />
        </BoardAdminContainer>
    );
}
