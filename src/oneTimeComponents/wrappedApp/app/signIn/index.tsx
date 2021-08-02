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
import { ControlValidator } from "../../../../classes/ControlValidator";
import { userPool } from "../../../../classes/UserPool";
import { NonAuthenticatedPageContainer } from "../../../../components/nonAuthenticatedPageContainer";
import { WrappedButton } from "../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../components/wrappedTextField";
import { useControl } from "../../../../hooks/useControl";
import { controlsAreValid } from "../../../../utils/controlsAreValid";
import { useHistory } from "react-router-dom";
import { cognitoUserSingleton } from "../../../../classes/CognitoUserSingleton";
import { useEmailControl } from "../../../../hooks/useEmailControl";

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

    const passwordControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (password: string) => {
            return ControlValidator.string()
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
            }
        );

        return () => {
            didCancel = true;
        };
    }, [isSigningIn]);

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
        justify-content: space-between;
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
