import { Switch, Route, useRouteMatch } from "react-router-dom";
import { ITicket } from "../../../../../../../../models/ticket";
import { TicketType } from "../../../../../../../../models/ticket/ticketType";
import { ITicketUpdateRequest } from "../../../../../../../../models/ticketUpdateRequest";
import { CreateTicket } from "../../createTicket";
import { TicketHome } from "../../ticket/ticketHome";
import { TicketImages } from "../../ticket/ticketImages";

export interface ITicketDrawerRoutesProps {
    onUpdateTicket: (ticketUpdateRequest: ITicketUpdateRequest) => void;
    onDeleteTicket: (columnId: string, itemId: string) => void;
    onCreateTicket?: (newlyCreatedTicket: ITicket) => void;
    ticketType: TicketType;
}

export function TicketDrawerRoutes(props: ITicketDrawerRoutesProps) {
    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${url}/create-ticket`} exact>
                <CreateTicket
                    ticketType={props.ticketType}
                    onCreateTicket={props.onCreateTicket}
                />
            </Route>
            <Route path={`${url}/:ticketId/data`} exact>
                <TicketHome
                    onUpdateTicket={props.onUpdateTicket}
                    onDeleteTicket={props.onDeleteTicket}
                    ticketType={props.ticketType}
                />
            </Route>
            <Route path={`${url}/:ticketId/images`} exact>
                <TicketImages ticketType={props.ticketType} />
            </Route>
        </Switch>
    );
}
