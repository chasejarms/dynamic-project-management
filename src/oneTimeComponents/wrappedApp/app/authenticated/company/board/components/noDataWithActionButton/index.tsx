/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography } from "@mui/material";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../../components/wrappedButton";

export interface INoDataWithActionButtonProps {
    text: string;
    wrappedButtonProps?: IWrappedButtonProps;
}

export function NoDataWithActionButton(props: INoDataWithActionButtonProps) {
    const classes = createClasses();
    return (
        <div css={classes.centerContainer}>
            <div css={classes.noTicketsContainer}>
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: "center",
                    }}
                >
                    {props.text}
                </Typography>
                {!!props.wrappedButtonProps && (
                    <div css={classes.wrappedButtonContainer}>
                        <WrappedButton {...props.wrappedButtonProps} />
                    </div>
                )}
            </div>
        </div>
    );
}

const createClasses = () => {
    const centerContainer = css`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const noTicketsContainer = css`
        display: flex;
        width: 300px;
        flex-direction: column;
    `;

    const wrappedButtonContainer = css`
        margin-top: 16px;
        width: 100%;
        display: flex;
        justify-content: center;
    `;

    return {
        centerContainer,
        noTicketsContainer,
        wrappedButtonContainer,
    };
};
