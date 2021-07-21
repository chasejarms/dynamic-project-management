export interface ISimpleCourse {
    modules: {
        name: string;
        description: string;
        id: string;
        firstSectionId: string;
    }[];
}
