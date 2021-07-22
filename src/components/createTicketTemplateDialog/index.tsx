/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState, ChangeEvent, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@material-ui/core";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { WrappedTextField } from "../wrappedTextField";
import { WrappedButton } from "../wrappedButton";
import { useControl } from "../../hooks/useControl";
import { ControlValidator } from "../../classes/ControlValidator";
import { controlsAreValid } from "../../utils/controlsAreValid";
import { Api } from "../../api";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";

export interface ICreateTicketTemplateDialogProps {
    open: boolean;
    onClose: () => void;
    onCreateSuccess: (ticketTemplate: ITicketTemplate) => void;
}

export function CreateTicketTemplateDialog(
    props: ICreateTicketTemplateDialogProps
) {
    const [isCreatingTicketTemplate, setIsCreatingTicketTemplate] = useState(
        false
    );
    function createTicketTemplate() {
        setIsCreatingTicketTemplate(true);
    }

    const { boardId, companyId } = useAppRouterParams();

    useEffect(() => {
        if (!isCreatingTicketTemplate) return;

        let didCancel = false;

        Api.ticketTemplates
            .createTicketTemplateForBoard(companyId, boardId, {
                name: nameControl.value,
                description: descriptionControl.value,
                title: {
                    label: "Title",
                },
                summary: {
                    label: "Summary",
                    isRequired: true,
                },
                sections: [],
            })
            .then((ticketTemplate) => {
                if (didCancel) return;
                props.onCreateSuccess(ticketTemplate);
                props.onClose();
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsCreatingTicketTemplate(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isCreatingTicketTemplate, companyId, boardId]);

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
                .max(40, "The max length for the name is 40 characters")
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
                .max(
                    120,
                    "The max length for the description is 120 characters"
                )
                .validate(description);
        },
    });
    const showDescriptionError =
        !descriptionControl.isValid && descriptionControl.isTouched;

    const formIsValid = controlsAreValid(nameControl, descriptionControl);
    const classes = createClasses();

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            disableBackdropClick={isCreatingTicketTemplate}
        >
            <DialogTitle>Create Ticket Template</DialogTitle>
            <DialogContent>
                <div css={classes.columnInputContainer}>
                    <WrappedTextField
                        value={nameControl.value}
                        label="Template Name"
                        onChange={nameControl.onChange}
                        error={showNameError ? nameControl.errorMessage : ""}
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
            </DialogContent>
            <DialogActions>
                <WrappedButton
                    onClick={props.onClose}
                    disabled={isCreatingTicketTemplate}
                >
                    Close
                </WrappedButton>
                <WrappedButton
                    variant="contained"
                    onClick={createTicketTemplate}
                    color="primary"
                    disabled={!formIsValid || isCreatingTicketTemplate}
                    showSpinner={isCreatingTicketTemplate}
                >
                    Create
                </WrappedButton>
            </DialogActions>
        </Dialog>
    );
}

const createClasses = () => {
    const columnInputContainer = css`
        width: 300px;
    `;

    return {
        columnInputContainer,
    };
};
