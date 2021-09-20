/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";

export interface IBoardColumnsContainerProps {
    children: React.ReactNode;
    removeTopPadding?: boolean;
}

export function BoardColumnsContainer(props: IBoardColumnsContainerProps) {
    const classes = createClasses(!!props.removeTopPadding);
    return (
        <div css={classes.container}>
            <div css={classes.columnsContainer}>{props.children}</div>
        </div>
    );
}

const createClasses = (removeTopPadding: boolean) => {
    const container = css`
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    `;

    const columnsContainer = css`
        width: 100%;
        overflow-x: auto;
        display: flex;
        flex-grow: 1;
        padding: ${removeTopPadding ? 0 : 16}px 24px 24px 24px;
    `;

    return {
        container,
        columnsContainer,
    };
};
