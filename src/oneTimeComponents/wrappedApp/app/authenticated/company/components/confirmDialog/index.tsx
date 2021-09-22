/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from "@mui/material";
import { WrappedButton } from "../../../../components/wrappedButton";
import { TransitionProps } from "@mui/material/transitions/transition";

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
            onBackdropClick={() => {
                if (props.isPerformingAction) return;

                props.onClose();
            }}
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
