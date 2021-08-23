import { IDefaultPrimaryTableModel } from "./sharedModels/defaultPrimaryTableModel";

export interface IInternalUser extends IDefaultPrimaryTableModel {
    name: string;
    email: string;
    shortenedItemId: string;
}
