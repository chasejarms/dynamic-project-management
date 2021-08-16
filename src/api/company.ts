import { environmentVariables } from "../environmentVariables";
import Axios from "axios";
import { IAppBootStrapInformation } from "../models/appBootstrapInformation";

export interface ICompanyApi {
    getAppBootstrapInformation(): Promise<IAppBootStrapInformation>;
    authenticatedCreateNewCompany(
        companyName: string,
        email: string,
        name: string,
        secretKey: string
    ): Promise<void>;
}

export class CompanyApi implements ICompanyApi {
    public async getAppBootstrapInformation(): Promise<
        IAppBootStrapInformation
    > {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getAppBootstrapInformation`
        );
        return axiosResponse.data as IAppBootStrapInformation;
    }

    public async authenticatedCreateNewCompany(
        companyName: string,
        email: string,
        name: string,
        secretKey: string
    ): Promise<void> {
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/authenticatedCreateNewCompany`,
            {
                companyName,
                email,
                name,
                secretKey,
            }
        );
    }
}
