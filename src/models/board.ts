import { BoardPriorityType } from "./boardPriorityType";
import { IDefaultPrimaryTableModel } from "./sharedModels/defaultPrimaryTableModel";

export interface IBoard extends IDefaultPrimaryTableModel {
    name: string;
    description: string;
    hasBeenDeleted?: boolean;
    shortenedItemId: string;
    priorityType: BoardPriorityType;
}
