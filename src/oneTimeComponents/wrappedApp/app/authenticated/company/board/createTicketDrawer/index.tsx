/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { DrawerContainer } from "../../../../../../components/drawerContainer";
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";

export interface ICreateTicketDrawerProps {
    ticketType: TicketType;
}

export function CreateTicketDrawer(props: ICreateTicketDrawerProps) {
    const history = useHistory();
    const { companyId, boardId } = useAppRouterParams();

    function closeDrawer() {
        if (props.ticketType === TicketType.InProgress) {
            history.push(`/app/company/${companyId}/board/${boardId}/tickets`);
        } else if (props.ticketType === TicketType.Backlog) {
            history.push(
                `/app/company/${companyId}/board/${boardId}/backlog-tickets`
            );
        } else {
            history.push(
                `/app/company/${companyId}/board/${boardId}/archived-tickets`
            );
        }
    }

    return (
        <DrawerContainer darkOpacityOnClick={closeDrawer}>
            <div>This is the create ticket page now</div>
        </DrawerContainer>
    );
}
