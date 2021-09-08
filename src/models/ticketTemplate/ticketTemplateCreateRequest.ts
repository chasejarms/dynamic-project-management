import { Section } from "./section";

export interface ITicketTemplateCreateRequest {
    name: string;
    description: string;
    title: {
        label: string;
    };
    summary: {
        label: string;
    };
    sections: Section[];
    priorityWeightingCalculation: string;
}
