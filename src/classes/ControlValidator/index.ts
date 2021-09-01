export type IValidatorRule =
    | IStringRule
    | IRegexRule
    | ILengthRule
    | ICustomRule;

export interface IStringRule {
    type: "must-be-string";
    errorMessage: string;
}

export interface IRegexRule {
    type: "regex";
    regex: RegExp;
    errorMessage: string;
}

export interface ILengthRule {
    type: "length";
    min?: number;
    max?: number;
    errorMessage: string;
}

export interface ICustomRule {
    type: "custom";
    isValidCallback: (value: any) => boolean;
    errorMessage: string;
}

export class ControlValidator {
    public validatorRules: IValidatorRule[] = [];

    public static string(errorMessage?: string) {
        const controlValidator = new ControlValidator();
        controlValidator.validatorRules.push({
            type: "must-be-string",
            errorMessage: errorMessage || "Must be string",
        });

        return controlValidator;
    }

    public email(errorMessage?: string) {
        this.validatorRules.push({
            type: "regex",
            regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            errorMessage: errorMessage || "Invalid Email",
        });

        return this;
    }

    public onlyAThroughZ(errorMessage?: string) {
        this.validatorRules.push({
            type: "regex",
            regex: /^$|^[a-zA-Z]+$/,
            errorMessage: errorMessage || "Only a through z is allowed",
        });

        return this;
    }

    public required(errorMessage?: string) {
        this.validatorRules.push({
            type: "length",
            min: 1,
            errorMessage: errorMessage || "Value is required",
        });

        return this;
    }

    public min(length: number, errorMessage?: string) {
        this.validatorRules.push({
            type: "length",
            min: length,
            errorMessage:
                errorMessage || `Value must be at least ${length} characters`,
        });

        return this;
    }

    public max(length: number, errorMessage: string) {
        this.validatorRules.push({
            type: "length",
            max: length,
            errorMessage,
        });

        return this;
    }

    public customValidator(
        isValidCallback: (value: any) => boolean,
        errorMessage: string
    ) {
        this.validatorRules.push({
            type: "custom",
            isValidCallback,
            errorMessage,
        });

        return this;
    }

    public validate(value: string) {
        for (let i = 0; i < this.validatorRules.length; i++) {
            const rule = this.validatorRules[i];

            if (rule.type === "must-be-string") {
                if (typeof value !== "string") {
                    return rule.errorMessage;
                }
            }

            if (rule.type === "regex") {
                if (!rule.regex.test(value)) {
                    return rule.errorMessage;
                }
            }

            if (rule.type === "length") {
                const matchesMin =
                    rule.min === undefined || value.length >= rule.min;
                const matchesMax =
                    rule.max === undefined || value.length <= rule.max;

                if (!matchesMin || !matchesMax) {
                    return rule.errorMessage;
                }
            }

            if (rule.type === "custom") {
                const isValid = rule.isValidCallback(value);
                if (!isValid) {
                    return rule.errorMessage;
                }
            }
        }

        return "";
    }
}
