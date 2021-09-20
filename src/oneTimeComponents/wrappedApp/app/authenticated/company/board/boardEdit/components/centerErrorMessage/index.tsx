/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { makeStyles, Theme, Typography, useTheme } from "@material-ui/core";
import { ErrorOutline } from "@material-ui/icons";

export interface ICenterErrorMessageProps {
    message: string;
}

const useStyles = makeStyles({
    errorOutline: (theme: Theme) => ({
        color: theme.palette.error.main,
    }),
});

export function CenterErrorMessage(props: ICenterErrorMessageProps) {
    const classes = createClasses();
    const theme = useTheme();
    const materialClasses = useStyles(theme);
    return (
        <div css={classes.centerErrorMessage}>
            <div css={classes.innerContainer}>
                <ErrorOutline
                    className={materialClasses.errorOutline}
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
