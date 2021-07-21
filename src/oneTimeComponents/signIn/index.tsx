/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography, Snackbar } from "@material-ui/core";
import { ChangeEvent, useState, useEffect } from "react";
import * as AWSCognitoIdentity from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import { useHistory } from "react-router-dom";
import { WrappedTextField } from "../../components/wrappedTextField";
import { useControl } from "../../hooks/useControl";
import { ControlValidator } from "../../classes/ControlValidator";
import { WrappedButton } from "../../components/wrappedButton";
import { controlsAreValid } from "../../utils/controlsAreValid";
import { userPool } from "../../classes/UserPool";
import { FullPageContainer } from "../../components/fullPageContainer";

export function SignIn() {
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

    const [isSigningIn, setIsSigningIn] = useState(false);
    function triggerSignIn() {
        setIsSigningIn(true);
    }

    const routerHistory = useHistory();

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
        var cognitoUser = new AWSCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                if (didCancel) return;

                AWS.config.region = "us-east-1";
                const token = result.getIdToken().getJwtToken();

                localStorage.setItem("token", token);
                routerHistory.push("/app/companies");
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
        });

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

    return (
        <FullPageContainer>
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
        </FullPageContainer>
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
