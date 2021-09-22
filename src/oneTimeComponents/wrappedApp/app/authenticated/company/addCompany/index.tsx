import { ChangeEvent, useState, useEffect } from "react";
import { Api } from "../../../../../../api";
import { StringValidator } from "../../../../../../classes/StringValidator";
import { BoardsContainer } from "../components/boardsContainer";
import { IWrappedButtonProps } from "../../../components/wrappedButton";
import { WrappedTextField } from "../../../components/wrappedTextField";
import { useControl } from "../../../hooks/useControl";
import { controlsAreValid } from "../../../utils/controlsAreValid";
import { BottomPageToolbar } from "../components/bottomPageToolbar";
import { useEmailControl } from "../../../hooks/useEmailControl";
import { useNameControl } from "../../../hooks/useNameControl";
import { Box } from "@material-ui/core";

export function AddCompany() {
    const { emailControl, showEmailError } = useEmailControl();

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

    const secretKeyControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (secretKey: string) => {
            return new StringValidator()
                .required("A secret key is required")
                .validate(secretKey);
        },
    });
    const showSecretKeyError =
        !secretKeyControl.isValid && secretKeyControl.isTouched;

    const formIsValid = controlsAreValid(
        companyNameControl,
        emailControl,
        nameControl,
        secretKeyControl
    );

    const [isCreatingNewCompany, setIsCreatingNewCompany] = useState(false);
    function createCompany() {
        setIsCreatingNewCompany(true);
    }

    useEffect(() => {
        if (!isCreatingNewCompany) return;

        let didCancel = false;

        Api.company
            .authenticatedCreateNewCompany(
                companyNameControl.value,
                emailControl.value,
                nameControl.value,
                secretKeyControl.value
            )
            .then((board) => {
                if (didCancel) return;
                console.log("the company was created successfully");
            })
            .catch(() => {
                if (didCancel) return;
                // probably do something here;
            })
            .finally(() => {
                if (didCancel) return;
                setIsCreatingNewCompany(false);
            });

        return () => {
            didCancel = true;
        };
        // create the board
    }, [isCreatingNewCompany]);

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: createCompany,
            color: "primary",
            disabled: !formIsValid || isCreatingNewCompany,
            showSpinner: isCreatingNewCompany,
            children: "Create",
        },
    ];

    return (
        <BoardsContainer>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateRows: "1fr auto",
                    height: "100%",
                }}
            >
                <Box
                    sx={{
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
                        <WrappedTextField
                            value={nameControl.value}
                            label="Name"
                            onChange={nameControl.onChange}
                            error={
                                showNameError ? nameControl.errorMessage : ""
                            }
                            disabled={isCreatingNewCompany}
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
                            disabled={isCreatingNewCompany}
                        />
                        <WrappedTextField
                            value={emailControl.value}
                            label="Email"
                            onChange={emailControl.onChange}
                            error={
                                showEmailError ? emailControl.errorMessage : ""
                            }
                            disabled={isCreatingNewCompany}
                        />
                        <WrappedTextField
                            value={secretKeyControl.value}
                            label="Key"
                            onChange={secretKeyControl.onChange}
                            error={
                                showSecretKeyError
                                    ? secretKeyControl.errorMessage
                                    : ""
                            }
                            disabled={isCreatingNewCompany}
                        />
                    </Box>
                </Box>
                <BottomPageToolbar wrappedButtonProps={wrappedButtonProps} />
            </Box>
        </BoardsContainer>
    );
}
