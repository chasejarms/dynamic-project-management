/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Paper, Typography, makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import { isEqual } from "lodash";
import { ISimplifiedTag } from "../../models/simplifiedTag";
import { ITag } from "../../models/tag";
import { AddOutlined } from "@material-ui/icons";
import { TagChip } from "../tagChip";

export interface ITicketTagsProps {
    tags: ISimplifiedTag[];
    allTagsForBoard: ITag[];
    onTagsChange: (simplifiedTags: ISimplifiedTag[], isDirty: boolean) => void;
}

const useStyles = makeStyles({
    ticketTagsPaper: {
        height: "100%",
    },
});

export function TicketTags(props: ITicketTagsProps) {
    const classes = createClasses();
    const materialClasses = useStyles();
    const [databaseAndLocalTags, setDatabaseAndLocalTags] = useState({
        databaseTags: props.tags,
        localTags: props.tags,
    });

    function removeTagFromSelectedTags(tagName: string) {
        return () => {
            setDatabaseAndLocalTags((previousDatabaseAndLocalTags) => {
                const tagsWithoutRemovedTag = previousDatabaseAndLocalTags.localTags.filter(
                    (tag) => tag.name !== tagName
                );
                return {
                    ...previousDatabaseAndLocalTags,
                    localTags: tagsWithoutRemovedTag,
                };
            });
        };
    }

    function handleAddTag(tag: ITag) {
        return () => {
            setDatabaseAndLocalTags((previousDatabaseAndLocalTags) => {
                const tagsWithAddedTag: ISimplifiedTag[] = [
                    ...previousDatabaseAndLocalTags.localTags,
                    {
                        name: tag.name,
                        color: tag.color,
                    },
                ];
                return {
                    ...previousDatabaseAndLocalTags,
                    localTags: tagsWithAddedTag,
                };
            });
        };
    }

    useEffect(() => {
        setDatabaseAndLocalTags({
            databaseTags: props.tags,
            localTags: props.tags,
        });
    }, [props.tags]);

    useEffect(() => {
        const isDirty = !isEqual(
            databaseAndLocalTags.localTags,
            databaseAndLocalTags.databaseTags
        );
        props.onTagsChange(databaseAndLocalTags.localTags, isDirty);
    }, [databaseAndLocalTags.localTags]);

    const localTags = databaseAndLocalTags.localTags;
    const alreadyAddedTagsMapping = localTags.reduce<{
        [tagName: string]: true;
    }>((mapping, tag) => {
        mapping[tag.name] = true;
        return mapping;
    }, {});

    return (
        <>
            <div>
                <div css={classes.outerTicketTagsContainer}>
                    <div>
                        <Paper className={materialClasses.ticketTagsPaper}>
                            <div css={classes.ticketTagsInnerContainer}>
                                <Typography variant="h6">Tags</Typography>
                                {localTags.length === 0 ? (
                                    <div
                                        css={
                                            classes.centerAllTagsMessageContainer
                                        }
                                    >
                                        <Typography>
                                            No tags have been added yet
                                        </Typography>
                                    </div>
                                ) : (
                                    <div css={classes.allChipsSpacingContainer}>
                                        {localTags.map((tag) => {
                                            return (
                                                <div
                                                    css={
                                                        classes.individualChipContainer
                                                    }
                                                    key={tag.name}
                                                >
                                                    <TagChip
                                                        clickable
                                                        onClick={removeTagFromSelectedTags(
                                                            tag.name
                                                        )}
                                                        onDelete={removeTagFromSelectedTags(
                                                            tag.name
                                                        )}
                                                        tagName={tag.name}
                                                        tagColor={tag.color}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </Paper>
                    </div>
                    <div />
                </div>
            </div>
            <div>
                <div css={classes.outerTagsOptionsContainer}>
                    <div>
                        <Paper className={materialClasses.ticketTagsPaper}>
                            <div css={classes.ticketTagsInnerContainer}>
                                <Typography variant="h6">
                                    All Tags For Board
                                </Typography>
                                <div css={classes.allChipsSpacingContainer}>
                                    {props.allTagsForBoard
                                        .filter((tag) => {
                                            const tagIsNotAlreadyOnTicket = !alreadyAddedTagsMapping[
                                                tag.name
                                            ];
                                            return tagIsNotAlreadyOnTicket;
                                        })
                                        .map((tag) => {
                                            return (
                                                <div
                                                    css={
                                                        classes.individualChipContainer
                                                    }
                                                    key={tag.name}
                                                >
                                                    <TagChip
                                                        clickable
                                                        onClick={handleAddTag(
                                                            tag
                                                        )}
                                                        deleteIcon={
                                                            <AddOutlined />
                                                        }
                                                        onDelete={handleAddTag(
                                                            tag
                                                        )}
                                                        tagName={tag.name}
                                                        tagColor={tag.color}
                                                    />
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </Paper>
                    </div>
                    <div></div>
                </div>
            </div>
        </>
    );
}

const createClasses = () => {
    const ticketTagsInnerContainer = css`
        padding: 16px;
        display: flex;
        flex-direction: column;
        height: 100%;
    `;

    const outerTicketTagsContainer = css`
        display: grid;
        height: 100%;
        grid-template-rows: 1fr 1fr;
    `;

    const outerTagsOptionsContainer = css`
        display: grid;
        height: 100%;
        grid-template-rows: 1fr 1fr;
    `;

    const allChipsSpacingContainer = css`
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 8px;
    `;

    const individualChipContainer = css`
        margin-right: 4px;
        margin-bottom: 4px;
    `;

    const centerAllTagsMessageContainer = css`
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        padding: 16px;
        text-align: center;
    `;

    return {
        ticketTagsInnerContainer,
        outerTicketTagsContainer,
        outerTagsOptionsContainer,
        allChipsSpacingContainer,
        individualChipContainer,
        centerAllTagsMessageContainer,
    };
};
