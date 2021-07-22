/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { Paper } from "@material-ui/core";
import { IWrappedButtonProps, WrappedButton } from "../wrappedButton";

export interface IBottomPageToolbarProps {
    wrappedButtonProps: IWrappedButtonProps[];
}

export function BottomPageToolbar(props: IBottomPageToolbarProps) {
    const classes = createClasses();

    return (
        <div css={classes.ticketActionBarContainer}>
            <Paper elevation={10}>
                <div css={classes.ticketFlexContainer}>
                    <div css={classes.ticketGridContainer}>
                        {props.wrappedButtonProps.map(
                            (wrappedButtonProps, index) => {
                                return (
                                    <WrappedButton
                                        key={index}
                                        {...wrappedButtonProps}
                                    />
                                );
                            }
                        )}
                    </div>
                </div>
            </Paper>
        </div>
    );
}

const createClasses = () => {
    const ticketActionBarContainer = css`
        flex: 0 0 auto;
    `;

    const ticketFlexContainer = css`
        display: flex;
        padding: 8px 16px;
        justify-content: flex-end;
    `;

    const ticketGridContainer = css`
        display: grid;
        grid-template-columns: auto;
    `;

    return {
        ticketActionBarContainer,
        ticketFlexContainer,
        ticketGridContainer,
    };
};
