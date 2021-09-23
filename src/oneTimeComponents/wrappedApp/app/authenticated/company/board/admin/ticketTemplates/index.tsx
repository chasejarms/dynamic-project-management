import { useRouteMatch, Switch, Route } from "react-router-dom";
import { CreateTicketTemplate } from "./createTicketTemplate";
import { EditTicketTemplate } from "./editTicketTemplate";
import { TicketTemplatesHome } from "./ticketTemplatesHome";

export function TicketTemplates() {
    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${url}/`} exact>
                <TicketTemplatesHome />
            </Route>
            <Route path={`${url}/create-ticket-template`}>
                <CreateTicketTemplate />
            </Route>
            <Route path={`${url}/:ticketTemplateId`}>
                <EditTicketTemplate />
            </Route>
        </Switch>
    );
}
