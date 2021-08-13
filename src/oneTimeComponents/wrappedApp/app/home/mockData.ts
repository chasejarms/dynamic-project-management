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

const simplifiedTagsMapping = {
    Defect: {
        name: "Defect",
        color: TagColor.Red,
    },
    Feature: {
        name: "Feature",
        color: TagColor.Blue,
    },
    AWSMigration: {
        name: "AWS Migration",
        color: TagColor.Grey,
    },
    ChatFunctionality: {
        name: "Chat Functionality",
        color: TagColor.Grey,
    },
    Reporting: {
        name: "Reporting",
        color: TagColor.Grey,
    },
    Administrative: {
        name: "Adminstrative Controls",
        color: TagColor.Grey,
    },
    CI: {
        name: "Continous Integration",
        color: TagColor.Grey,
    },
    ImageUpload: {
        name: "Image Upload",
        color: TagColor.Grey,
    },
};

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

export const mockPriorities: string[] = [
    simplifiedTagsMapping.AWSMigration.name,
    simplifiedTagsMapping.ChatFunctionality.name,
    simplifiedTagsMapping.Reporting.name,
    simplifiedTagsMapping.Administrative.name,
    simplifiedTagsMapping.CI.name,
    simplifiedTagsMapping.ImageUpload.name,
    simplifiedTagsMapping.Defect.name,
    simplifiedTagsMapping.Feature.name,
];
