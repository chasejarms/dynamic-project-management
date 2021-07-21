import { UserFacingSection } from "./section/section";

export interface IUserFacingModule {
    id: string;
    name: string;
    description: string;
    sections: UserFacingSection[];
}
