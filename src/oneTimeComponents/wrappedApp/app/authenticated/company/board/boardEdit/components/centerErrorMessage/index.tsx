/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Theme, Typography, useTheme } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

export interface ICenterErrorMessageProps {
    message: string;
}

export function CenterErrorMessage(props: ICenterErrorMessageProps) {
    const classes = createClasses();
    const theme = useTheme();
    return (
        <div css={classes.centerErrorMessage}>
            <div css={classes.innerContainer}>
                <ErrorOutline
                    sx={{
                        bgcolor: "error.main",
                    }}
                    fontSize="large"
                />
                <div css={classes.messageContainer}>
                    <Typography>{props.message}</Typography>
                </div>
            </div>
        </div>
    );
}

const createClasses = () => {
    const centerErrorMessage = css`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const innerContainer = css`
        display: grid;
        grid-template-columns: auto auto;
        grid-gap: 8px;
    `;

    const messageContainer = css`
        display: flex;
        align-items: center;
    `;

    return {
        centerErrorMessage,
        innerContainer,
        messageContainer,
    };
};
