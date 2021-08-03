import { IDefaultPrimaryTableModel } from "./sharedModels/defaultPrimaryTableModel";

export interface ICompany extends IDefaultPrimaryTableModel {
    name: string;
    shortenedItemId: string;
}
