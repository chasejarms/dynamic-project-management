import { IAppBootstrapInformationState } from "./appBootstrapInformation";
import { IBoardsState } from "./boards";
import { ITicketCreationState } from "./ticketCreation";
import { IWeightedTicketTemplateCreationState } from "./weightedTicketTemplateCreation";

export interface IStoreState {
    boards: IBoardsState;
    appBootstrapInformation: IAppBootstrapInformationState;
    ticketCreation: ITicketCreationState;
    weightedTicketTemplateCreation: IWeightedTicketTemplateCreationState;
}
