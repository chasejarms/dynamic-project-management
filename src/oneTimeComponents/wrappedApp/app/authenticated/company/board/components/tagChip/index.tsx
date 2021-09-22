/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { Chip, ChipProps, Theme, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export interface ITagChipProps extends Omit<ChipProps, "label"> {
    tagName: string;
    tagColor: string;
    whiteBackground?: boolean;
    isUsedInVerticalList?: boolean;
}

interface IUseStylesProps {
    theme: Theme;
    whiteBackground: boolean;
    isUsedInVerticalList: boolean;
}

const useStyles = makeStyles({
    chipRed: (props: IUseStylesProps) => ({
        borderColor: props.theme.palette.error.light,
        backgroundColor: props.whiteBackground ? "white" : undefined,
        borderWidth: "2px",
        marginRight: props.isUsedInVerticalList ? "auto" : "0px",
        marginBottom: props.isUsedInVerticalList ? "8px" : "0px",
    }),
    chipGreen: (props: IUseStylesProps) => ({
        borderColor: props.theme.palette.success.light,
        backgroundColor: props.whiteBackground ? "white" : undefined,
        borderWidth: "2px",
        marginRight: props.isUsedInVerticalList ? "auto" : "0px",
        marginBottom: props.isUsedInVerticalList ? "8px" : "0px",
    }),
    chipBlue: (props: IUseStylesProps) => ({
        borderColor: props.theme.palette.info.light,
        backgroundColor: props.whiteBackground ? "white" : undefined,
        borderWidth: "2px",
        marginRight: props.isUsedInVerticalList ? "auto" : "0px",
        marginBottom: props.isUsedInVerticalList ? "8px" : "0px",
    }),
    chipYellow: (props: IUseStylesProps) => ({
        borderColor: props.theme.palette.warning.light,
        backgroundColor: props.whiteBackground ? "white" : undefined,
        borderWidth: "2px",
        marginRight: props.isUsedInVerticalList ? "auto" : "0px",
        marginBottom: props.isUsedInVerticalList ? "8px" : "0px",
    }),
    chipGray: (props: IUseStylesProps) => ({
        borderWidth: "2px",
        backgroundColor: props.whiteBackground ? "white" : undefined,
        marginRight: props.isUsedInVerticalList ? "auto" : "0px",
        marginBottom: props.isUsedInVerticalList ? "8px" : "0px",
    }),
    whiteBackground: {
        backgroundColor: "white",
    },
});

export const TagChip = React.forwardRef<any, ITagChipProps>(
    (props: ITagChipProps, ref) => {
        const theme = useTheme();
        const materialClasses = useStyles({
            theme,
            whiteBackground: !!props.whiteBackground,
            isUsedInVerticalList: !!props.isUsedInVerticalList,
        });
        const { tagColor, tagName, ...chipProps } = props;

        const chipClass = (function () {
            if (tagColor === "red") {
                return materialClasses.chipRed;
            } else if (tagColor === "blue") {
                return materialClasses.chipBlue;
            } else if (tagColor === "green") {
                return materialClasses.chipGreen;
            } else if (tagColor === "yellow") {
                return materialClasses.chipYellow;
            } else {
                return materialClasses.chipGray;
            }
        })();

        return (
            <Chip
                variant="outlined"
                label={tagName}
                ref={ref}
                className={chipClass}
                {...chipProps}
            />
        );
    }
);
