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
                    {props.wrappedButtonProps.map(
                        (wrappedButtonProps, index) => {
                            return (
                                <div
                                    key={index}
                                    css={classes.individualButtonContainer}
                                >
                                    <WrappedButton {...wrappedButtonProps} />
                                </div>
                            );
                        }
                    )}
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
        flex-direction: row;
    `;

    const individualButtonContainer = css`
        margin-left: 8px;
    `;

    return {
        ticketActionBarContainer,
        ticketFlexContainer,
        individualButtonContainer,
    };
};
