export class RouteCreator {
    public static ticketTemplateEdit(
        companyId: string,
        boardId: string,
        shortenedTicketTemplateId: string
    ) {
        return `/app/company/${companyId}/board/${boardId}/ticket-templates/${shortenedTicketTemplateId}`;
    }

    public static ticketTemplates(companyId: string, boardId: string) {
        return `/app/company/${companyId}/board/${boardId}/ticket-templates`;
    }

    public static createTicketTemplate(
        companyId: string,
        boardId: string,
        isCopy: boolean = false
    ) {
        return `/app/company/${companyId}/board/${boardId}/ticket-templates/create-ticket-template`;
    }

    public static boards(companyId: string) {
        return `/app/company/${companyId}/boards`;
    }

    public static boardAdmins(companyId: string, boardId: string) {
        return `/app/company/${companyId}/board/${boardId}/board-admins`;
    }

    public static archivedTickets(companyId: string, boardId: string) {
        return `/app/company/${companyId}/board/${boardId}/archived-tickets`;
    }

    public static inProgressTickets(companyId: string, boardId: string) {
        return `/app/company/${companyId}/board/${boardId}/tickets`;
    }

    public static createTicket(companyId: string, boardId: string) {
        return `/app/company/${companyId}/board/${boardId}/tickets/create-ticket`;
    }

    public static editBoard(companyId: string, boardId: string) {
        return `/app/company/${companyId}/board/${boardId}/edit-board`;
    }

    public static backlogTickets(companyId: string, boardId: string) {
        return `/app/company/${companyId}/board/${boardId}/backlog-tickets`;
    }

    public static inProgressTicketData(
        companyId: string,
        boardId: string,
        ticketId: string
    ) {
        return `/app/company/${companyId}/board/${boardId}/tickets/${ticketId}/data`;
    }

    public static backlogTicketData(
        companyId: string,
        boardId: string,
        ticketId: string
    ) {
        return `/app/company/${companyId}/board/${boardId}/backlog-tickets/${ticketId}/data`;
    }

    public static archivedTicketData(
        companyId: string,
        boardId: string,
        ticketId: string
    ) {
        return `/app/company/${companyId}/board/${boardId}/archived-tickets/${ticketId}/data`;
    }

    public static inProgressTicketImages(
        companyId: string,
        boardId: string,
        ticketId: string
    ) {
        return `/app/company/${companyId}/board/${boardId}/tickets/${ticketId}/images`;
    }

    public static backlogTicketImages(
        companyId: string,
        boardId: string,
        ticketId: string
    ) {
        return `/app/company/${companyId}/board/${boardId}/backlog-tickets/${ticketId}/images`;
    }

    public static archivedTicketImages(
        companyId: string,
        boardId: string,
        ticketId: string
    ) {
        return `/app/company/${companyId}/board/${boardId}/archived-tickets/${ticketId}/images`;
    }

    public static createBoard(companyId: string) {
        return `/app/company/${companyId}/boards/create-board`;
    }

    public static companyUsers(companyId: string) {
        return `/app/company/${companyId}/company-users`;
    }

    public static addCompany(companyId: string) {
        return `/app/company/${companyId}/add-company`;
    }

    public static companies() {
        return "/app/companies";
    }

    public static learningCenterEditor() {
        return "/app/internal/learning-center-editor";
    }

    public static learningCenterVideos() {
        return "/app/internal/learning-center-videos";
    }

    public static contact() {
        return "/contact";
    }

    public static signIn() {
        return "/sign-in";
    }

    public static signUp() {
        return "/sign-up";
    }

    public static resetPassword() {
        return "/reset-password";
    }

    public static enterNewPassword() {
        return "/enter-new-password";
    }

    public static app() {
        return "/app";
    }

    public static home() {
        return "/";
    }
}
