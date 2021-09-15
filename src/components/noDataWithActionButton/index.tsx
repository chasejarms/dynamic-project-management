/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { makeStyles, Typography } from "@material-ui/core";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../oneTimeComponents/components/wrappedButton";

export interface INoDataWithActionButtonProps {
    text: string;
    wrappedButtonProps?: IWrappedButtonProps;
}

const useStyles = makeStyles({
    noImagesText: {
        textAlign: "center",
    },
});

export function NoDataWithActionButton(props: INoDataWithActionButtonProps) {
    const classes = createClasses();
    const materialClasses = useStyles();
    return (
        <div css={classes.centerContainer}>
            <div css={classes.noTicketsContainer}>
                <Typography
                    variant="h6"
                    className={materialClasses.noImagesText}
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
