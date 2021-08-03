import { IAppBootstrapInformationState } from "./appBootstrapInformation";
import { IBoardsState } from "./boards";

export interface IStoreState {
    boards: IBoardsState;
    appBootstrapInformation: IAppBootstrapInformationState;
}
