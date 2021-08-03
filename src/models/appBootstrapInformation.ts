import { ICompany } from "./company";
import { IUser } from "./user";

export interface IAppBootStrapInformation {
    companyInformationItems: ICompany[];
    companyUserItems: IUser[];
}
