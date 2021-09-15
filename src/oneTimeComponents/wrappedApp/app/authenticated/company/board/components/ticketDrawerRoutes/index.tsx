/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { TicketType } from "../../../../../../../../models/ticket/ticketType";
import { ITicketUpdateRequest } from "../../../../../../../../models/ticketUpdateRequest";
import { TicketHome } from "../../ticket/ticketHome";
import { TicketImages } from "../../ticket/ticketImages";

export interface ITicketDrawerRoutesProps {
    onUpdateTicket: (ticketUpdateRequest: ITicketUpdateRequest) => void;
    onDeleteTicket: (columnId: string, itemId: string) => void;
    ticketType: TicketType;
}

export function TicketDrawerRoutes(props: ITicketDrawerRoutesProps) {
    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${url}/:ticketId/data`} exact>
                <TicketHome
                    onUpdateTicket={props.onUpdateTicket}
                    onDeleteTicket={props.onDeleteTicket}
                    ticketType={TicketType.Backlog}
                />
            </Route>
            <Route path={`${url}/:ticketId/images`} exact>
                <TicketImages ticketType={TicketType.Backlog} />
            </Route>
        </Switch>
    );
}
