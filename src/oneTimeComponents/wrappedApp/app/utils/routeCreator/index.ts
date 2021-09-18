export class RouteCreator {
    public static ticketTemplateEdit(
        companyId: string,
        boardId: string,
        shortenedTicketTemplateId: string
    ) {
        return `/app/company/${companyId}/board/${boardId}/admin/ticket-templates/${shortenedTicketTemplateId}`;
    }
}
