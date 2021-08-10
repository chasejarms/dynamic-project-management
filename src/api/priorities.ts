import { ITag } from "../models/tag";
import { environmentVariables } from "../environmentVariables";
import { IBoardPriority } from "../models/boardPriority";
import Axios from "axios";

export interface IPriorityApi {
    getPrioritiesForBoard(
        companyId: string,
        boardId: string
    ): Promise<string[]>;
    updatePrioritiesForBoard(
        companyId: string,
        boardId: string,
        updatedPriorities: string[]
    ): Promise<void>;
    createTag(
        companyId: string,
        boardId: string,
        tagName: string,
        tagColor: string
    ): Promise<ITag>;
    getAllTagsForBoard(companyId: string, boardId: string): Promise<ITag[]>;
    deleteTagForBoard(
        companyId: string,
        boardId: string,
        tagName: string
    ): Promise<void>;
}

export class PriorityApi implements IPriorityApi {
    public async getPrioritiesForBoard(companyId: string, boardId: string) {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getPriorityListForBoard`,
            {
                params: {
                    companyId,
                    boardId,
                },
            }
        );

        const priorityList = (axiosResponse.data as {
            item: IBoardPriority;
        }).item.priorities;
        return priorityList;
    }

    public async updatePrioritiesForBoard(
        companyId: string,
        boardId: string,
        updatedPriorities: string[]
    ) {
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/updatePriorityListForBoard`,
            {
                priorities: updatedPriorities,
            },
            {
                params: {
                    companyId,
                    boardId,
                },
            }
        );
    }

    public async createTag(
        companyId: string,
        boardId: string,
        tagName: string,
        tagColor: string
    ) {
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/createTagForBoard`,
            {
                tagName,
                tagColor,
            },
            {
                params: {
                    companyId,
                    boardId,
                },
            }
        );

        const tag = (axiosResponse.data as {
            tagInformation: ITag;
        }).tagInformation;
        return tag;
    }

    public async getAllTagsForBoard(companyId: string, boardId: string) {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getAllTagsForBoard`,
            {
                params: {
                    companyId,
                    boardId,
                },
            }
        );

        const tags = (axiosResponse.data as {
            tags: ITag[];
        }).tags;

        return tags;
    }

    public async deleteTagForBoard(
        companyId: string,
        boardId: string,
        tagName: string
    ): Promise<void> {
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/deleteTagForBoard`,
            {
                tagName,
            },
            {
                params: {
                    companyId,
                    boardId,
                },
            }
        );
    }
}
