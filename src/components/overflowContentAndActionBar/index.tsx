/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Paper } from "@material-ui/core";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../oneTimeComponents/wrappedApp/app/components/wrappedButton";
import React from "react";

export interface IOverflowContentAndActionBarProps {
    wrappedButtonProps: IWrappedButtonProps;
    children: React.ReactChild;
}

export function OverflowContentAndActionBar(
    props: IOverflowContentAndActionBarProps
) {
    const classes = createClasses();
    return (
        <div css={classes.container}>
            <div css={classes.contentContainer}>{props.children}</div>
            <div css={classes.actionBarContainer}>
                <Paper elevation={10}>
                    <div css={classes.actionBarInnerContainer}>
                        <WrappedButton {...props.wrappedButtonProps} />
                    </div>
                </Paper>
            </div>
        </div>
    );
}

const createClasses = () => {
    const container = css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    `;

    const actionBarContainer = css`
        flex: 0 0 auto;
    `;

    const actionBarInnerContainer = css`
        display: flex;
        padding: 8px 16px;
        justify-content: flex-end;
    `;

    const contentContainer = css`
        flex-grow: 1;
        overflow: auto;
    `;

    return {
        container,
        actionBarContainer,
        actionBarInnerContainer,
        contentContainer,
    };
};
