import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    Box,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { Api } from "../../../../../../../../../api";
import { StringValidator } from "../../../../../../../../../classes/StringValidator";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { useControl } from "../../../../../../hooks/useControl";
import { ITag } from "../../../../../../../../../models/tag";
import { tagColors } from "../../../../../../../../../models/tagColor";
import { mapColorToMaterialThemeColorLight } from "../../utils/mapColorToMaterialThemeColorLight";
import { mapColorToMaterialThemeColorMain } from "../../utils/mapColorToMaterialThemeColorMain";
import { WrappedButton } from "../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../components/wrappedTextField";

export interface INewTagDialogProps {
    open: boolean;
    onClose: () => void;
    onCreateTagSuccess: (tag: ITag) => void;
}

export function NewTagDialog(props: INewTagDialogProps) {
    const { boardId, companyId } = useAppRouterParams();

    const newTagControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (newTag: string) => {
            return new StringValidator()
                .required("This field is required")
                .validate(newTag);
        },
    });
    const showNewTagError = newTagControl.isTouched && !newTagControl.isValid;

    const colorControl = useControl({
        value: "grey",
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

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            onBackdropClick={() => {
                if (isCreatingTag) return;

                props.onClose();
            }}
        >
            <DialogTitle>Create Tag</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        width: 400,
                    }}
                >
                    <WrappedTextField
                        value={newTagControl.value}
                        label="Tag Name"
                        onChange={newTagControl.onChange}
                        error={
                            showNewTagError ? newTagControl.errorMessage : ""
                        }
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: 400,
                        marginBottom: 2,
                        marginTop: 2,
                    }}
                >
                    {tagColors.map((color) => {
                        const bgInnerColor = mapColorToMaterialThemeColorLight(
                            color
                        );

                        const bgOuterColor = mapColorToMaterialThemeColorMain(
                            color
                        );
                        const isSelected = colorControl.value === color;
                        const actualBgOuterColor = isSelected
                            ? bgOuterColor
                            : "transparent";

                        return (
                            <Box
                                sx={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: "50%",
                                    marginRight: 2,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    bgcolor: actualBgOuterColor,
                                }}
                                key={color}
                            >
                                <Box
                                    sx={{
                                        height: 32,
                                        width: 32,
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        bgcolor: bgInnerColor,
                                    }}
                                    onClick={onChangeColor(color)}
                                />
                            </Box>
                        );
                    })}
                </Box>
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
