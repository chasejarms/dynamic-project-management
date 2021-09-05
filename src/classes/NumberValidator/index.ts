export type INumberValidatorRule =
    | IMinRule
    | IRequiredRule
    | IMaxRule
    | IIntegerRule;

export interface IMinRule {
    type: "min";
    min: number;
    errorMessage: string;
}

export interface IMaxRule {
    type: "max";
    max: number;
    errorMessage: string;
}

export interface IIntegerRule {
    type: "integer";
    errorMessage: string;
}

export interface IRequiredRule {
    type: "required";
    errorMessage: string;
}

export interface ICustomRule {
    type: "custom";
    isValidCallback: (value: any) => boolean;
    errorMessage: string;
}

export class NumberValidator {
    public validatorRules: INumberValidatorRule[] = [];

    public min(applyValidator: boolean, min: number, errorMessage?: string) {
        if (!!applyValidator) {
            this.validatorRules.push({
                type: "min",
                min,
                errorMessage:
                    errorMessage || "The number is smaller than the min",
            });
        }

        return this;
    }

    public max(applyValidator: boolean, max: number, errorMessage?: string) {
        if (!!applyValidator) {
            this.validatorRules.push({
                type: "max",
                max,
                errorMessage:
                    errorMessage || "The number is larger than the min",
            });
        }

        return this;
    }

    public integer(applyValidator: boolean, errorMessage?: string) {
        if (!!applyValidator) {
            this.validatorRules.push({
                type: "integer",
                errorMessage: errorMessage || "The number must be an integer",
            });
        }

        return this;
    }

    public required(applyValidator: boolean, errorMessage?: string) {
        if (!!applyValidator) {
            this.validatorRules.push({
                type: "required",
                errorMessage: errorMessage || "Value is required",
            });
        }

        return this;
    }

    public validate(value: number | undefined | null | "") {
        for (let i = 0; i < this.validatorRules.length; i++) {
            const rule = this.validatorRules[i];

            const isNumber = typeof value === "number";
            console.log("isNumber: ", isNumber);

            if (isNumber) {
                const numberValue = value as number;
                if (rule.type === "min") {
                    if (numberValue < rule.min) {
                        return rule.errorMessage;
                    }
                }

                if (rule.type === "max") {
                    if (numberValue > rule.max) {
                        return rule.errorMessage;
                    }
                }

                if (rule.type === "integer") {
                    if (!Number.isInteger(numberValue)) {
                        return rule.errorMessage;
                    }
                }
            }

            if (rule.type === "required") {
                if (value === undefined || value === null || value === "") {
                    return rule.errorMessage;
                }
            }
        }

        return "";
    }
}
