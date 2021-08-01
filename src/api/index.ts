import { IDiscountCodesApi, DiscountCodesApi } from "./discountCodes";
import { BoardApi, IBoardApi } from "./boards";
import { ICompanyApi, CompanyApi } from "./company";
import { IPriorityApi, PriorityApi } from "./priorities";
import { ColumnsApi, IColumnsApi } from "./columns";
import { ISignUpApi, SignUpApi } from "./sign-up";
import { ITicketTemplatesApi, TicketTemplatesApi } from "./ticketTemplates";
import { ITicketsApi, TicketsApi } from "./tickets";
import { IUsersApi, UsersApi } from "./users";

export interface IApi {
    discountCodes: IDiscountCodesApi;
    board: IBoardApi;
    company: ICompanyApi;
    priorities: IPriorityApi;
    columns: IColumnsApi;
    signUp: ISignUpApi;
    ticketTemplates: ITicketTemplatesApi;
    tickets: ITicketsApi;
    users: IUsersApi;
}

class ApiClass implements IApi {
    public discountCodes = new DiscountCodesApi();
    public board = new BoardApi();
    public company = new CompanyApi();
    public priorities = new PriorityApi();
    public columns = new ColumnsApi();
    public signUp = new SignUpApi();
    public ticketTemplates = new TicketTemplatesApi();
    public tickets = new TicketsApi();
    public users = new UsersApi();
}

export const Api = new ApiClass();
