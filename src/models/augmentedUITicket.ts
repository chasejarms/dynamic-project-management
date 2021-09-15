import { ITicket } from "./ticket";

export interface IAugmentedUITicket extends ITicket {
    pointValueFromTags: number;
}
