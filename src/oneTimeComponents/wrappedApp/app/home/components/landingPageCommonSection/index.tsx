/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Theme, Typography, useTheme } from "@material-ui/core";
import React from "react";
import { useBreakpoint } from "../../../../../../hooks/useBreakpoint";
import { composeCSS } from "../../../../../../styles/composeCSS";
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
    const theme = useTheme();
    const classes = createClasses(theme, !!props.hideTopAndBottomPadding);
    const content = (
        <div>
            <div css={classes.bottomMargin32}>
                <Typography variant="h4">{props.title}</Typography>
            </div>
            {props.textSections.map((text, index) => {
                return (
                    <div css={classes.bottomMargin24} key={index}>
                        <Typography>{text}</Typography>
                    </div>
                );
            })}
            {!!props.wrappedButtonProps?.length && (
                <div css={classes.wrappedButtonContainer}>
                    {props.wrappedButtonProps.map((buttonProps, index) => {
                        const isNotLastButton =
                            index !== props.wrappedButtonProps!.length - 1;
                        return (
                            <div
                                css={composeCSS(
                                    isNotLastButton && classes.buttonMarginRight
                                )}
                            >
                                <WrappedButton {...buttonProps} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    return (
        <div
            css={composeCSS(
                classes.container,
                props.placeContent === "left" && classes.containerLeftContent,
                props.placeContent === "right" && classes.containerRightContent,
                breakpoints.max768 && classes.smallGridTemplateColumns
            )}
        >
            {(breakpoints.max768 || props.placeContent === "left") && content}
            <div
                css={composeCSS(
                    classes.svgContentContainer,
                    breakpoints.max768 && classes.svgContainerSmallPadding
                )}
            >
                {props.svgContent}
            </div>
            {props.placeContent === "right" && !breakpoints.max768 && content}
        </div>
    );
}

const createClasses = (theme: Theme, hideTopAndBottomPadding: boolean) => {
    const fourTimes = theme.spacing() * 4;
    const sixTimes = theme.spacing() * 6;

    const paddingTop = hideTopAndBottomPadding ? 0 : sixTimes;
    const paddingBottom = hideTopAndBottomPadding ? 0 : sixTimes;
    const container = css`
        padding-top: ${paddingTop}px;
        padding-right: ${fourTimes}px;
        padding-bottom: ${paddingBottom}px;
        padding-left: ${fourTimes}px;
        display: grid;
        grid-gap: ${theme.spacing() * 3}px;
        width: 100vw;
    `;

    const containerLeftContent = css`
        grid-template-columns: 3fr 2fr;
    `;

    const containerRightContent = css`
        grid-template-columns: 2fr 3fr;
    `;

    const smallGridTemplateColumns = css`
        grid-template-columns: 1fr;
        padding-left: ${theme.spacing() * 3}px;
        padding-right: ${theme.spacing() * 3}px;
        padding-bottom: 0px;
    `;

    const bottomMargin24 = css`
        margin-bottom: ${theme.spacing() * 3}px;
    `;

    const bottomMargin32 = css`
        margin-bottom: ${theme.spacing() * 4}px;
    `;

    const wrappedButtonContainer = css`
        display: flex;
        justify-content: flex-start;
    `;

    const buttonMarginRight = css`
        margin-right: 8px;
    `;

    const svgContentContainer = css`
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const svgInnerContainer = css`
        position: absolute;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const svgContainerSmallPadding = css`
        padding-top: ${theme.spacing() * 3}px;
    `;

    return {
        container,
        bottomMargin24,
        containerLeftContent,
        containerRightContent,
        bottomMargin32,
        wrappedButtonContainer,
        buttonMarginRight,
        svgContentContainer,
        svgInnerContainer,
        smallGridTemplateColumns,
        svgContainerSmallPadding,
    };
};
