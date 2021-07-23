/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Card,
    CardContent,
    Typography,
    Theme,
    useTheme,
    CircularProgress,
    makeStyles,
    Chip,
    IconButton,
} from "@material-ui/core";
import { DragIndicator, Add } from "@material-ui/icons";
import { useState, useEffect, useMemo } from "react";
import {
    DragDropContext,
    DropResult,
    Droppable,
    Draggable,
} from "react-beautiful-dnd";
import { Api } from "../../../../../../../api";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { ITag } from "../../../../../../../models/tag";
import { composeCSS } from "../../../../../../../styles/composeCSS";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { NewTagDialog } from "../../../../../../../components/newTagDialog";
import { sortBy } from "lodash";

const useStyles = makeStyles({
    cardRoot: {
        height: "100%",
    },
});

export function Priorities() {
    const theme = useTheme();
    const classes = createClasses(theme);
    const materialClasses = useStyles();
    const { boardId, companyId } = useAppRouterParams();

    const [isLoadingTags, setIsLoadingTags] = useState(true);
    const [priorityListAndTagsList, setPriorityListAndTagsList] = useState<{
        priorityList: string[];
        tagsList: ITag[];
    }>({
        priorityList: [],
        tagsList: [],
    });
    function setPriorityList(
        createUpdatedPriorityListFunction: (
            previousPriorityList: string[]
        ) => string[]
    ) {
        setPriorityListAndTagsList((previousPriorityListAndTagsList) => {
            return {
                ...previousPriorityListAndTagsList,
                priorityList: createUpdatedPriorityListFunction(
                    previousPriorityListAndTagsList.priorityList
                ),
            };
        });
    }

    function setTagsList(
        updatedTagsListFunction: (previousTagsList: ITag[]) => ITag[]
    ) {
        setPriorityListAndTagsList((previousPriorityListAndTagsList) => {
            return {
                ...previousPriorityListAndTagsList,
                tagsList: updatedTagsListFunction(
                    previousPriorityListAndTagsList.tagsList
                ),
            };
        });
    }

    const { mappedPriorityList, unprioritizedTags } = useMemo(() => {
        const mappedPriorityList = priorityListAndTagsList.priorityList.reduce<{
            [key: string]: boolean;
        }>((priorityMapping, priority) => {
            priorityMapping[priority] = true;
            return priorityMapping;
        }, {});

        const unprioritizedTags = priorityListAndTagsList.tagsList
            .filter((tag) => {
                return !mappedPriorityList[tag.name];
            })
            .map((unprioritizedTag) => {
                return unprioritizedTag.name;
            });

        return {
            mappedPriorityList,
            unprioritizedTags,
        };
    }, [priorityListAndTagsList]);

    useEffect(() => {
        let didCancel = false;

        if (!companyId || !boardId) return;

        Promise.all([
            Api.priorities.getAllTagsForBoard(companyId, boardId),
            Api.priorities.getPrioritiesForBoard(companyId, boardId),
        ])
            .then(([tags, priorities]) => {
                if (didCancel) return;
                setPriorityListAndTagsList({
                    tagsList: tags,
                    priorityList: priorities,
                });
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;

                setIsLoadingTags(false);
            });

        return () => {
            didCancel = true;
        };
    }, [companyId, boardId]);

    function onDragEnd(result: DropResult) {
        const { destination, source, draggableId } = result;
        const destinationIsPriorityList =
            destination?.droppableId === "priority-list";
        if (!destinationIsPriorityList) return;

        const isReorderOfPriorityList = draggableId.startsWith(
            "PRIORITIZEDCOLUMN-"
        );
        if (isReorderOfPriorityList) {
            const actualTag = draggableId.replace("PRIORITIZEDCOLUMN-", "");
            setPriorityList((existingPriorityList) => {
                const arrayBeforeItem = existingPriorityList.slice(
                    0,
                    source.index
                );
                const arrayAfterItem = existingPriorityList.slice(
                    source.index + 1
                );
                const arrayWithItemRemoved = arrayBeforeItem.concat(
                    arrayAfterItem
                );

                const arrayBeforeInsertedIndex = arrayWithItemRemoved.slice(
                    0,
                    destination!.index
                );
                const arrayAfterInsertedIndex = arrayWithItemRemoved.slice(
                    destination!.index
                );
                const updatedPriorities = arrayBeforeInsertedIndex
                    .concat([actualTag])
                    .concat(arrayAfterInsertedIndex);

                Api.priorities.updatePrioritiesForBoard(
                    companyId,
                    boardId,
                    updatedPriorities
                );

                return updatedPriorities;
            });
        } else {
            setPriorityList((existingPriorityList) => {
                const arrayBeforeInsertedIndex = existingPriorityList.slice(
                    0,
                    destination!.index
                );
                const arrayAfterInsertedIndex = existingPriorityList.slice(
                    destination!.index
                );
                const updatedPriorities = arrayBeforeInsertedIndex
                    .concat([draggableId])
                    .concat(arrayAfterInsertedIndex);

                Api.priorities.updatePrioritiesForBoard(
                    companyId,
                    boardId,
                    updatedPriorities
                );

                return updatedPriorities;
            });
        }
    }

    const [tagsCreatorIsOpen, setTagsCreatorIsOpen] = useState(false);
    function openTagsCreator() {
        setTagsCreatorIsOpen(true);
    }
    function closeTagsCreator() {
        setTagsCreatorIsOpen(false);
    }

    function onCreateTagSuccess(createdTag: ITag) {
        setTagsList((previousTagsList) => {
            const orderedTagsList = sortBy(
                [createdTag, ...previousTagsList],
                "name"
            );
            return orderedTagsList;
        });
    }

    return (
        <BoardContainer>
            <DragDropContext onDragEnd={onDragEnd}>
                <div css={classes.container}>
                    <Card css={classes.card}>
                        <CardContent
                            classes={{
                                root: materialClasses.cardRoot,
                            }}
                        >
                            <div css={classes.cardContent}>
                                <div css={classes.titleContainer}>
                                    <Typography variant="h5">
                                        Prioritized Tags (High to Low)
                                    </Typography>
                                </div>
                                <div css={classes.innerCardContent}>
                                    {isLoadingTags ? (
                                        <div css={classes.centerContent}>
                                            <CircularProgress
                                                color="primary"
                                                size={24}
                                                thickness={4}
                                            />
                                        </div>
                                    ) : (
                                        <Droppable
                                            droppableId={"priority-list"}
                                        >
                                            {(provided) => {
                                                return (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {priorityListAndTagsList
                                                            .priorityList
                                                            .length === 0 ? (
                                                            <div
                                                                css={
                                                                    classes.centerContent
                                                                }
                                                            >
                                                                <div
                                                                    css={
                                                                        classes.centerText
                                                                    }
                                                                >
                                                                    <Typography>
                                                                        There
                                                                        are
                                                                        currently
                                                                        no
                                                                        prioritized
                                                                        tags.
                                                                        Drag
                                                                        tags
                                                                        from the
                                                                        Unprioritized
                                                                        Tags
                                                                        section
                                                                        to begin
                                                                        prioritizing.
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            priorityListAndTagsList.priorityList.map(
                                                                (
                                                                    priority,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <Draggable
                                                                            draggableId={`PRIORITIZEDCOLUMN-${priority}`}
                                                                            index={
                                                                                index
                                                                            }
                                                                            key={
                                                                                priority
                                                                            }
                                                                        >
                                                                            {(
                                                                                provided
                                                                            ) => {
                                                                                return (
                                                                                    <div
                                                                                        css={
                                                                                            classes.chipContainer
                                                                                        }
                                                                                    >
                                                                                        <Chip
                                                                                            icon={
                                                                                                <DragIndicator />
                                                                                            }
                                                                                            label={
                                                                                                priority
                                                                                            }
                                                                                            {...provided.draggableProps}
                                                                                            ref={
                                                                                                provided.innerRef
                                                                                            }
                                                                                            {...provided.dragHandleProps}
                                                                                            // onDelete={() => null}
                                                                                            // className={classes.chip}
                                                                                        />
                                                                                    </div>
                                                                                );
                                                                            }}
                                                                        </Draggable>
                                                                    );
                                                                }
                                                            )
                                                        )}
                                                        {provided.placeholder}
                                                    </div>
                                                );
                                            }}
                                        </Droppable>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent
                            classes={{
                                root: materialClasses.cardRoot,
                            }}
                        >
                            <div css={classes.cardContent}>
                                <div
                                    css={composeCSS(
                                        classes.titleContainer,
                                        classes.unprioritizedTitleContainer
                                    )}
                                >
                                    <Typography variant="h5">
                                        Unprioritized Tags
                                    </Typography>
                                    <div>
                                        <IconButton onClick={openTagsCreator}>
                                            <Add />
                                        </IconButton>
                                    </div>
                                </div>
                                <div css={classes.innerCardContent}>
                                    {isLoadingTags ? (
                                        <div css={classes.centerContent}>
                                            <CircularProgress
                                                color="primary"
                                                size={24}
                                                thickness={4}
                                            />
                                        </div>
                                    ) : unprioritizedTags.length === 0 &&
                                      priorityListAndTagsList.priorityList
                                          .length === 0 ? (
                                        <div css={classes.centerContent}>
                                            <div css={classes.centerText}>
                                                <Typography>
                                                    There are currently no tags
                                                    for this board. Click the
                                                    add button above to add some
                                                    tags.
                                                </Typography>
                                            </div>
                                        </div>
                                    ) : unprioritizedTags.length === 0 ? (
                                        <div css={classes.centerContent}>
                                            <div css={classes.centerText}>
                                                <Typography>
                                                    Nice work! All active tags
                                                    have been prioritized.
                                                </Typography>
                                            </div>
                                        </div>
                                    ) : (
                                        <Droppable
                                            droppableId={"unprioritized-list"}
                                        >
                                            {(provided) => {
                                                return (
                                                    <div
                                                        css={
                                                            classes.chipContainer
                                                        }
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {unprioritizedTags.map(
                                                            (tag, index) => {
                                                                return (
                                                                    <Draggable
                                                                        draggableId={
                                                                            tag
                                                                        }
                                                                        index={
                                                                            index
                                                                        }
                                                                        key={
                                                                            tag
                                                                        }
                                                                    >
                                                                        {(
                                                                            provided
                                                                        ) => {
                                                                            return (
                                                                                <div
                                                                                    css={
                                                                                        classes.unprioritizedTagContainer
                                                                                    }
                                                                                >
                                                                                    <Chip
                                                                                        icon={
                                                                                            <DragIndicator />
                                                                                        }
                                                                                        label={
                                                                                            tag
                                                                                        }
                                                                                        {...provided.draggableProps}
                                                                                        ref={
                                                                                            provided.innerRef
                                                                                        }
                                                                                        {...provided.dragHandleProps}
                                                                                        // onDelete={() => null}
                                                                                        // className={classes.chip}
                                                                                    />
                                                                                </div>
                                                                            );
                                                                        }}
                                                                    </Draggable>
                                                                );
                                                            }
                                                        )}
                                                        {provided.placeholder}
                                                    </div>
                                                );
                                            }}
                                        </Droppable>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <NewTagDialog
                    open={tagsCreatorIsOpen}
                    onClose={closeTagsCreator}
                    onCreateTagSuccess={onCreateTagSuccess}
                />
            </DragDropContext>
        </BoardContainer>
    );
}

function createClasses(theme: Theme) {
    const container = css`
        padding: 32px;
        display: grid;
        grid-gap: 16px;
        grid-template-columns: 1fr 1fr;
        height: 100%;
    `;

    const titleContainer = css`
        flex: 0 0 auto;
        margin-bottom: ${theme.spacing() * 2}px;
    `;

    const unprioritizedTitleContainer = css`
        display: flex;
        justify-content: space-between;
    `;

    const card = css`
        height: 100%;
    `;

    const cardContent = css`
        height: 100%;
        display: flex;
        flex-direction: column;
    `;

    const innerCardContent = css`
        flex-grow: 1;
    `;

    const centerContent = css`
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
    `;

    const centerText = css`
        text-align: center;
    `;

    const chipContainer = css`
        margin: 8px 0px;
    `;

    const unprioritizedTagsContainer = css`
        display: flex;
        flex-wrap: wrap;
    `;

    const unprioritizedTagContainer = css`
        margin-right: 8px;
        margin-bottom: 8px;
    `;

    const tagInputContainer = css`
        width: 300px;
    `;

    return {
        container,
        titleContainer,
        card,
        cardContent,
        innerCardContent,
        centerContent,
        centerText,
        chipContainer,
        unprioritizedTagsContainer,
        unprioritizedTagContainer,
        unprioritizedTitleContainer,
        tagInputContainer,
    };
}
