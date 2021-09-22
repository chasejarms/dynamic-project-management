/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ButtonProps, Button, CircularProgress } from "@material-ui/core";

export interface IWrappedButtonProps extends ButtonProps {
    showSpinner?: boolean;
    component?: string;
    testIds?: {
        button?: string;
        spinner?: string;
    };
}

export function WrappedButton(props: IWrappedButtonProps) {
    const { showSpinner, testIds, ...rest } = props;

    const { buttonContainer, spinnerContainer } = createClasses();

    return (
        <div css={buttonContainer}>
            {props.showSpinner && (
                <div css={spinnerContainer} data-testid={testIds?.spinner}>
                    <CircularProgress color="primary" size={24} thickness={4} />
                </div>
            )}
            <Button {...rest} data-testid={testIds?.button} />
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
