/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography, Snackbar } from "@material-ui/core";
import { ChangeEvent, useState, useEffect } from "react";
import { Api } from "../../../../api";
import { StringValidator } from "../../../../classes/StringValidator";
import { NonAuthenticatedPageContainer } from "../../../../components/nonAuthenticatedPageContainer";
import { WrappedButton } from "../../../components/wrappedButton";
import { WrappedTextField } from "../../../components/wrappedTextField";
import { useControl } from "../../../../hooks/useControl";
import { controlsAreValid } from "../../../../utils/controlsAreValid";
import { useHistory } from "react-router-dom";
import { useEmailControl } from "../../../../hooks/useEmailControl";
import { useNameControl } from "../../../../hooks/useNameControl";
import { usePasswordCreationControl } from "../../../../hooks/usePasswordCreationControl";

export function SignUp() {
    const history = useHistory();
    const { emailControl, showEmailError } = useEmailControl();
    const {
        passwordCreationControl,
        showPasswordCreationError,
    } = usePasswordCreationControl();

    const { nameControl, showNameError } = useNameControl();

    const companyNameControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (companyName: string) => {
            return new StringValidator()
                .required("A company name is required")
                .validate(companyName);
        },
    });
    const showCompanyNameError =
        !companyNameControl.isValid && companyNameControl.isTouched;

    const classes = createClasses();

    const [isSigningUp, setIsSigningUp] = useState(false);
    function triggerSignUp() {
        setIsSigningUp(true);
    }

    const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
    function onCloseSnackbar() {
        setSnackbarIsOpen(false);
    }

    function navigateToSignInPage() {
        history.push("/sign-in");
    }

    useEffect(() => {
        if (!isSigningUp) return;

        let didCancel = false;
        Api.signUp
            .signUp({
                email: emailControl.value,
                password: passwordCreationControl.value,
                name: nameControl.value,
                companyName: "My Amazing Company",
            })
            .then(() => {
                if (didCancel) return;
                setSnackbarIsOpen(true);
            })
            .catch(() => {
                if (didCancel) return;
                // show an error with signing up
            })
            .finally(() => {
                if (didCancel) return;
                setIsSigningUp(false);
            });

        // navigateToSignInPage();

        return () => {
            didCancel = true;
        };
    }, [isSigningUp]);

    const controlsAreInvalid = !controlsAreValid(
        nameControl,
        emailControl,
        passwordCreationControl,
        companyNameControl
    );

    return (
        <NonAuthenticatedPageContainer makeFullPage>
            <div css={classes.pageContainer}>
                <div css={classes.credentialsContainer}>
                    <div css={classes.signUpContainer}>
                        <Typography variant="h5">Sign Up</Typography>
                    </div>
                    <Typography>
                        Use Butter for 14 days at no cost. No credit card
                        required.
                    </Typography>
                    <WrappedTextField
                        value={nameControl.value}
                        autoFocus
                        label="Name"
                        onChange={nameControl.onChange}
                        error={showNameError ? nameControl.errorMessage : ""}
                    />
                    <WrappedTextField
                        value={companyNameControl.value}
                        label="Company Name"
                        onChange={companyNameControl.onChange}
                        error={
                            showCompanyNameError
                                ? companyNameControl.errorMessage
                                : ""
                        }
                    />
                    <WrappedTextField
                        value={emailControl.value}
                        label="Email"
                        onChange={emailControl.onChange}
                        error={showEmailError ? emailControl.errorMessage : ""}
                    />
                    <WrappedTextField
                        value={passwordCreationControl.value}
                        label="Password"
                        onChange={passwordCreationControl.onChange}
                        type="password"
                        error={
                            showPasswordCreationError &&
                            passwordCreationControl.value.length > 0
                                ? passwordCreationControl.errorMessage
                                : ""
                        }
                    />
                    <div css={classes.signInButtonContainer}>
                        <WrappedButton
                            variant="contained"
                            color="primary"
                            onClick={triggerSignUp}
                            disabled={controlsAreInvalid || isSigningUp}
                            showSpinner={isSigningUp}
                        >
                            Sign Up
                        </WrappedButton>
                    </div>
                    {/* TODO: probably put an error message in here to handle errors */}
                    <Snackbar
                        open={snackbarIsOpen}
                        onClose={onCloseSnackbar}
                        action={
                            <WrappedButton
                                color="secondary"
                                onClick={navigateToSignInPage}
                            >
                                Sign In
                            </WrappedButton>
                        }
                        message={
                            "A verification link has been sent to your email."
                        }
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
