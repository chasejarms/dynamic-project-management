/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../../../../../components/centerLoadingSpinner";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { BoardAdminContainer } from "../../../../../../../../components/boardAdminContainer";
import { ITag } from "../../../../../../../../models/tag";
import { WrappedButton } from "../../../../../../../../components/wrappedButton";
import { NewTagDialog } from "../../../../../../../../components/newTagDialog";
import { sortBy } from "lodash";
import { composeCSS } from "../../../../../../../../styles/composeCSS";
import { mapColorToMaterialThemeColorLight } from "../../../../../../../../utils/mapColorToMaterialThemeColorLight";

const useStyles = makeStyles({
    toolbar: {
        paddingLeft: "16px",
        paddingRight: "16px",
    },
    tableContainer: {
        maxHeight: 400,
    },
    tableHeadCell: {
        backgroundColor: "white",
    },
});

export function TagsManager() {
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

    const classes = createClasses();
    const materialClasses = useStyles();
    const theme = useTheme();

    return (
        <BoardAdminContainer>
            {!isLoadingTags ? (
                <div css={classes.tablePaperContainer}>
                    <Paper>
                        <Toolbar className={materialClasses.toolbar}>
                            <div css={classes.toolbarContainer}>
                                <Typography variant="h6">Tags</Typography>
                                <div>
                                    <WrappedButton
                                        onClick={onClickAddTag}
                                        color="primary"
                                    >
                                        Add Tag
                                    </WrappedButton>
                                </div>
                            </div>
                        </Toolbar>
                        <TableContainer
                            className={materialClasses.tableContainer}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            className={
                                                materialClasses.tableHeadCell
                                            }
                                        >
                                            Tag Name
                                        </TableCell>
                                        <TableCell
                                            className={
                                                materialClasses.tableHeadCell
                                            }
                                        >
                                            Tag Color
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allTagsForBoard.map((tag) => {
                                        const hexColorMain = mapColorToMaterialThemeColorLight(
                                            theme,
                                            tag.color
                                        );
                                        const individualColorOuterContainer = css`
                                            background-color: ${hexColorMain};
                                        `;

                                        return (
                                            <TableRow key={tag.name}>
                                                <TableCell>
                                                    {tag.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div
                                                        css={composeCSS(
                                                            classes.colorContainer,
                                                            individualColorOuterContainer
                                                        )}
                                                    />
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
                </div>
            ) : (
                <CenterLoadingSpinner size="large" />
            )}
        </BoardAdminContainer>
    );
}

const createClasses = () => {
    const tablePaperContainer = css`
        padding: 32px;
        width: 100%;
        height: 100%;
    `;

    const relativePositionedTableCell = css`
        position: relative;
        height: 100%;
    `;

    const absolutePositionedTableCell = css`
        position: absolute;
        left: -11px;
        height: 100%;
        display: flex;
        align-items: center;
    `;

    const toolbarContainer = css`
        width: 100%;
        display: flex;
        justify-content: space-between;
    `;

    const colorContainer = css`
        width: 16px;
        height: 16px;
        border-radius: 50%;
    `;

    return {
        tablePaperContainer,
        relativePositionedTableCell,
        absolutePositionedTableCell,
        toolbarContainer,
        colorContainer,
    };
};
