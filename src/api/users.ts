import { environmentVariables } from "../environmentVariables";
import Axios from "axios";
import { IUser } from "../models/user";
import { IAddUserRequest } from "../models/addUserRequest";
import { BoardRightsAction } from "../models/boardRightsAction";

export interface IUsersApi {
    getAllUsersForCompany(companyId: string): Promise<IUser[]>;
    getAllUsersForBoard(companyId: string, boardId: string): Promise<IUser[]>;
    updateCompanyUserRights(
        companyId: string,
        userToUpdateShortenedItemId: string,
        canManageCompanyUsers: boolean
    ): Promise<void>;
    addUserToCompany(
        companyId: string,
        request: IAddUserRequest
    ): Promise<IUser>;
    removeUserFromCompany(companyId: string, email: string): Promise<void>;
    updateUserBoardRights(
        companyId: string,
        boardId: string,
        userToUpdateShortenedItemId: string,
        boardRightsAction: BoardRightsAction
    ): Promise<void>;
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

    public async getAllUsersForBoard(
        companyId: string,
        boardId: string
    ): Promise<IUser[]> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getAllUsersForBoard`,
            {
                params: {
                    companyId,
                    boardId,
                },
            }
        );
        return axiosResponse.data as IUser[];
    }

    public async updateCompanyUserRights(
        companyId: string,
        userToUpdateShortenedItemId: string,
        canManageCompanyUsers: boolean
    ): Promise<void> {
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/updateCompanyUserRights`,
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

    public async removeUserFromCompany(companyId: string, email: string) {
        await Axios.delete(
            `${environmentVariables.baseAuthenticatedApiUrl}/removeUserFromCompany`,
            {
                params: {
                    companyId,
                    email,
                },
            }
        );
    }

    public async updateUserBoardRights(
        companyId: string,
        boardId: string,
        userToUpdateShortenedItemId: string,
        boardRightsAction: BoardRightsAction
    ): Promise<void> {
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/updateUserBoardRights`,
            undefined,
            {
                params: {
                    companyId,
                    boardId,
                    userToUpdateShortenedItemId,
                    boardRightsAction,
                },
            }
        );
    }
}
