import { Typography, Snackbar, Box } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { StringValidator } from "../../../../classes/StringValidator";
import { NonAuthenticatedPageContainer } from "../components/nonAuthenticatedPageContainer";
import { WrappedButton } from "../components/wrappedButton";
import { WrappedTextField } from "../components/wrappedTextField";
import { useControl } from "../hooks/useControl";
import { controlsAreValid } from "../utils/controlsAreValid";
import { useHistory } from "react-router-dom";
import { cognitoUserSingleton } from "../../../../classes/CognitoUserSingleton";
import { RouteCreator } from "../utils/routeCreator";

export function EnterNewPassword() {
    const history = useHistory();
    useEffect(() => {
        if (cognitoUserSingleton.cognitoUser.getUsername() === "") {
            const route = RouteCreator.resetPassword();
            history.push(route);
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
                    const route = RouteCreator.signIn();
                    history.push(route);
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
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        width: "300px",
                        display: "grid",
                    }}
                >
                    <Box
                        sx={{
                            marginBottom: 2,
                        }}
                    >
                        <Typography variant="h5">
                            Enter Verification Code
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            marginBottom: 2,
                        }}
                    >
                        <Typography>
                            A verification code has been sent to{" "}
                            {cognitoUserSingleton.cognitoUser.getUsername()}. To
                            reset your password, enter the verification code as
                            well as the updated password.
                        </Typography>
                    </Box>
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
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 2,
                        }}
                    >
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
                    </Box>
                    <Snackbar
                        open={snackbarMetadata.open}
                        onClose={onCloseSnackbar}
                        message={snackbarMetadata.message}
                    />
                </Box>
            </Box>
        </NonAuthenticatedPageContainer>
    );
}
