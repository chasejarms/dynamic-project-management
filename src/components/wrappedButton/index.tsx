/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ButtonProps, Button, CircularProgress } from "@material-ui/core";

export interface IWrappedButtonProps
    extends Pick<
        ButtonProps,
        "onClick" | "color" | "variant" | "disabled" | "children" | "startIcon"
    > {
    showSpinner?: boolean;
}

export function WrappedButton(props: IWrappedButtonProps) {
    const { showSpinner, ...rest } = props;

    const { buttonContainer, spinnerContainer } = createClasses();

    return (
        <div css={buttonContainer}>
            {props.showSpinner && (
                <div css={spinnerContainer}>
                    <CircularProgress color="primary" size={24} thickness={4} />
                </div>
            )}
            <Button {...rest} />
        </div>
    );
}

const createClasses = () => {
    const buttonContainer = css`
        position: relative;
    `;

    const spinnerContainer = css`
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    return {
        buttonContainer,
        spinnerContainer,
    };
};
