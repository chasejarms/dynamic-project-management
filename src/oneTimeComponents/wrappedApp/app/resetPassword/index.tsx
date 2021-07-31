/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography, Snackbar } from "@material-ui/core";
import { ChangeEvent, useState } from "react";
import * as AWSCognitoIdentity from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import { ControlValidator } from "../../../../classes/ControlValidator";
import { NonAuthenticatedPageContainer } from "../../../../components/nonAuthenticatedPageContainer";
import { WrappedButton } from "../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../components/wrappedTextField";
import { useControl } from "../../../../hooks/useControl";
import { controlsAreValid } from "../../../../utils/controlsAreValid";
import { useHistory } from "react-router-dom";

export function ResetPassword() {
    const emailControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (email: string) => {
            return ControlValidator.string()
                .required("This field is required")
                .email("A valid email is required")
                .validate(email);
        },
    });
    const showEmailError = !emailControl.isValid && emailControl.isTouched;

    const classes = createClasses();

    const [isTriggeringPasswordReset, setIsTriggeringPasswordReset] = useState(
        false
    );
    function triggerSignIn() {
        setIsTriggeringPasswordReset(true);
    }

    const controlsAreInvalid = !controlsAreValid(emailControl);

    const [snackbarMetadata, setSnackbarMetadata] = useState({
        open: false,
        message: "",
    });
    function onCloseSnackbar() {
        setSnackbarMetadata((previousSnackbarMetadata) => {
            return {
                ...previousSnackbarMetadata,
                open: false,
            };
        });
    }

    return (
        <NonAuthenticatedPageContainer makeFullPage>
            <div css={classes.pageContainer}>
                <div css={classes.credentialsContainer}>
                    <div css={classes.signUpContainer}>
                        <Typography variant="h5">Sign In</Typography>
                    </div>
                    <WrappedTextField
                        value={emailControl.value}
                        label="Email"
                        onChange={emailControl.onChange}
                        error={showEmailError ? emailControl.errorMessage : ""}
                    />
                    <div css={classes.signInButtonContainer}>
                        <WrappedButton
                            variant="contained"
                            color="primary"
                            onClick={triggerSignIn}
                            disabled={controlsAreInvalid}
                            showSpinner={false}
                        >
                            Reset Password
                        </WrappedButton>
                    </div>
                    <Snackbar
                        open={snackbarMetadata.open}
                        onClose={onCloseSnackbar}
                        message={snackbarMetadata.message}
                    />
                </div>
            </div>
        </NonAuthenticatedPageContainer>
    );
}

const createClasses = () => {
    const pageContainer = css`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const credentialsContainer = css`
        width: 300px;
        display: grid;
    `;

    const signInButtonContainer = css`
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
    `;

    const signUpContainer = css`
        margin-bottom: 16px;
    `;

    return {
        pageContainer,
        credentialsContainer,
        signInButtonContainer,
        signUpContainer,
    };
};
