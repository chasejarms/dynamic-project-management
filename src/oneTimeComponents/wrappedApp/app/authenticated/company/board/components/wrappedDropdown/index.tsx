import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { ChangeEvent, ReactNode } from "react";

export interface IWrappedDropdownOption {
    value: any;
    label: string;
    testId?: string;
    key?: string;
}

export interface IWrappedDropdownProps {
    value: any;
    onChange: (
        event: ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>,
        child: ReactNode
    ) => void;
    disabled?: boolean;
    label: string;
    testIds?: {
        root?: string;
        select?: string;
    };
    options: IWrappedDropdownOption[];
}

export function WrappedDropdown(props: IWrappedDropdownProps) {
    return (
        <FormControl fullWidth data-testid={props.testIds?.root}>
            <InputLabel>{props.label}</InputLabel>
            <Select
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
                data-testid={props.testIds?.select}
            >
                {props.options.map(({ value, label, testId, key }, index) => {
                    return (
                        <MenuItem
                            value={value}
                            key={key || index}
                            data-testid={testId}
                        >
                            {label}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}
