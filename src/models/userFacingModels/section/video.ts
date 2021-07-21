import { IBaseUserFacingSection } from "./baseSection";
import { SectionType } from "../../sharedModels/sectionType";

export interface IUserFacingVideo extends IBaseUserFacingSection {
    url: string;
    type: SectionType.Video;
}
