import { environmentVariables } from "../environmentVariables";
import Axios from "axios";
import { IUser } from "../models/user";
import { IAddUserRequest } from "../models/addUserRequest";

export interface IUsersApi {
    getAllUsersForCompany(companyId: string): Promise<IUser[]>;
    updateCanManageCompanyUsers(
        companyId: string,
        userToUpdateShortenedItemId: string,
        canManageCompanyUsers: boolean
    ): Promise<void>;
    addUserToCompany(
        companyId: string,
        request: IAddUserRequest
    ): Promise<IUser>;
}

export class UsersApi implements IUsersApi {
    public async getAllUsersForCompany(companyId: string): Promise<IUser[]> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getAllUsersForCompany`,
            {
                params: {
                    companyId,
                },
            }
        );
        return axiosResponse.data as IUser[];
    }

    public async updateCanManageCompanyUsers(
        companyId: string,
        userToUpdateShortenedItemId: string,
        canManageCompanyUsers: boolean
    ): Promise<void> {
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/updateCanManageCompanyUsers`,
            {
                canManageCompanyUsers,
            },
            {
                params: {
                    companyId,
                    userToUpdateShortenedItemId,
                },
            }
        );
    }

    public async addUserToCompany(
        companyId: string,
        request: IAddUserRequest
    ): Promise<IUser> {
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/addUserToCompany`,
            request,
            {
                params: {
                    companyId,
                },
            }
        );
        return axiosResponse.data as IUser;
    }
}
