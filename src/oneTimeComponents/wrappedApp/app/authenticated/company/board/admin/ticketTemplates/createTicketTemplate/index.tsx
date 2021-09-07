/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { BoardContainer } from "../../../../../../../../../components/boardContainer";
import { TicketTemplate } from "../../../../../../../../../components/ticketTemplate";
import { createTicketTemplateId } from "../../../../../../../../../redux/weightedTicketTemplateCreation";

export function CreateTicketTemplate() {
    return (
        <BoardContainer>
            <TicketTemplate ticketTemplateId={createTicketTemplateId} />
        </BoardContainer>
    );
}
