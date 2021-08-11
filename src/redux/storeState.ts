import { IAppBootstrapInformationState } from "./appBootstrapInformation";
import { IBoardsState } from "./boards";
import { ITicketCreationState } from "./ticketCreation";

export interface IStoreState {
    boards: IBoardsState;
    appBootstrapInformation: IAppBootstrapInformationState;
    ticketCreation: ITicketCreationState;
}
