import { ITag } from "../models/tag";
import { environmentVariables } from "../environmentVariables";
import Axios from "axios";
import { IBoardPriority } from "../models/boardPriority";

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
}

const priorities = [
    "Sev 1",
    "Sev 2",
    "Sev 3",
    "Sev 4",
    "Sev 5",
    "Q1 Features",
    "Q2 Features",
];

const allTagsForBoard = [
    "Sev 1",
    "Sev 2",
    "Sev 3",
    "Sev 4",
    "Sev 5",
    "Q1 Features",
    "Q2 Features",
    "UI Defect",
    "Board Creation",
    "Customer Meetings",
];

export class PriorityApi implements IPriorityApi {
    public async getPrioritiesForBoard(companyId: string, boardId: string) {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getPriorityListForBoard`,
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
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
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
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
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
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
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
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
}
