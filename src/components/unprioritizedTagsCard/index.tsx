/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    makeStyles,
    Theme,
    Typography,
    useTheme,
} from "@material-ui/core";
import { Add, DragIndicator } from "@material-ui/icons";
import { useMemo } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ITag } from "../../models/tag";
import { composeCSS } from "../../styles/composeCSS";
import { TagChip } from "../tagChip";

const useStyles = makeStyles({
    cardRoot: {
        height: "100%",
    },
});

export interface ITagsPriorityListMapping {
    [tagName: string]: ITag;
}

export interface IUnprioritizedTagsCard {
    canDragTags: boolean;
    canAddTags: boolean;
    isLoading: boolean;
    allTags: ITag[];
    prioritizedTags: string[];
    onClickAddTags?: () => void;
}

export function UnprioritizedTagsCard(props: IUnprioritizedTagsCard) {
    const materialClasses = useStyles();
    const theme = useTheme();
    const classes = createClasses(theme);
    const {
        canDragTags,
        canAddTags,
        isLoading,
        allTags,
        prioritizedTags,
        onClickAddTags,
    } = props;

    const unprioritizedTags = useMemo(() => {
        const mappedPriorityList = prioritizedTags.reduce<{
            [key: string]: boolean;
        }>((priorityMapping, tagName) => {
            priorityMapping[tagName] = true;
            return priorityMapping;
        }, {});

        const unprioritizedTags = allTags.filter((tag) => {
            const tagName = tag.name;
            return !mappedPriorityList[tagName];
        });

        return unprioritizedTags;
    }, [prioritizedTags, isLoading]);

    return (
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
                        <Typography variant="h5">Unprioritized Tags</Typography>
                        <div css={classes.addContainer}>
                            {canAddTags && (
                                <div css={classes.addInnerContainer}>
                                    <IconButton
                                        onClick={onClickAddTags}
                                        color="primary"
                                    >
                                        <Add />
                                    </IconButton>
                                </div>
                            )}
                        </div>
                    </div>
                    <div css={classes.innerCardContent}>
                        {isLoading ? (
                            <div css={classes.centerContent}>
                                <CircularProgress
                                    color="primary"
                                    size={24}
                                    thickness={4}
                                />
                            </div>
                        ) : unprioritizedTags.length === 0 ? (
                            <div css={classes.centerContent}>
                                <div css={classes.centerText}>
                                    <Typography>
                                        All available tags have been prioritized
                                    </Typography>
                                </div>
                            </div>
                        ) : (
                            <Droppable droppableId={"unprioritized-list"}>
                                {(provided) => {
                                    return (
                                        <div
                                            css={classes.chipContainer}
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {unprioritizedTags.map(
                                                (tag, index) => {
                                                    if (canDragTags) {
                                                        return (
                                                            <Draggable
                                                                draggableId={
                                                                    tag.name
                                                                }
                                                                index={index}
                                                                key={tag.name}
                                                            >
                                                                {(provided) => {
                                                                    return (
                                                                        <div
                                                                            css={
                                                                                classes.unprioritizedTagContainer
                                                                            }
                                                                        >
                                                                            <TagChip
                                                                                whiteBackground
                                                                                icon={
                                                                                    <DragIndicator />
                                                                                }
                                                                                tagName={
                                                                                    tag.name
                                                                                }
                                                                                tagColor={
                                                                                    tag.color
                                                                                }
                                                                                {...provided.draggableProps}
                                                                                ref={
                                                                                    provided.innerRef
                                                                                }
                                                                                {...provided.dragHandleProps}
                                                                            />
                                                                        </div>
                                                                    );
                                                                }}
                                                            </Draggable>
                                                        );
                                                    } else {
                                                        return (
                                                            <div
                                                                css={
                                                                    classes.unprioritizedTagContainer
                                                                }
                                                            >
                                                                <TagChip
                                                                    whiteBackground
                                                                    tagName={
                                                                        tag.name
                                                                    }
                                                                    tagColor={
                                                                        tag.color
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    }
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

    const addContainer = css`
        width: 60px;
        position: relative;
    `;

    const addInnerContainer = css`
        position: absolute;
        left: 20px;
        bottom: -9px;
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
        addContainer,
        addInnerContainer,
    };
}
