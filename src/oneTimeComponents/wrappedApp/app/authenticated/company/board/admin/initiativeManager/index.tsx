import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../components/centerLoadingSpinner";
import { useAppRouterParams } from "../../../../../hooks/useAppRouterParams";
import { BoardAdminContainer } from "../components/boardAdminContainer";
import { ITag } from "../../../../../../../../models/tag";
import { WrappedButton } from "../../../../../components/wrappedButton";
import { NewTagDialog } from "./components/newTagDialog";
import { sortBy } from "lodash";
import { mapColorToMaterialThemeColorLight } from "./utils/mapColorToMaterialThemeColorLight";
import { ConfirmDialog } from "../../../components/confirmDialog";
import { EditTagDialog } from "./components/editTagDialog";

export function InitiativeManager() {
    const { companyId, boardId } = useAppRouterParams();
    const [allTagsForBoard, setAllTagsForBoard] = useState<ITag[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(true);

    useEffect(() => {
        let didCancel = false;

        Api.priorities
            .getAllTagsForBoard(companyId, boardId)
            .then((tags) => {
                if (didCancel) return;
                setAllTagsForBoard(tags);
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingTags(false);
            });

        return () => {
            didCancel = true;
        };
    }, []);

    const [tagsCreatorIsOpen, setTagsCreatorIsOpen] = useState(false);
    function onClickAddTag() {
        setTagsCreatorIsOpen(true);
    }
    function closeTagsCreator() {
        setTagsCreatorIsOpen(false);
    }
    function onCreateTagSuccess(tag: ITag) {
        setAllTagsForBoard((previousTags) => {
            const updatedTags = previousTags.concat([tag]);
            const sortedUpdatedTags = sortBy(updatedTags, "name");
            return sortedUpdatedTags;
        });
    }

    const [
        { tagToEdit, editTagDialogIsOpen },
        setTagEditInformation,
    ] = useState<{
        tagToEdit: null | ITag;
        editTagDialogIsOpen: boolean;
    }>({
        tagToEdit: null,
        editTagDialogIsOpen: false,
    });
    function onClickEditTag(tag: ITag) {
        return () => {
            setTagEditInformation(() => {
                return {
                    tagToEdit: tag,
                    editTagDialogIsOpen: true,
                };
            });
        };
    }
    function closeEditTagDialog() {
        setTagEditInformation((previousTagEditInformation) => {
            return {
                ...previousTagEditInformation,
                editTagDialogIsOpen: false,
            };
        });
    }
    function onEditTagSuccess(tag: ITag) {
        setAllTagsForBoard((previousTags) => {
            return previousTags.map((compareTag) => {
                const isSameTag = compareTag.name === tagToEdit?.name;
                if (isSameTag) {
                    return tag;
                } else {
                    return compareTag;
                }
            });
        });
        setTagEditInformation(() => {
            return {
                tagToEdit: null,
                editTagDialogIsOpen: false,
            };
        });
    }

    const [
        { tagToDelete, confirmDeleteTagDialogIsOpen },
        setTagDeleteInformation,
    ] = useState<{
        tagToDelete: null | ITag;
        confirmDeleteTagDialogIsOpen: boolean;
    }>({
        tagToDelete: null,
        confirmDeleteTagDialogIsOpen: false,
    });
    function onClickDeleteTag(tag: ITag) {
        return () => {
            setTagDeleteInformation({
                tagToDelete: tag,
                confirmDeleteTagDialogIsOpen: true,
            });
        };
    }

    function onCloseConfirmDialog() {
        setTagDeleteInformation((previous) => {
            return {
                ...previous,
                confirmDeleteTagDialogIsOpen: false,
            };
        });
    }

    const [isDeletingTag, setIsDeletingTag] = useState(false);
    function onClickConfirmDelete() {
        setIsDeletingTag(true);
    }
    useEffect(() => {
        if (!isDeletingTag) return;

        let didCancel = false;

        Api.priorities
            .deleteTagForBoard(companyId, boardId, tagToDelete?.name || "")
            .then(() => {
                if (didCancel) return;
                setAllTagsForBoard((previousTags) => {
                    return previousTags.filter((compareTag) => {
                        return compareTag.name !== tagToDelete?.name;
                    });
                });
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsDeletingTag(false);
                onCloseConfirmDialog();
            });

        return () => {
            didCancel = true;
        };
    }, [isDeletingTag]);

    return (
        <BoardAdminContainer>
            {!isLoadingTags ? (
                <Box
                    sx={{
                        padding: 4,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Paper>
                        <Toolbar
                            sx={{
                                paddingLeft: 2,
                                paddingRight: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="h6">Tags</Typography>
                                <div>
                                    <WrappedButton
                                        onClick={onClickAddTag}
                                        color="primary"
                                    >
                                        Add Tag
                                    </WrappedButton>
                                </div>
                            </Box>
                        </Toolbar>
                        <TableContainer
                            sx={{
                                maxHeight: 400,
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                backgroundColor: "white",
                                            }}
                                        >
                                            Tag Name
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                backgroundColor: "white",
                                            }}
                                        >
                                            Tag Color
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                backgroundColor: "white",
                                            }}
                                        />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allTagsForBoard.map((tag) => {
                                        const bgcolor = mapColorToMaterialThemeColorLight(
                                            tag.color
                                        );

                                        return (
                                            <TableRow key={tag.name}>
                                                <TableCell>
                                                    {tag.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                            width: 16,
                                                            height: 16,
                                                            borderRadius: "50%",
                                                            bgcolor,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                            position:
                                                                "relative",
                                                            width: "100px",
                                                            height: "100%",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                position:
                                                                    "absolute",
                                                                left: -11,
                                                                height: "100%",
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <IconButton
                                                                onClick={onClickDeleteTag(
                                                                    tag
                                                                )}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={onClickEditTag(
                                                                    tag
                                                                )}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <NewTagDialog
                        open={tagsCreatorIsOpen}
                        onClose={closeTagsCreator}
                        onCreateTagSuccess={onCreateTagSuccess}
                    />
                    <EditTagDialog
                        open={editTagDialogIsOpen}
                        onClose={closeEditTagDialog}
                        tag={tagToEdit}
                        onEditTagSuccess={onEditTagSuccess}
                    />
                    <ConfirmDialog
                        open={confirmDeleteTagDialogIsOpen}
                        isPerformingAction={isDeletingTag}
                        onConfirm={onClickConfirmDelete}
                        onClose={onCloseConfirmDialog}
                        title="Delete Tag"
                        content={`Are you sure want to delete tag ${tagToDelete?.name}? Deleting the tag will remove it from the priorities and from ticket creation. However, it will continue to exist on previously created tickets.`}
                        confirmButtonText="Yes"
                    />
                </Box>
            ) : (
                <CenterLoadingSpinner size="large" />
            )}
        </BoardAdminContainer>
    );
}
