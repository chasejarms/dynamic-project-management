import { Typography, Snackbar, Box } from "@mui/material";
import { ChangeEvent, useState, useEffect } from "react";
import { StringValidator } from "../../../../classes/StringValidator";
import { NonAuthenticatedPageContainer } from "../components/nonAuthenticatedPageContainer";
import { WrappedButton } from "../components/wrappedButton";
import { WrappedTextField } from "../components/wrappedTextField";
import { useControl } from "../hooks/useControl";
import { controlsAreValid } from "../utils/controlsAreValid";
import { useEmailControl } from "../hooks/useEmailControl";
import { Api } from "../../../../api";

export function RequestDemo() {
    const nameControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (name: string) => {
            return new StringValidator()
                .required("This field is required")
                .validate(name);
        },
    });
    const showNameError = !nameControl.isValid && nameControl.isTouched;

    const { emailControl, showEmailError } = useEmailControl();
    const companyControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (company: string) => {
            return new StringValidator()
                .required("This field is required")
                .validate(company);
        },
    });
    const showCompanyError =
        !companyControl.isValid && companyControl.isTouched;
    const phoneControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (company: string) => {
            return new StringValidator()
                .required("This field is required")
                .validate(company);
        },
    });
    const showPhoneError = !phoneControl.isValid && phoneControl.isTouched;
    const additionalInformationControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
    });

    const [isSendingEmail, setIsSendingEmail] = useState(false);
    function triggerIsSendingEmail() {
        setIsSendingEmail(true);
    }

    useEffect(() => {
        if (!isSendingEmail) return;
        let didCancel = false;

        Api.contact
            .capturePublicFormData({
                name: nameControl.value,
                email: emailControl.value,
                phoneNumber: phoneControl.value,
                company: companyControl.value,
                additionalInformation: additionalInformationControl.value,
            })
            .then(() => {
                if (didCancel) return;
                setSnackbarMetadata({
                    open: true,
                    message:
                        "Success! We've received your message and will get back to you shortly.",
                });
                nameControl.resetControlState("");
                emailControl.resetControlState("");
                phoneControl.resetControlState("");
                companyControl.resetControlState("");
                additionalInformationControl.resetControlState("");
            })
            .catch(() => {
                if (didCancel) return;
                // show an error message
            })
            .finally(() => {
                if (didCancel) return;
                setIsSendingEmail(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isSendingEmail]);

    const controlsAreInvalid = !controlsAreValid(
        nameControl,
        emailControl,
        companyControl,
        phoneControl
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
                        <Typography variant="h5">Contact Us</Typography>
                    </Box>
                    <WrappedTextField
                        value={nameControl.value}
                        label="Name"
                        onChange={nameControl.onChange}
                        error={showNameError ? nameControl.errorMessage : ""}
                        required
                        disabled={isSendingEmail}
                    />
                    <WrappedTextField
                        value={emailControl.value}
                        label="Email"
                        onChange={emailControl.onChange}
                        error={showEmailError ? emailControl.errorMessage : ""}
                        required
                        disabled={isSendingEmail}
                    />
                    <WrappedTextField
                        value={phoneControl.value}
                        label="Phone Number"
                        onChange={phoneControl.onChange}
                        error={showPhoneError ? phoneControl.errorMessage : ""}
                        required
                        disabled={isSendingEmail}
                    />
                    <WrappedTextField
                        value={companyControl.value}
                        label="Company"
                        onChange={companyControl.onChange}
                        error={
                            showCompanyError ? companyControl.errorMessage : ""
                        }
                        required
                        disabled={isSendingEmail}
                    />
                    <WrappedTextField
                        value={additionalInformationControl.value}
                        label="Additional Information"
                        onChange={additionalInformationControl.onChange}
                        multiline
                        disabled={isSendingEmail}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <WrappedButton
                            variant="contained"
                            color="primary"
                            onClick={triggerIsSendingEmail}
                            disabled={controlsAreInvalid || isSendingEmail}
                            showSpinner={isSendingEmail}
                        >
                            Send
                        </WrappedButton>
                    </Box>
                    <Snackbar
                        open={snackbarMetadata.open}
                        onClose={onCloseSnackbar}
                        message={snackbarMetadata.message}
                    />
                    {/* TODO: probably put an error message in here to handle errors */}
                </Box>
            </Box>
        </NonAuthenticatedPageContainer>
    );
}
