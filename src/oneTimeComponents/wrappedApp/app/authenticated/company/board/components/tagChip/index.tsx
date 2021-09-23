import React from "react";
import { Chip, ChipProps } from "@mui/material";

export interface ITagChipProps extends Omit<ChipProps, "label"> {
    tagName: string;
    tagColor: string;
    whiteBackground?: boolean;
    isUsedInVerticalList?: boolean;
}

export const TagChip = React.forwardRef<any, ITagChipProps>(
    (props: ITagChipProps, ref) => {
        const { tagColor, tagName, ...chipProps } = props;

        if (tagColor === "red") {
            return (
                <Chip
                    variant="outlined"
                    label={tagName}
                    ref={ref}
                    sx={{
                        borderColor: "error.light",
                        backgroundColor: props.whiteBackground
                            ? "white"
                            : undefined,
                        borderWidth: 2,
                        marginRight: props.isUsedInVerticalList ? "auto" : 0,
                        marginBottom: props.isUsedInVerticalList ? 1 : 0,
                    }}
                    {...chipProps}
                />
            );
        } else if (tagColor === "blue") {
            return (
                <Chip
                    variant="outlined"
                    label={tagName}
                    ref={ref}
                    sx={{
                        borderColor: "info.light",
                        backgroundColor: props.whiteBackground
                            ? "white"
                            : undefined,
                        borderWidth: 2,
                        marginRight: props.isUsedInVerticalList ? "auto" : 0,
                        marginBottom: props.isUsedInVerticalList ? 1 : 0,
                    }}
                    {...chipProps}
                />
            );
        } else if (tagColor === "green") {
            return (
                <Chip
                    variant="outlined"
                    label={tagName}
                    ref={ref}
                    sx={{
                        borderColor: "success.light",
                        backgroundColor: props.whiteBackground
                            ? "white"
                            : undefined,
                        borderWidth: 2,
                        marginRight: props.isUsedInVerticalList ? "auto" : 0,
                        marginBottom: props.isUsedInVerticalList ? 1 : 0,
                    }}
                    {...chipProps}
                />
            );
        } else if (tagColor === "yellow") {
            return (
                <Chip
                    variant="outlined"
                    label={tagName}
                    ref={ref}
                    sx={{
                        borderColor: "warning.light",
                        backgroundColor: props.whiteBackground
                            ? "white"
                            : undefined,
                        borderWidth: 2,
                        marginRight: props.isUsedInVerticalList ? "auto" : 0,
                        marginBottom: props.isUsedInVerticalList ? 1 : 0,
                    }}
                    {...chipProps}
                />
            );
        } else {
            return (
                <Chip
                    variant="outlined"
                    label={tagName}
                    ref={ref}
                    sx={{
                        borderWidth: 2,
                        backgroundColor: props.whiteBackground
                            ? "white"
                            : undefined,
                        marginRight: props.isUsedInVerticalList ? "auto" : 0,
                        marginBottom: props.isUsedInVerticalList ? 1 : 0,
                    }}
                    {...chipProps}
                />
            );
        }
    }
);
