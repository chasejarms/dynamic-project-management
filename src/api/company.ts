import { environmentVariables } from "../environmentVariables";
import Axios from "axios";
import { IAppBootStrapInformation } from "../models/appBootstrapInformation";

export interface ICompanyApi {
    getAppBootstrapInformation(): Promise<IAppBootStrapInformation>;
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
}
