/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Card,
    CardContent,
    CircularProgress,
    makeStyles,
    Theme,
    Typography,
    useTheme,
} from "@material-ui/core";
import { DragIndicator } from "@material-ui/icons";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ITag } from "../../models/tag";
import { TagChip } from "../tagChip";

const useStyles = makeStyles({
    cardRoot: {
        height: "100%",
    },
});

export interface ITagsPriorityListMapping {
    [tagName: string]: ITag;
}

export interface IPrioritizedTagsCardProps {
    canDragTags: boolean;
    isLoading: boolean;
    tagsPriorityList: string[];
    tagsPriorityListMapping: ITagsPriorityListMapping;
}

export function PrioritizedTagsCard(props: IPrioritizedTagsCardProps) {
    const theme = useTheme();
    const classes = createClasses(theme);
    const materialClasses = useStyles();
    const {
        canDragTags,
        isLoading,
        tagsPriorityList,
        tagsPriorityListMapping,
    } = props;

    function tagNameToTagColor(priority: string) {
        const { color } = tagsPriorityListMapping[priority];
        return color;
    }

    return (
        <Card css={classes.card}>
            <CardContent
                classes={{
                    root: materialClasses.cardRoot,
                }}
            >
                <div css={classes.cardContent}>
                    <div css={classes.titleContainer}>
                        <Typography variant="h5">Priorities</Typography>
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
                        ) : (
                            <Droppable droppableId={"priority-list"}>
                                {(provided) => {
                                    return (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            css={classes.priorityTagsContainer}
                                        >
                                            {tagsPriorityList.length === 0 ? (
                                                <div
                                                    css={classes.centerContent}
                                                >
                                                    <div
                                                        css={classes.centerText}
                                                    >
                                                        <Typography>
                                                            There are currently
                                                            no prioritized tags.
                                                            Drag tags from the
                                                            Unprioritized Tags
                                                            section to begin
                                                            prioritizing.
                                                        </Typography>
                                                    </div>
                                                </div>
                                            ) : (
                                                tagsPriorityList.map(
                                                    (priority, index) => {
                                                        const tagColor = tagNameToTagColor(
                                                            priority
                                                        );
                                                        return canDragTags ? (
                                                            <Draggable
                                                                draggableId={`PRIORITIZEDCOLUMN-${priority}`}
                                                                index={index}
                                                                key={priority}
                                                            >
                                                                {(provided) => {
                                                                    return (
                                                                        <TagChip
                                                                            isUsedInVerticalList
                                                                            whiteBackground
                                                                            icon={
                                                                                <DragIndicator />
                                                                            }
                                                                            tagName={
                                                                                priority
                                                                            }
                                                                            tagColor={
                                                                                tagColor
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.dragHandleProps}
                                                                        />
                                                                    );
                                                                }}
                                                            </Draggable>
                                                        ) : (
                                                            <TagChip
                                                                isUsedInVerticalList
                                                                whiteBackground
                                                                tagName={
                                                                    priority
                                                                }
                                                                tagColor={
                                                                    tagColor
                                                                }
                                                                key={priority}
                                                            />
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

    const priorityTagsContainer = css`
        display: grid;
    `;

    return {
        container,
        titleContainer,
        card,
        cardContent,
        innerCardContent,
        centerContent,
        centerText,
        unprioritizedTagsContainer,
        unprioritizedTagContainer,
        unprioritizedTitleContainer,
        tagInputContainer,
        priorityTagsContainer,
    };
}
