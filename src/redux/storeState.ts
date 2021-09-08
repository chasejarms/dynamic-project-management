import { IAppBootstrapInformationState } from "./appBootstrapInformation";
import { IBoardsState } from "./boards";
import { ITicketCreationState } from "./ticketCreation";
import { ITicketTemplateControlStateMapping } from "./ticketTemplates";
import { ITicketMappingState } from "./ticket";

export interface IStoreState {
    boards: IBoardsState;
    appBootstrapInformation: IAppBootstrapInformationState;
    ticketCreation: ITicketCreationState;
    weightedTicketTemplateCreation: ITicketTemplateControlStateMapping;
    ticket: ITicketMappingState;
}
