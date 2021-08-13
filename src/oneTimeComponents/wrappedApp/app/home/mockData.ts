import { IColumn } from "../../../../models/column";
import { ISimplifiedTag } from "../../../../models/simplifiedTag";
import { TagColor } from "../../../../models/tagColor";
import { ITicket } from "../../../../models/ticket";

const columnIdsMapping = {
    toDo: "1",
    inProgress: "2",
    qaReview: "3",
    codeReview: "4",
    mergedToTest: "5",
    deployedToProduction: "6",
};

const simplifiedTagsMapping: { [name: string]: ISimplifiedTag } = {};

export const mockColumnData: IColumn[] = [
    {
        name: "To Do",
        id: columnIdsMapping.toDo,
        canBeModified: true,
    },
    {
        name: "In Progress",
        id: columnIdsMapping.inProgress,
        canBeModified: true,
    },
    {
        name: "QA Review",
        id: columnIdsMapping.qaReview,
        canBeModified: true,
    },
    {
        name: "Code Review",
        id: columnIdsMapping.codeReview,
        canBeModified: true,
    },
    {
        name: "Merged To Test",
        id: columnIdsMapping.mergedToTest,
        canBeModified: true,
    },
    {
        name: "Deployed to Production",
        id: columnIdsMapping.deployedToProduction,
        canBeModified: true,
    },
];

export const mockTickets: ITicket[] = [
    {
        itemId: "",
        belongsTo: "",
        shortenedItemId: "123",
        title: "Something",
        summary: "",
        sections: [],
        createdTimestamp: "",
        lastModifiedTimestamp: "",
        completedTimestamp: "",
        tags: [],
        simplifiedTicketTemplate: {
            title: {
                label: "",
            },
            summary: {
                isRequired: false,
                label: "",
            },
            sections: [],
        },
        columnId: columnIdsMapping.toDo,
        ticketIdForTicketInformation: "",
        assignedTo: "",
    },
];

export const mockPriorities: string[] = [];
