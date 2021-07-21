/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";

export interface IFullPageContainerProps {
    children: React.ReactChild;
}

export function FullPageContainer(props: IFullPageContainerProps) {
    const classes = createClasses();

    return <div css={classes.container}>{props.children}</div>;
}

const createClasses = () => {
    const container = css`
        height: 100vh;
        width: 100vw;
        display: flex;
    `;

    return {
        container,
    };
};
