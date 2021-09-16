import { useState, useEffect } from "react";
import { isEqual } from "lodash";

export interface IUseControlProps<ValueType, EventType> {
    value: ValueType;
    validatorError?: (value: ValueType) => string;
    isTouched?: boolean; // defaults to false
    skipValidateOnMount?: boolean; // default to true
    onChange: (eventType: EventType) => ValueType;
    validationDependencies?: any[];
}

export interface IControl<ValueType, EventType> {
    value: ValueType;
    isValid: boolean;
    errorMessage: string;
    isTouched: boolean;
    onChange: (eventType: EventType) => void;
    resetControlState: (value: ValueType) => void;
    isDirty: boolean;
    markControlAsPristine: () => void;
    resetValue: () => void;
}

export function useControl<ValueType, EventType>(
    props: IUseControlProps<ValueType, EventType>
) {
    const [initialValue, setInitialValue] = useState(props.value);
    const [value, setValue] = useState(props.value);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [isTouched, setIsTouched] = useState(!!props.isTouched);
    const [errorMessage, setErrorMessage] = useState("");

    function resetValue() {
        setValue(initialValue);
    }

    function markControlAsPristine() {
        setInitialValue(value);
        setIsTouched(false);
    }

    function onChange(eventType: EventType) {
        const valueAfterChange = props.onChange(eventType);
        setValue(valueAfterChange);
        setIsTouched(true);
    }

    const additionalValidationDependencies = props.validationDependencies || [];
    useEffect(() => {
        if (!isInitialRender || !props.skipValidateOnMount) {
            const errorAfterChange = props.validatorError
                ? props.validatorError(value)
                : "";
            setErrorMessage(errorAfterChange);
        }

        if (isInitialRender) {
            setIsInitialRender(false);
        }
    }, [value, ...additionalValidationDependencies]);

    function resetControlState(value: ValueType) {
        setInitialValue(value);
        setValue(value);
        setIsTouched(false);
    }

    return {
        value,
        isValid: !errorMessage,
        errorMessage,
        isTouched,
        isDirty: !isEqual(initialValue, value),
        onChange,
        markControlAsPristine,
        resetValue,
        resetControlState,
    } as IControl<ValueType, EventType>;
}
