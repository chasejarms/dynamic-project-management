/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useState, useEffect } from "react";
import { Api } from "../../../../../../api";
import { ControlValidator } from "../../../../../../classes/ControlValidator";
import { BoardsContainer } from "../../../../../../components/boardsContainer";
import { IWrappedButtonProps } from "../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../components/wrappedTextField";
import { useControl } from "../../../../../../hooks/useControl";
import { controlsAreValid } from "../../../../../../utils/controlsAreValid";
import { useHistory } from "react-router-dom";
import { BottomPageToolbar } from "../../../../../../components/bottomPageToolbar";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { useIsCheckingForCreateBoardsAccess } from "../../../../../../hooks/useIsCheckingForCreateBoardsAccess";
import { useEmailControl } from "../../../../../../hooks/useEmailControl";
import { useNameControl } from "../../../../../../hooks/useNameControl";

export function AddCompany() {
    const classes = createClasses();
    const isCheckingForCreateBoardsAccess = useIsCheckingForCreateBoardsAccess();

    const history = useHistory();
    const { companyId, boardId } = useAppRouterParams();

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
            return ControlValidator.string()
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
            return ControlValidator.string()
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

    return isCheckingForCreateBoardsAccess ? null : (
        <BoardsContainer>
            <div css={classes.container}>
                <div css={classes.controlsContainer}>
                    <div>
                        <div css={classes.columnInputContainer}>
                            <WrappedTextField
                                value={nameControl.value}
                                label="Name"
                                onChange={nameControl.onChange}
                                error={
                                    showNameError
                                        ? nameControl.errorMessage
                                        : ""
                                }
                                disabled={isCreatingNewCompany}
                            />
                        </div>
                        <div css={classes.columnInputContainer}>
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
                        </div>
                        <div css={classes.columnInputContainer}>
                            <WrappedTextField
                                value={emailControl.value}
                                label="Email"
                                onChange={emailControl.onChange}
                                error={
                                    showEmailError
                                        ? emailControl.errorMessage
                                        : ""
                                }
                                disabled={isCreatingNewCompany}
                            />
                        </div>
                        <div css={classes.columnInputContainer}>
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
                        </div>
                    </div>
                </div>
                <BottomPageToolbar wrappedButtonProps={wrappedButtonProps} />
            </div>
        </BoardsContainer>
    );
}

const createClasses = () => {
    const container = css`
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        width: 100%;
    `;

    const controlsContainer = css`
        flex-grow: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const columnInputContainer = css`
        width: 300px;
    `;

    const bottomToolbarContainer = css`
        width: 100%;
    `;

    return {
        container,
        columnInputContainer,
        controlsContainer,
        bottomToolbarContainer,
    };
};
