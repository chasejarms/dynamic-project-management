export interface IWeightedNumberSection {
    type: "number";
    label: string;
    required: boolean;
    minValue?: number;
    maxValue?: number;
    allowOnlyIntegers: boolean;
    alias: string;
}
