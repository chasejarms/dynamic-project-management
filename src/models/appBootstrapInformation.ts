import { ICompany } from "./company";
import { IInternalUser } from "./internalUser";
import { IUser } from "./user";

export interface IAppBootStrapInformation {
    companyInformationItems: ICompany[];
    companyUserItems: IUser[];
    internalUser: null | IInternalUser;
}
