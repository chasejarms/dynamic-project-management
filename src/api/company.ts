import { ICompany } from "../models/company";
import { environmentVariables } from "../environmentVariables";
import Axios from "axios";

export interface ICompanyApi {
    getCompanies(): Promise<ICompany[]>;
}

export class CompanyApi implements ICompanyApi {
    public async getCompanies(): Promise<ICompany[]> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/companies`
        );
        const data = axiosResponse.data as { items: ICompany[] };
        return data.items;
    }
}
