/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Theme, Typography, useTheme } from "@material-ui/core";
import React from "react";
import { composeCSS } from "../../styles/composeCSS";

export interface ILandingPageCommonSectionProps {
    title: string;
    textSections: string[];
    placeContent: "left" | "right";
}

export function LandingPageCommonSection(
    props: ILandingPageCommonSectionProps
) {
    const theme = useTheme();
    const classes = createClasses(theme);
    const content = (
        <div>
            <div css={classes.bottomMargin32}>
                <Typography variant="h4">{props.title}</Typography>
            </div>
            {props.textSections.map((text) => {
                return (
                    <div css={classes.bottomMargin24}>
                        <Typography>{text}</Typography>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div
            css={composeCSS(
                classes.container,
                props.placeContent === "left" && classes.containerLeftContent,
                props.placeContent === "right" && classes.containerRightContent
            )}
        >
            {props.placeContent === "left" && content}
            <div>
                <Typography>Screenshot of course here</Typography>
            </div>
            {props.placeContent === "right" && content}
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const container = css`
        padding-top: ${theme.spacing() * 10}px;
        padding-bottom: ${theme.spacing() * 6}px;
        display: grid;
        grid-gap: ${theme.spacing() * 3}px;
    `;

    const containerLeftContent = css`
        grid-template-columns: 3fr 2fr;
    `;

    const containerRightContent = css`
        grid-template-columns: 2fr 3fr;
    `;

    const bottomMargin24 = css`
        margin-bottom: ${theme.spacing() * 3}px;
    `;

    const bottomMargin32 = css`
        margin-bottom: ${theme.spacing() * 4}px;
    `;

    return {
        container,
        bottomMargin24,
        containerLeftContent,
        containerRightContent,
        bottomMargin32,
    };
};
