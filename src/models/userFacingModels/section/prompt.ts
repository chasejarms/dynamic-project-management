import { IBaseUserFacingSection } from "./baseSection";
import { SectionType } from "../../sharedModels/sectionType";

export interface IUserFacingPrompt extends IBaseUserFacingSection {
    text: string;
    description: string;
    allowedKeywords: {
        [key: string]: true;
    };
    type: SectionType.Prompt;
}
