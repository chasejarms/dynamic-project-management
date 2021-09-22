/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { Paper } from "@mui/material";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../components/wrappedButton";

export interface IBottomPageToolbarProps {
    wrappedButtonProps: IWrappedButtonProps[];
    leftContent?: React.ReactNode;
}

export function BottomPageToolbar(props: IBottomPageToolbarProps) {
    const classes = createClasses();

    return (
        <div css={classes.ticketActionBarContainer}>
            <Paper elevation={10}>
                <div css={classes.ticketFlexContainer}>
                    <div>{props.leftContent}</div>
                    <div css={classes.buttonsContainer}>
                        {props.wrappedButtonProps.map(
                            (wrappedButtonProps, index) => {
                                return (
                                    <div
                                        key={index}
                                        css={classes.individualButtonContainer}
                                    >
                                        <WrappedButton
                                            {...wrappedButtonProps}
                                        />
                                    </div>
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
        justify-content: space-between;
        flex-direction: row;
    `;

    const individualButtonContainer = css`
        margin-left: 8px;
    `;

    const buttonsContainer = css`
        display: flex;
        flex-direction: row;
    `;

    return {
        ticketActionBarContainer,
        ticketFlexContainer,
        individualButtonContainer,
        buttonsContainer,
    };
};
