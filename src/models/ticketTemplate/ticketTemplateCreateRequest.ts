import { Section } from "./section";

export interface ITicketTemplateCreateRequest {
    name: string;
    description: string;
    title: {
        label: string;
    };
    summary: {
        isRequired: true;
        label: string;
    };
    sections: Section[];
}
