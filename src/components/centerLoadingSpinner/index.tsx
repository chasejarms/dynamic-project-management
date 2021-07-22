/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { CircularProgress } from "@material-ui/core";

export interface ICenterLoadingSpinnerProps {
    size: "small" | "large";
}

export function CenterLoadingSpinner(props: ICenterLoadingSpinnerProps) {
    const classes = createClasses();
    const sizeFromSizeProp = props.size === "small" ? 24 : 36;

    return (
        <div css={classes.container}>
            <CircularProgress
                color="primary"
                size={sizeFromSizeProp}
                thickness={4}
            />
        </div>
    );
}

function createClasses() {
    const container = css`
        width: 100%;
        height: 100%;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        display: flex;
    `;

    return {
        container,
    };
}
