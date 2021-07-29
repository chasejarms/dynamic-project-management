/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { IconButton } from "@material-ui/core";
import React from "react";
import { Add, DeleteForever } from "@material-ui/icons";
import { composeCSS } from "../../styles/composeCSS";

export interface IAddDeleteSectionWrapperProps {
    children: React.ReactChild;
    onClickAddAfter: () => void;
    disabled: boolean;
    onClickDelete?: () => void;
    customCalcLeftPixels?: number;
}

export function AddDeleteSectionWrapper(props: IAddDeleteSectionWrapperProps) {
    const classes = createClasses();

    return (
        <div css={classes.container}>
            {props.children}
            <div
                css={composeCSS(
                    classes.actionButtonContainer,
                    !!props.customCalcLeftPixels &&
                        css`
                            left: calc(100% + ${props.customCalcLeftPixels}px);
                        `
                )}
            >
                <IconButton
                    disabled={props.disabled}
                    onClick={props.onClickAddAfter}
                    color="primary"
                >
                    <Add />
                </IconButton>
                {!!props.onClickDelete && (
                    <IconButton
                        disabled={props.disabled}
                        onClick={props.onClickDelete}
                        color="primary"
                    >
                        <DeleteForever />
                    </IconButton>
                )}
            </div>
        </div>
    );
}

const createClasses = () => {
    const container = css`
        position: relative;
        width: 100%;
    `;

    const actionButtonContainer = css`
        position: absolute;
        left: calc(100% + 30px);
        top: 12px;
        display: flex;
        flex-direction: row;
    `;

    return {
        container,
        actionButtonContainer,
    };
};
