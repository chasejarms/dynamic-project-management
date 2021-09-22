import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    Box,
} from "@material-ui/core";
import { ChangeEvent, useEffect, useState } from "react";
import { Api } from "../../../../../../../../../../api";
import { StringValidator } from "../../../../../../../../../../classes/StringValidator";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { useControl } from "../../../../../../../hooks/useControl";
import { ITag } from "../../../../../../../../../../models/tag";
import {
    TagColor,
    tagColors,
} from "../../../../../../../../../../models/tagColor";
import { mapColorToMaterialThemeColorLight } from "../../utils/mapColorToMaterialThemeColorLight";
import { mapColorToMaterialThemeColorMain } from "../../utils/mapColorToMaterialThemeColorMain";
import { WrappedButton } from "../../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../../components/wrappedTextField";

export interface IEditTagDialogProps {
    open: boolean;
    onClose: () => void;
    onEditTagSuccess: (tag: ITag) => void;
    tag: ITag | null;
}

export function EditTagDialog(props: IEditTagDialogProps) {
    const { boardId, companyId } = useAppRouterParams();

    const tagNameControl = useControl({
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
    const showTagNameError =
        tagNameControl.isTouched && !tagNameControl.isValid;

    const colorControl = useControl({
        value: TagColor.Grey,
        onChange: (color: string) => {
            return color;
        },
    });

    function onChangeColor(color: string) {
        return () => colorControl.onChange(color);
    }

    useEffect(() => {
        tagNameControl.resetControlState(props.tag?.name || "");
        colorControl.resetControlState(props.tag?.color || TagColor.Grey);
    }, [props.tag]);

    const [isEditingTag, setIsEditingTag] = useState(false);
    function editTag() {
        setIsEditingTag(true);
    }
    useEffect(() => {
        if (!isEditingTag) return;

        let didCancel = false;

        Api.priorities
            .updateTagColor(
                companyId,
                boardId,
                props.tag!.name,
                colorControl.value
            )
            .then(() => {
                if (didCancel) return;
                props.onEditTagSuccess({
                    ...props.tag!,
                    color: colorControl.value,
                });
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsEditingTag(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isEditingTag]);

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            disableBackdropClick={isEditingTag}
        >
            <DialogTitle>Create Tag</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        width: 400,
                    }}
                >
                    <WrappedTextField
                        value={tagNameControl.value}
                        label="Tag Name"
                        onChange={tagNameControl.onChange}
                        error={
                            showTagNameError ? tagNameControl.errorMessage : ""
                        }
                        disabled
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: 400,
                        marginBottom: 16,
                        marginTop: 16,
                    }}
                >
                    {tagColors.map((color) => {
                        const bgInnerColor = mapColorToMaterialThemeColorLight(
                            color
                        );

                        const bgOuterColorIfIsSelected = mapColorToMaterialThemeColorMain(
                            color
                        );

                        const isSelected = colorControl.value === color;
                        const bgOuterColor = !isSelected
                            ? "transparent"
                            : bgOuterColorIfIsSelected;

                        return (
                            <Box
                                sx={{
                                    bgcolor: bgOuterColor,
                                    height: 40,
                                    width: 40,
                                    borderRadius: "50%",
                                    marginRight: 16,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                key={color}
                            >
                                <Box
                                    sx={{
                                        bgcolor: bgInnerColor,
                                        height: 32,
                                        width: 32,
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                    }}
                                />
                            </Box>
                        );
                    })}
                </Box>
            </DialogContent>
            <DialogActions>
                <WrappedButton onClick={props.onClose} disabled={isEditingTag}>
                    Close
                </WrappedButton>
                <WrappedButton
                    variant="contained"
                    onClick={editTag}
                    color="primary"
                    disabled={isEditingTag}
                    showSpinner={isEditingTag}
                >
                    Create
                </WrappedButton>
            </DialogActions>
        </Dialog>
    );
}
