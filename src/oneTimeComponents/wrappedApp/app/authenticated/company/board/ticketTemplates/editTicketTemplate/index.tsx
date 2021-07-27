/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { ControlValidator } from "../../../../../../../../classes/ControlValidator";
import { BoardContainer } from "../../../../../../../../components/boardContainer";
import { BottomPageToolbar } from "../../../../../../../../components/bottomPageToolbar";
import { IWrappedButtonProps } from "../../../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../../../components/wrappedTextField";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { useControl } from "../../../../../../../../hooks/useControl";

export function EditTicketTemplate() {
    const classes = createClasses();

    const { boardId, companyId, ticketTemplateId } = useAppRouterParams();

    const nameControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (name: string) => {
            return ControlValidator.string()
                .required("This field is required")
                .validate(name);
        },
    });
    const showNameError = !nameControl.isValid && nameControl.isTouched;

    const descriptionControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (description: string) => {
            return ControlValidator.string()
                .required("This field is required")
                .validate(description);
        },
    });
    const showDescriptionError =
        !descriptionControl.isValid && descriptionControl.isTouched;

    const [isLoadingTicketTemplate, setIsLoadingTicketTemplate] = useState(
        false
    );
    useEffect(() => {
        let didCancel = false;

        Api.ticketTemplates
            .getTicketTemplateForBoard(companyId, boardId, ticketTemplateId)
            .then((ticketTemplate) => {
                if (didCancel) return;
                console.log("ticketTemplate: ", ticketTemplate);
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingTicketTemplate(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isLoadingTicketTemplate]);

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: () => null,
            color: "primary",
            disabled: false,
            showSpinner: false,
            children: "Update Ticket Template",
        },
    ];

    return (
        <BoardContainer>
            <div css={classes.container}>
                <div css={classes.innerContentContainer}>
                    <div css={classes.columnInputContainer}>
                        <WrappedTextField
                            value={nameControl.value}
                            label="Template Name"
                            onChange={nameControl.onChange}
                            error={
                                showNameError ? nameControl.errorMessage : ""
                            }
                        />
                    </div>
                    <div css={classes.columnInputContainer}>
                        <WrappedTextField
                            value={descriptionControl.value}
                            label="Template Description"
                            onChange={descriptionControl.onChange}
                            error={
                                showDescriptionError
                                    ? descriptionControl.errorMessage
                                    : ""
                            }
                        />
                    </div>
                </div>
                <div css={classes.bottomToolbarContainer}>
                    <BottomPageToolbar
                        wrappedButtonProps={wrappedButtonProps}
                    />
                </div>
            </div>
        </BoardContainer>
    );
}

const createClasses = () => {
    const container = css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    `;

    const innerContentContainer = css`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    `;

    const bottomToolbarContainer = css`
        flex: 0 0 auto;
    `;

    const columnInputContainer = css`
        width: 300px;
    `;

    return {
        container,
        bottomToolbarContainer,
        innerContentContainer,
        columnInputContainer,
    };
};
