/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Theme, useTheme } from "@material-ui/core";
import { useState, useEffect, useMemo } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Api } from "../../../../../../../api";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { ITag } from "../../../../../../../models/tag";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { NewTagDialog } from "../../../../../../../components/newTagDialog";
import { cloneDeep, sortBy } from "lodash";
import { useIsBoardAdmin } from "../../../../../../../hooks/useIsBoardAdmin";
import { PrioritizedTagsCard } from "../../../../../../../components/prioritizedTagsCard";
import { UnprioritizedTagsCard } from "../../../../../../../components/unprioritizedTagsCard";

export function Priorities() {
    const theme = useTheme();
    const classes = createClasses(theme);
    const { boardId, companyId } = useAppRouterParams();
    const isBoardAdmin = useIsBoardAdmin();

    const [isLoadingTags, setIsLoadingTags] = useState(true);
    const [allTagsForBoard, setAllTagsForBoard] = useState<ITag[]>([]);
    const [
        priorityListAndTagsMapping,
        setPriorityListAndTagsMapping,
    ] = useState<{
        priorityList: string[];
        tagsMapping: {
            [tagName: string]: ITag;
        };
    }>({
        priorityList: [],
        tagsMapping: {},
    });
    function setPriorityList(
        createUpdatedPriorityListFunction: (
            previousPriorityList: string[]
        ) => string[]
    ) {
        setPriorityListAndTagsMapping((previousPriorityListAndTagsMapping) => {
            return {
                ...previousPriorityListAndTagsMapping,
                priorityList: createUpdatedPriorityListFunction(
                    previousPriorityListAndTagsMapping.priorityList
                ),
            };
        });
    }

    function setTagsMapping(
        updatedTagsListFunction: (previousTagsMapping: {
            [tagName: string]: ITag;
        }) => {
            [tagName: string]: ITag;
        }
    ) {
        setPriorityListAndTagsMapping((previousPriorityListAndTagsMapping) => {
            return {
                ...previousPriorityListAndTagsMapping,
                tagsMapping: updatedTagsListFunction(
                    previousPriorityListAndTagsMapping.tagsMapping
                ),
            };
        });
    }

    const { mappedPriorityList, unprioritizedTags } = useMemo(() => {
        const mappedPriorityList = priorityListAndTagsMapping.priorityList.reduce<{
            [key: string]: boolean;
        }>((priorityMapping, priority) => {
            priorityMapping[priority] = true;
            return priorityMapping;
        }, {});

        const unprioritizedTags = Object.keys(
            priorityListAndTagsMapping.tagsMapping
        )
            .filter((tagName) => {
                return !mappedPriorityList[tagName];
            })
            .map((tagName) => {
                return tagName;
            });

        return {
            mappedPriorityList,
            unprioritizedTags,
        };
    }, [priorityListAndTagsMapping]);

    useEffect(() => {
        let didCancel = false;

        if (!companyId || !boardId) return;

        Promise.all([
            Api.priorities.getAllTagsForBoard(companyId, boardId),
            Api.priorities.getPrioritiesForBoard(companyId, boardId),
        ])
            .then(([tags, priorities]) => {
                if (didCancel) return;

                const tagsMapping = tags.reduce<{
                    [tagName: string]: ITag;
                }>((mapping, tag) => {
                    mapping[tag.name] = tag;
                    return mapping;
                }, {});

                const onlyExistingPriorities = priorities.filter((priority) => {
                    return !!tagsMapping[priority];
                });

                setPriorityListAndTagsMapping({
                    tagsMapping,
                    priorityList: onlyExistingPriorities,
                });
                setAllTagsForBoard(tags);
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
        const { destination, draggableId } = result;
        const destinationIsPriorityList =
            destination?.droppableId === "priority-list";

        const itemComesFromPriorityList = draggableId.startsWith(
            "PRIORITIZEDCOLUMN-"
        );

        if (destinationIsPriorityList) {
            if (itemComesFromPriorityList) {
                reorderPriorityList(result);
            } else {
                addToPriorityListFromUnprioritizedTags(result);
            }
        } else {
            if (itemComesFromPriorityList) {
                removeItemFromPriorityList(result);
            } else {
                // do nothing, we don't have to reorganize these ones
            }
        }
    }

    function reorderPriorityList(result: DropResult) {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        const actualTag = draggableId.replace("PRIORITIZEDCOLUMN-", "");
        setPriorityList((existingPriorityList) => {
            const arrayBeforeItem = existingPriorityList.slice(0, source.index);
            const arrayAfterItem = existingPriorityList.slice(source.index + 1);
            const arrayWithItemRemoved = arrayBeforeItem.concat(arrayAfterItem);

            const arrayBeforeInsertedIndex = arrayWithItemRemoved.slice(
                0,
                destination.index
            );
            const arrayAfterInsertedIndex = arrayWithItemRemoved.slice(
                destination.index
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
    }

    function addToPriorityListFromUnprioritizedTags(result: DropResult) {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        setPriorityList((existingPriorityList) => {
            const arrayBeforeInsertedIndex = existingPriorityList.slice(
                0,
                destination.index
            );
            const arrayAfterInsertedIndex = existingPriorityList.slice(
                destination.index
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

    function removeItemFromPriorityList(result: DropResult) {
        const { destination, source, draggableId } = result;
        const actualTag = draggableId.replace("PRIORITIZEDCOLUMN-", "");
        setPriorityList((existingPriorityList) => {
            const arrayBeforeItem = existingPriorityList.slice(0, source.index);
            const arrayAfterItem = existingPriorityList.slice(source.index + 1);

            const updatedPriorities = arrayBeforeItem.concat(arrayAfterItem);

            Api.priorities.updatePrioritiesForBoard(
                companyId,
                boardId,
                updatedPriorities
            );

            return updatedPriorities;
        });
    }

    const [tagsCreatorIsOpen, setTagsCreatorIsOpen] = useState(false);
    function openTagsCreator() {
        setTagsCreatorIsOpen(true);
    }
    function closeTagsCreator() {
        setTagsCreatorIsOpen(false);
    }

    function onCreateTagSuccess(createdTag: ITag) {
        setAllTagsForBoard((previousAllTagsForBoard) => {
            const sortedTags = sortBy(
                [...previousAllTagsForBoard, createdTag],
                "itemId"
            );
            return sortedTags;
        });
        setTagsMapping((previousTagsMapping) => {
            const clonedTagsMapping = cloneDeep(previousTagsMapping);
            clonedTagsMapping[createdTag.name] = createdTag;
            return clonedTagsMapping;
        });
        setPriorityListAndTagsMapping((previousPriorityListAndTagsMapping) => {
            const clonedTagsMapping = cloneDeep(
                previousPriorityListAndTagsMapping.tagsMapping
            );
            clonedTagsMapping[createdTag.name] = createdTag;

            return {
                ...previousPriorityListAndTagsMapping,
                tagsMapping: clonedTagsMapping,
            };
        });
    }

    return (
        <BoardContainer>
            <DragDropContext onDragEnd={onDragEnd}>
                <div css={classes.container}>
                    <PrioritizedTagsCard
                        isLoading={isLoadingTags}
                        canDragTags={isBoardAdmin}
                        tagsPriorityList={
                            priorityListAndTagsMapping.priorityList
                        }
                        tagsPriorityListMapping={
                            priorityListAndTagsMapping.tagsMapping
                        }
                    />
                    <UnprioritizedTagsCard
                        isLoading={isLoadingTags}
                        canDragTags={isBoardAdmin}
                        canAddTags={isBoardAdmin}
                        allTags={allTagsForBoard}
                        prioritizedTags={
                            priorityListAndTagsMapping.priorityList
                        }
                        onClickAddTags={openTagsCreator}
                    />
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
