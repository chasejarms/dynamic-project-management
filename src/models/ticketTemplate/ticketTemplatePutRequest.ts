import { Section } from "./section";

export interface ITicketTemplatePutRequest {
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
