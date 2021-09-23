import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { generateUniqueId } from "../../boardEdit/utils/generateUniqueId";

export interface IWrappedDropdownOption {
    value: any;
    label: string;
    testId?: string;
    key?: string;
}

export interface IWrappedDropdownProps {
    value: any;
    onChange: (event: SelectChangeEvent<any>) => void;
    disabled?: boolean;
    label: string;
    testIds?: {
        root?: string;
        select?: string;
    };
    options: IWrappedDropdownOption[];
}

export function WrappedDropdown(props: IWrappedDropdownProps) {
    const [uniqueId] = useState(generateUniqueId());

    return (
        <FormControl fullWidth data-testid={props.testIds?.root}>
            <InputLabel id={uniqueId}>{props.label}</InputLabel>
            <Select
                labelId={uniqueId}
                label={props.label}
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
                data-testid={props.testIds?.select}
                variant="outlined"
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
