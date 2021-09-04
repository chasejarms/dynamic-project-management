import { IAppBootstrapInformationState } from "./appBootstrapInformation";
import { IBoardsState } from "./boards";
import { ITicketCreationState } from "./ticketCreation";
import { IWeightedTicketTemplateCreationState } from "./weightedTicketTemplateCreation";
import { ITicketMappingState } from "./ticket";

export interface IStoreState {
    boards: IBoardsState;
    appBootstrapInformation: IAppBootstrapInformationState;
    ticketCreation: ITicketCreationState;
    weightedTicketTemplateCreation: IWeightedTicketTemplateCreationState;
    ticket: ITicketMappingState;
}
