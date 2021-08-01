import { IDefaultPrimaryTableModel } from "./sharedModels/defaultPrimaryTableModel";

export interface IUser extends IDefaultPrimaryTableModel {
    name: string;
    gsiSortKey: string;
    isCompanyAdmin: boolean;
    boardRights: {
        [boardId: string]: {
            isAdmin: boolean;
        };
    };
}
