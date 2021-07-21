import { ICompany } from "../models/company";
import Axios from "axios";
import { environmentVariables } from "../environmentVariables";

export interface ICompanyApi {
    getCompanies(): Promise<ICompany[]>;
}

export class CompanyApi implements ICompanyApi {
    public async getCompanies(): Promise<ICompany[]> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/companies`,
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
            }
        );
        const data = axiosResponse.data as { items: ICompany[] };
        return data.items;
    }
}
