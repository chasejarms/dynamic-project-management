import { IAppBootstrapInformationState } from "./appBootstrapInformation";
import { IBoardsState } from "./boards";
import { ITicketCreationState } from "./ticketCreation";
import { ITicketTemplateControlStateMapping } from "./ticketTemplates";
import { ITicketControlMappedState } from "./ticketControlMappedState";
import { IBoardColumnEditMappedState } from "./boardColumnEditMappedState";

export interface IStoreState {
    boards: IBoardsState;
    appBootstrapInformation: IAppBootstrapInformationState;
    ticketCreation: ITicketCreationState;
    weightedTicketTemplateCreation: ITicketTemplateControlStateMapping;
    ticketControlMappedState: ITicketControlMappedState;
    boardColumnEditMappedState: IBoardColumnEditMappedState;
}
