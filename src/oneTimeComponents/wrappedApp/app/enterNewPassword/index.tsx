/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography, Snackbar } from "@material-ui/core";
import { ChangeEvent, useEffect, useState } from "react";
import { StringValidator } from "../../../../classes/StringValidator";
import { NonAuthenticatedPageContainer } from "../../../../components/nonAuthenticatedPageContainer";
import { WrappedButton } from "../components/wrappedButton";
import { WrappedTextField } from "../components/wrappedTextField";
import { useControl } from "../../../../hooks/useControl";
import { controlsAreValid } from "../../../../utils/controlsAreValid";
import { useHistory } from "react-router-dom";
import { cognitoUserSingleton } from "../../../../classes/CognitoUserSingleton";

export function EnterNewPassword() {
    const history = useHistory();
    useEffect(() => {
        if (cognitoUserSingleton.cognitoUser.getUsername() === "") {
            history.push("/reset-password");
        }
    }, []);

    const verificationCodeControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (email: string) => {
            return new StringValidator()
                .required("This field is required")
                .validate(email);
        },
    });
    const showVerificationCodeControlError =
        !verificationCodeControl.isValid && verificationCodeControl.isTouched;

    const passwordControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (password: string) => {
            return new StringValidator()
                .required("A password is required")
                .min(8, "Password length must be at least 8 characters")
                .customValidator((value: string) => {
                    return value.toUpperCase() !== value;
                }, "Password must have one lowercase character")
                .customValidator((value: string) => {
                    return value.toLowerCase() !== value;
                }, "Password must have one uppercase character")
                .customValidator((value: string) => {
                    return !!value.match(/\d/);
                }, "Password must have at least one number")
                .validate(password);
        },
    });
    const showPasswordError =
        !passwordControl.isValid && passwordControl.isTouched;

    const classes = createClasses();

    const [isConfirmingNewPassword, setIsConfirmingNewPassword] = useState(
        false
    );
    function triggerConfirmNewPassword() {
        setIsConfirmingNewPassword(true);
    }

    useEffect(() => {
        if (!isConfirmingNewPassword) return;

        let didCancel = false;

        cognitoUserSingleton.cognitoUser.confirmPassword(
            verificationCodeControl.value,
            passwordControl.value,
            {
                onSuccess: () => {
                    if (didCancel) return;
                    setIsConfirmingNewPassword(false);
                    history.push("/sign-in");
                },
                onFailure: (error) => {
                    if (didCancel) return;
                    setIsConfirmingNewPassword(false);
                    console.log("error: ", error);
                },
            }
        );

        return () => {
            didCancel = true;
        };
    }, [isConfirmingNewPassword]);

    const controlsAreInvalid = !controlsAreValid(
        verificationCodeControl,
        passwordControl
    );

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
                        <Typography variant="h5">
                            Enter Verification Code
                        </Typography>
                    </div>
                    <div css={classes.infoContainer}>
                        <Typography>
                            A verification code has been sent to{" "}
                            {cognitoUserSingleton.cognitoUser.getUsername()}. To
                            reset your password, enter the verification code as
                            well as the updated password.
                        </Typography>
                    </div>
                    <WrappedTextField
                        value={verificationCodeControl.value}
                        label="Verification Code"
                        onChange={verificationCodeControl.onChange}
                        error={
                            showVerificationCodeControlError
                                ? verificationCodeControl.errorMessage
                                : ""
                        }
                    />
                    <WrappedTextField
                        type="password"
                        value={passwordControl.value}
                        label="New Password"
                        onChange={passwordControl.onChange}
                        error={
                            showPasswordError
                                ? passwordControl.errorMessage
                                : ""
                        }
                    />
                    <div css={classes.signInButtonContainer}>
                        <WrappedButton
                            variant="contained"
                            color="primary"
                            onClick={triggerConfirmNewPassword}
                            disabled={
                                controlsAreInvalid || isConfirmingNewPassword
                            }
                            showSpinner={isConfirmingNewPassword}
                        >
                            Confirm New Password
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

    const infoContainer = css`
        margin-bottom: 16px;
    `;

    return {
        pageContainer,
        credentialsContainer,
        signInButtonContainer,
        signUpContainer,
        infoContainer,
    };
};
