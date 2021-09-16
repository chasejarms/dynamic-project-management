/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from "@material-ui/core";
import { WrappedButton } from "../../oneTimeComponents/wrappedApp/app/components/wrappedButton";
import { TransitionProps } from "@material-ui/core/transitions/transition";

export interface IConfirmDialogProps {
    isPerformingAction: boolean;
    open: boolean;
    onConfirm: () => void;
    onClose: () => void;
    title: string;
    content: string;
    confirmButtonText: string;
    TransitionProps?: TransitionProps;
}

export function ConfirmDialog(props: IConfirmDialogProps) {
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            disableBackdropClick={props.isPerformingAction}
            TransitionProps={props.TransitionProps}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <Typography>{props.content}</Typography>
            </DialogContent>
            <DialogActions>
                <WrappedButton
                    onClick={props.onClose}
                    disabled={props.isPerformingAction}
                >
                    Close
                </WrappedButton>
                <WrappedButton
                    variant="contained"
                    onClick={props.onConfirm}
                    color="primary"
                    disabled={props.isPerformingAction}
                    showSpinner={props.isPerformingAction}
                >
                    {props.confirmButtonText}
                </WrappedButton>
            </DialogActions>
        </Dialog>
    );
}
