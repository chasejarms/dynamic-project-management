import { Typography, Box } from "@mui/material";
import React from "react";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../components/wrappedButton";

export interface ILandingPageCommonSectionProps {
    title: string;
    textSections: string[];
    placeContent: "left" | "right";
    hideTopAndBottomPadding?: boolean;
    wrappedButtonProps?: IWrappedButtonProps[];
    svgContent?: React.ReactChild;
}

export function LandingPageCommonSection(
    props: ILandingPageCommonSectionProps
) {
    const breakpoints = useBreakpoint();
    const content = (
        <div>
            <Box
                sx={{
                    marginBottom: 4,
                }}
            >
                <Typography variant="h4">{props.title}</Typography>
            </Box>
            {props.textSections.map((text, index) => {
                return (
                    <Box
                        sx={{
                            marginBottom: 3,
                        }}
                        key={index}
                    >
                        <Typography>{text}</Typography>
                    </Box>
                );
            })}
            {!!props.wrappedButtonProps?.length && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                    }}
                >
                    {props.wrappedButtonProps.map((buttonProps, index) => {
                        const isNotLastButton =
                            index !== props.wrappedButtonProps!.length - 1;
                        return (
                            <Box
                                sx={{
                                    marginRight: isNotLastButton ? 1 : 0,
                                }}
                            >
                                <WrappedButton {...buttonProps} />
                            </Box>
                        );
                    })}
                </Box>
            )}
        </div>
    );

    const hideTopAndBottomPadding = !!props.hideTopAndBottomPadding;
    const placeContentLeft = props.placeContent === "left";
    const gridTemplateColumns = breakpoints.max768
        ? "1fr"
        : placeContentLeft
        ? "3fr 2fr"
        : "2fr 3fr";

    return (
        <Box
            sx={{
                paddingTop: hideTopAndBottomPadding ? 0 : 6,
                px: breakpoints.max768 ? 3 : 4,
                paddingBottom:
                    hideTopAndBottomPadding || breakpoints.max768 ? 0 : 6,
                display: "grid",
                gap: 3,
                width: "100vw",
                gridTemplateColumns,
            }}
        >
            {(breakpoints.max768 || props.placeContent === "left") && content}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: breakpoints.max768 ? 3 : 0,
                }}
            >
                {props.svgContent}
            </Box>
            {props.placeContent === "right" && !breakpoints.max768 && content}
        </Box>
    );
}
