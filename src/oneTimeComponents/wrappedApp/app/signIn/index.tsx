/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Typography,
    Snackbar,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core";
import { ChangeEvent, useState, useEffect } from "react";
import * as AWSCognitoIdentity from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import { StringValidator } from "../../../../classes/StringValidator";
import { userPool } from "../../../../classes/UserPool";
import { NonAuthenticatedPageContainer } from "../components/nonAuthenticatedPageContainer";
import { WrappedButton } from "../components/wrappedButton";
import { WrappedTextField } from "../components/wrappedTextField";
import { useControl } from "../hooks/useControl";
import { controlsAreValid } from "../utils/controlsAreValid";
import { useHistory } from "react-router-dom";
import { cognitoUserSingleton } from "../../../../classes/CognitoUserSingleton";
import { useEmailControl } from "../hooks/useEmailControl";
import { usePasswordCreationControl } from "../hooks/usePasswordCreationControl";

const useStyles = makeStyles({
    resetPasswordText: (theme: Theme) => ({
        color: theme.palette.primary.main,
        cursor: "pointer",
        position: "relative",
        top: "8px",
    }),
});

export function SignIn() {
    const history = useHistory();

    const { emailControl, showEmailError } = useEmailControl();
    const {
        passwordCreationControl,
        showPasswordCreationError,
    } = usePasswordCreationControl();

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
                .validate(password);
        },
    });
    const showPasswordError =
        !passwordControl.isValid && passwordControl.isTouched;

    const classes = createClasses();
    const theme = useTheme();
    const materialClasses = useStyles(theme);

    const [isSigningIn, setIsSigningIn] = useState(false);
    function triggerSignIn() {
        setIsSigningIn(true);
    }

    const [sessionUserAttributes, setSessionUserAttributes] = useState<any>();

    useEffect(() => {
        if (!isSigningIn) return;

        let didCancel = false;

        const authenticationData = {
            Username: emailControl.value,
            Password: passwordControl.value,
        };
        const authenticationDetails = new AWSCognitoIdentity.AuthenticationDetails(
            authenticationData
        );

        const userData = {
            Username: emailControl.value,
            Pool: userPool,
        };
        cognitoUserSingleton.cognitoUser = new AWSCognitoIdentity.CognitoUser(
            userData
        );
        cognitoUserSingleton.cognitoUser.authenticateUser(
            authenticationDetails,
            {
                onSuccess: function (result) {
                    if (didCancel) return;

                    AWS.config.region = "us-east-1";
                    const token = result.getIdToken().getJwtToken();

                    localStorage.setItem("token", token);
                    localStorage.setItem("userEmail", emailControl.value);
                    history.push("/app/companies");
                },
                onFailure: function (err) {
                    if (didCancel) return;
                    setIsSigningIn(false);
                    console.log("err: ", err);

                    if (!err || !err.code) return;

                    if (err.code === "UserNotConfirmedException") {
                        setSnackbarMetadata({
                            open: true,
                            message:
                                "Your email needs to be verified. After verifying your email, please log in again.",
                        });
                    }

                    if (err.code === "NotAuthorizedException") {
                        setSnackbarMetadata({
                            open: true,
                            message: "Incorrect username or password",
                        });
                    }
                },
                newPasswordRequired: (userAttributes, requiredAttributes) => {
                    setSessionUserAttributes(userAttributes);
                },
            }
        );

        return () => {
            didCancel = true;
        };
    }, [isSigningIn]);

    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    useEffect(() => {
        if (!isUpdatingPassword) return;

        let didCancel = false;

        cognitoUserSingleton.cognitoUser.completeNewPasswordChallenge(
            passwordCreationControl.value,
            sessionUserAttributes,
            {
                onSuccess: function (result) {
                    if (didCancel) return;

                    AWS.config.region = "us-east-1";
                    const token = result.getIdToken().getJwtToken();

                    localStorage.setItem("token", token);
                    localStorage.setItem("userEmail", emailControl.value);
                    history.push("/app/companies");
                },
                onFailure: function (err) {
                    if (didCancel) return;
                    setIsSigningIn(false);
                    console.log("err: ", err);

                    if (!err || !err.code) return;

                    if (err.code === "UserNotConfirmedException") {
                        setSnackbarMetadata({
                            open: true,
                            message:
                                "Your email needs to be verified. After verifying your email, please log in again.",
                        });
                    }

                    if (err.code === "NotAuthorizedException") {
                        setSnackbarMetadata({
                            open: true,
                            message: "Incorrect username or password",
                        });
                    }
                },
            }
        );

        return () => {
            didCancel = true;
        };
    }, [isUpdatingPassword]);
    function onClickUpdatePassword() {
        setIsUpdatingPassword(true);
    }

    const controlsAreInvalid = !controlsAreValid(emailControl, passwordControl);

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

    function navigateToResetPasswordPage() {
        history.push("/reset-password");
    }

    const showNewPasswordInput = !!sessionUserAttributes;

    return (
        <NonAuthenticatedPageContainer makeFullPage>
            <div css={classes.pageContainer}>
                {!showNewPasswordInput ? (
                    <div css={classes.contentMaxWidthContainer}>
                        <div css={classes.headerTextContainer}>
                            <Typography variant="h5">Sign In</Typography>
                        </div>
                        <WrappedTextField
                            value={emailControl.value}
                            label="Email"
                            onChange={emailControl.onChange}
                            error={
                                showEmailError ? emailControl.errorMessage : ""
                            }
                        />
                        <WrappedTextField
                            value={passwordControl.value}
                            label="Password"
                            onChange={passwordControl.onChange}
                            type="password"
                            error={
                                showPasswordError
                                    ? passwordControl.errorMessage
                                    : ""
                            }
                        />
                        <div css={classes.signInButtonContainer}>
                            <Typography
                                onClick={navigateToResetPasswordPage}
                                variant="caption"
                                className={materialClasses.resetPasswordText}
                            >
                                Reset Password
                            </Typography>
                            <WrappedButton
                                variant="contained"
                                color="primary"
                                onClick={triggerSignIn}
                                disabled={controlsAreInvalid || isSigningIn}
                                showSpinner={isSigningIn}
                            >
                                Sign In
                            </WrappedButton>
                        </div>
                        <Snackbar
                            open={snackbarMetadata.open}
                            onClose={onCloseSnackbar}
                            message={snackbarMetadata.message}
                        />
                        {/* TODO: probably put an error message in here to handle errors */}
                    </div>
                ) : (
                    <div css={classes.contentMaxWidthContainer}>
                        <div css={classes.headerTextContainer}>
                            <Typography variant="h5">
                                New Password Required
                            </Typography>
                        </div>
                        <div css={classes.headerTextContainer}>
                            <Typography>
                                A new password is required for newly added
                                users. Type your updated password below and
                                click Sign In.
                            </Typography>
                        </div>
                        <WrappedTextField
                            value={passwordCreationControl.value}
                            label="New Password"
                            onChange={passwordCreationControl.onChange}
                            type="password"
                            error={
                                showPasswordCreationError
                                    ? passwordCreationControl.errorMessage
                                    : ""
                            }
                        />
                        <div css={classes.actionButtonContainer}>
                            <WrappedButton
                                variant="contained"
                                color="primary"
                                onClick={onClickUpdatePassword}
                                disabled={
                                    isUpdatingPassword ||
                                    !passwordCreationControl.isValid
                                }
                                showSpinner={isUpdatingPassword}
                            >
                                Sign In
                            </WrappedButton>
                        </div>
                    </div>
                )}
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

    const contentMaxWidthContainer = css`
        width: 300px;
        display: grid;
    `;

    const signInButtonContainer = css`
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
    `;

    const headerTextContainer = css`
        margin-bottom: 16px;
    `;

    const actionButtonContainer = css`
        display: flex;
        justify-content: flex-end;
    `;

    return {
        pageContainer,
        contentMaxWidthContainer,
        signInButtonContainer,
        headerTextContainer,
        actionButtonContainer,
    };
};
