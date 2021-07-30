import { ISimplifiedTag } from "./simplifiedTag";

export interface ITicketUpdateRequest {
    title: string;
    summary: string;
    tags: ISimplifiedTag[];
    sections: any[];
}
