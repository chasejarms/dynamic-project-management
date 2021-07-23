/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    useTheme,
    Typography,
} from "@material-ui/core";
import { ChangeEvent, useEffect, useState } from "react";
import { Api } from "../../api";
import { ControlValidator } from "../../classes/ControlValidator";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import { useControl } from "../../hooks/useControl";
import { ITag } from "../../models/tag";
import { composeCSS } from "../../styles/composeCSS";
import { WrappedButton } from "../wrappedButton";
import { WrappedTextField } from "../wrappedTextField";

export interface INewTagDialogProps {
    open: boolean;
    onClose: () => void;
    onCreateTagSuccess: (tag: ITag) => void;
}

const availableColors = ["red", "blue", "green", "yello"];

export function NewTagDialog(props: INewTagDialogProps) {
    const theme = useTheme();
    const { boardId, companyId } = useAppRouterParams();

    const newTagControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (newTag: string) => {
            return ControlValidator.string()
                .required("This field is required")
                .validate(newTag);
        },
    });
    const showNewTagError = newTagControl.isTouched && !newTagControl.isValid;

    const colorControl = useControl({
        value: "blue",
        onChange: (color: string) => {
            return color;
        },
    });

    function onChangeColor(color: string) {
        return () => colorControl.onChange(color);
    }

    const [isCreatingTag, setIsCreatingTag] = useState(false);
    function createTag() {
        setIsCreatingTag(true);
    }
    useEffect(() => {
        if (!isCreatingTag) return;

        let didCancel = false;

        Api.priorities
            .createTag(
                companyId,
                boardId,
                newTagControl.value,
                colorControl.value
            )
            .then((createdTag) => {
                if (didCancel) return;
                props.onCreateTagSuccess(createdTag);
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsCreatingTag(false);
                props.onClose();
            });

        return () => {
            didCancel = true;
        };
    }, [isCreatingTag]);

    function mapColorToMaterialThemeColorLight(color: string) {
        if (color === "red") {
            return theme.palette.error.light;
        } else if (color === "green") {
            return theme.palette.success.light;
        } else if (color === "blue") {
            return theme.palette.info.light;
        } else if (color === "yello") {
            return theme.palette.warning.light;
        } else {
            return "#ffffff";
        }
    }

    function mapColorToMaterialThemeColorMain(color: string) {
        if (color === "red") {
            return theme.palette.error.dark;
        } else if (color === "green") {
            return theme.palette.success.dark;
        } else if (color === "blue") {
            return theme.palette.info.dark;
        } else if (color === "yello") {
            return theme.palette.warning.dark;
        } else {
            return "#ffffff";
        }
    }

    const classes = createClasses();
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            disableBackdropClick={isCreatingTag}
        >
            <DialogTitle>Create Tag</DialogTitle>
            <DialogContent>
                <div css={classes.tagInputContainer}>
                    <WrappedTextField
                        value={newTagControl.value}
                        label="Tag Name"
                        onChange={newTagControl.onChange}
                        error={
                            showNewTagError ? newTagControl.errorMessage : ""
                        }
                    />
                </div>
                <div css={classes.colorContainer}>
                    {availableColors.map((color) => {
                        const hexColor = mapColorToMaterialThemeColorLight(
                            color
                        );
                        const individualColorContainer = css`
                            background-color: ${hexColor};
                        `;

                        const hexColorMain = mapColorToMaterialThemeColorMain(
                            color
                        );
                        const individualColorOuterContainer = css`
                            background-color: ${hexColorMain};
                        `;

                        const isSelected = colorControl.value === color;

                        return (
                            <div
                                css={composeCSS(
                                    individualColorOuterContainer,
                                    classes.commonIndividualColorOuterContainer,
                                    !isSelected &&
                                        classes.unselectedInvidualColorOuterContainer
                                )}
                            >
                                <div
                                    css={composeCSS(
                                        individualColorContainer,
                                        classes.commonIndividualColorContainer
                                    )}
                                    onClick={onChangeColor(color)}
                                ></div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
            <DialogActions>
                <WrappedButton onClick={props.onClose} disabled={isCreatingTag}>
                    Close
                </WrappedButton>
                <WrappedButton
                    variant="contained"
                    onClick={createTag}
                    color="primary"
                    disabled={isCreatingTag}
                    showSpinner={isCreatingTag}
                >
                    Create
                </WrappedButton>
            </DialogActions>
        </Dialog>
    );
}

const createClasses = () => {
    const tagInputContainer = css`
        width: 400px;
    `;

    const colorContainer = css`
        display: flex;
        width: 400px;
        margin-bottom: 16px;
        margin-top: 16px;
    `;

    const commonIndividualColorContainer = css`
        height: 32px;
        width: 32px;
        border-radius: 50%;
        cursor: pointer;
    `;

    const commonIndividualColorOuterContainer = css`
        height: 40px;
        width: 40px;
        border-radius: 50%;
        margin-right: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const tagColorHeader = css`
        margin-top: 16px;
        margin-bottom: 16px;
    `;

    const unselectedInvidualColorOuterContainer = css`
        background-color: transparent;
    `;

    return {
        tagInputContainer,
        colorContainer,
        commonIndividualColorContainer,
        tagColorHeader,
        commonIndividualColorOuterContainer,
        unselectedInvidualColorOuterContainer,
    };
};