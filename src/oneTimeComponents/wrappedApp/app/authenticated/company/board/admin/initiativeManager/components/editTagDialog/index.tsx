/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    useTheme,
} from "@material-ui/core";
import { ChangeEvent, useEffect, useState } from "react";
import { Api } from "../../../../../../../../../../api";
import { StringValidator } from "../../../../../../../../../../classes/StringValidator";
import { useAppRouterParams } from "../../../../../../../../../../hooks/useAppRouterParams";
import { useControl } from "../../../../../../../hooks/useControl";
import { ITag } from "../../../../../../../../../../models/tag";
import {
    TagColor,
    tagColors,
} from "../../../../../../../../../../models/tagColor";
import { composeCSS } from "../../../../../../../../../../styles/composeCSS";
import { mapColorToMaterialThemeColorLight } from "../../../../../../../../../../utils/mapColorToMaterialThemeColorLight";
import { mapColorToMaterialThemeColorMain } from "../../../../../../../../../../utils/mapColorToMaterialThemeColorMain";
import { WrappedButton } from "../../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../../components/wrappedTextField";

export interface IEditTagDialogProps {
    open: boolean;
    onClose: () => void;
    onEditTagSuccess: (tag: ITag) => void;
    tag: ITag | null;
}

export function EditTagDialog(props: IEditTagDialogProps) {
    const theme = useTheme();
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

    const classes = createClasses();
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            disableBackdropClick={isEditingTag}
        >
            <DialogTitle>Create Tag</DialogTitle>
            <DialogContent>
                <div css={classes.tagInputContainer}>
                    <WrappedTextField
                        value={tagNameControl.value}
                        label="Tag Name"
                        onChange={tagNameControl.onChange}
                        error={
                            showTagNameError ? tagNameControl.errorMessage : ""
                        }
                        disabled
                    />
                </div>
                <div css={classes.colorContainer}>
                    {tagColors.map((color) => {
                        const hexColor = mapColorToMaterialThemeColorLight(
                            theme,
                            color
                        );
                        const individualColorContainer = css`
                            background-color: ${hexColor};
                        `;

                        const hexColorMain = mapColorToMaterialThemeColorMain(
                            theme,
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
                                key={color}
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
