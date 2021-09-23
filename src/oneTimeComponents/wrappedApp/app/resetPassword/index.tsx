import { Typography, Snackbar, Box } from "@mui/material";
import { useEffect, useState } from "react";
import * as AWSCognitoIdentity from "amazon-cognito-identity-js";
import { NonAuthenticatedPageContainer } from "../components/nonAuthenticatedPageContainer";
import { WrappedButton } from "../components/wrappedButton";
import { WrappedTextField } from "../components/wrappedTextField";
import { controlsAreValid } from "../utils/controlsAreValid";
import { userPool } from "../../../../classes/UserPool";
import { useHistory } from "react-router-dom";
import { cognitoUserSingleton } from "../../../../classes/CognitoUserSingleton";
import { useEmailControl } from "../hooks/useEmailControl";
import { RouteCreator } from "../utils/routeCreator";

export function ResetPassword() {
    const history = useHistory();
    const { emailControl, showEmailError } = useEmailControl();

    const [isTriggeringPasswordReset, setIsTriggeringPasswordReset] = useState(
        false
    );
    function triggerResetPassword() {
        setIsTriggeringPasswordReset(true);
    }

    useEffect(() => {
        if (!isTriggeringPasswordReset) return;

        let didCancel = false;

        const userData = {
            Username: emailControl.value,
            Pool: userPool,
        };
        cognitoUserSingleton.cognitoUser = new AWSCognitoIdentity.CognitoUser(
            userData
        );
        cognitoUserSingleton.cognitoUser.forgotPassword({
            onSuccess: (data) => {
                const route = RouteCreator.enterNewPassword();
                history.push(route);
            },
            onFailure: (error) => {
                console.log("error: ", error);
            },
        });

        return () => {
            didCancel = true;
        };
    }, [isTriggeringPasswordReset]);

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
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        width: "300px",
                    }}
                >
                    <Box
                        sx={{
                            marginBottom: 2,
                        }}
                    >
                        <Typography variant="h5">Reset Password</Typography>
                    </Box>
                    <WrappedTextField
                        value={emailControl.value}
                        label="Email"
                        onChange={emailControl.onChange}
                        error={showEmailError ? emailControl.errorMessage : ""}
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
                            onClick={triggerResetPassword}
                            disabled={
                                controlsAreInvalid || isTriggeringPasswordReset
                            }
                            showSpinner={isTriggeringPasswordReset}
                        >
                            Reset Password
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
