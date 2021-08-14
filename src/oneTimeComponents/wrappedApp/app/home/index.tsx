/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useTheme, Theme, Typography } from "@material-ui/core";
import { NonAuthenticatedPageContainer } from "../../../../components/nonAuthenticatedPageContainer";
import { LandingPageCommonSection } from "../../../../components/landingPageCommonSection";
import { BoardColumnsContainer } from "../../../../components/boardColumnsContainer";
import {
    mockColumnData,
    mockPriorities,
    mockTagsMapping,
    mockTickets,
} from "./mockData";
import { TicketContainer } from "../../../../components/ticketContainer";
import { useEffect, useState } from "react";
import { createColumnsMapping } from "../../../../utils/createColumnsMapping";
import {
    IAugmentedUITicket,
    TicketForBoard,
} from "../../../../components/ticketForBoard";
import { TicketType } from "../../../../models/ticket/ticketType";
import { PrioritizedTagsCard } from "../../../../components/prioritizedTagsCard";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { IColumn } from "../../../../models/column";
import { cloneDeep } from "lodash";

export function Home() {
    const theme = useTheme();
    const classes = createClasses(theme);
    const [columnsMapping, setColumnsMapping] = useState<{
        [columnId: string]: {
            columnInformation: IColumn;
            tickets: IAugmentedUITicket[];
        };
    }>({});
    const [priorityList, setPriorityList] = useState(cloneDeep(mockPriorities));

    useEffect(() => {
        const updatedColumnsMapping = createColumnsMapping(
            priorityList,
            mockColumnData,
            mockTickets
        );
        setColumnsMapping(updatedColumnsMapping);
    }, [priorityList]);

    function onDragEnd(result: DropResult) {
        const { destination, source, draggableId } = result;

        setPriorityList((existingPriorityList) => {
            const arrayBeforeItem = existingPriorityList.slice(0, source.index);
            const arrayAfterItem = existingPriorityList.slice(source.index + 1);
            const arrayWithItemRemoved = arrayBeforeItem.concat(arrayAfterItem);

            const arrayBeforeInsertedIndex = arrayWithItemRemoved.slice(
                0,
                destination!.index
            );
            const arrayAfterInsertedIndex = arrayWithItemRemoved.slice(
                destination!.index
            );
            const actualTag = draggableId.replace("PRIORITIZEDCOLUMN-", "");
            const updatedPriorities = arrayBeforeInsertedIndex
                .concat([actualTag])
                .concat(arrayAfterInsertedIndex);

            return updatedPriorities;
        });
    }

    return (
        <NonAuthenticatedPageContainer>
            <LandingPageCommonSection
                title={"Prioritization is Tough"}
                textSections={[
                    "Prioritizing large projects is incredibly challenging. Between the backlog and the in progress board, there can be hundreds of individual tickets that the team needs to prioritize.",
                    "And if that weren’t enough, stakeholders are often tweaking the direction of the project forcing them team to reorganize the board again and again. The more stakeholders that are involved, the more cumbersome this process becomes.",
                ]}
                placeContent="left"
            />
            <LandingPageCommonSection
                title={"Team Velocity Suffers"}
                textSections={[
                    "Most of this work ends up falling on the project manager or the team lead. Instead of working with customers or on the product, they spend countless hours on administrative tasks to ensure other team members are productive.",
                    "Even with all this effort, the complexity of taking in stakeholder input and applying it across hundreds of tasks leads to an imperfect board and team members unknowingly work on low priority tasks.",
                ]}
                placeContent="right"
            />
            <LandingPageCommonSection
                title={"Existing Solutions Are Limiting"}
                textSections={[
                    "The current solutions in the market can be put into two buckets: Brute Force Prioritization and Fixed Prioritization.",
                    "In brute force solutions, each and every ticket needs to be dragged up or down in a column to be prioritized. Not only is this time consuming but it's nearly impossible to maintain a perfectly prioritized board across many columns, especially when priorties shift.",
                    "In fixed solutions, the software provides a fixed list of tags like 'Low', 'Medium', and 'High'. When a project is small, this works great. But as the project grows, team members realize that 'Low' and 'Medium' tasks never get worked on so they add the 'High' priority to every task",
                    "And when everything is everything is high priority, nothing is.",
                ]}
                placeContent="left"
            />
            <LandingPageCommonSection
                title={"Introducing Relative Prioritization"}
                textSections={[
                    "Instead of having fixed lists or prioritizing each task individually, tasks can be prioritized in large groups with ticket tags.",
                    "Custom tags are applied to each task and when the tags are prioritized, the backlog and all in progress tickets are adjusted to reflect the new priorities.",
                ]}
                placeContent="right"
            />
            <div css={classes.exampleTextContainer}>
                <LandingPageCommonSection
                    title={"Example Board"}
                    textSections={[
                        "Reorder any of the priorities below to see the board adjust in real time. In a live project, adjusting the priorities will also reorganize the board backlog.",
                    ]}
                    placeContent="left"
                    hideTopAndBottomPadding
                />
            </div>
            <div css={classes.exampleOverflow}>
                <div css={classes.prioritiesContainer}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <PrioritizedTagsCard
                            isLoading={false}
                            canDragTags={true}
                            tagsPriorityList={priorityList}
                            tagsPriorityListMapping={mockTagsMapping}
                        />
                    </DragDropContext>
                </div>
                <div css={classes.boardTicketsContainer}>
                    <BoardColumnsContainer>
                        {mockColumnData.map((column) => {
                            const dataIsReady = !!columnsMapping[column.id];
                            if (!dataIsReady) return null;
                            const tickets = columnsMapping[column.id].tickets;

                            return (
                                <TicketContainer
                                    key={column.id}
                                    title={column.name}
                                >
                                    {tickets.map((ticket, index) => {
                                        const isFirstTicket = index === 0;
                                        return (
                                            <TicketForBoard
                                                key={ticket.title}
                                                ticket={ticket}
                                                isFirstTicket={isFirstTicket}
                                                ticketType={
                                                    TicketType.InProgress
                                                }
                                                onUpdateTicketColumn={() =>
                                                    null
                                                }
                                                onDeleteTicket={() => null}
                                                columnOptions={mockColumnData}
                                                onClickDemoTicket={() => null}
                                            />
                                        );
                                    })}
                                </TicketContainer>
                            );
                        })}
                    </BoardColumnsContainer>
                </div>
            </div>
            {/* show an example board with priorities right next to it here */}
            {/* invite them to schedule a demo and send them to the contact page */}
        </NonAuthenticatedPageContainer>
    );
}

const createClasses = (theme: Theme) => {
    const exampleOverflow = css`
        overflow-x: auto;
        width: 100%;
        height: 600px;
        display: flex;
        flex-direction: row;
        background-color: ${theme.palette.grey["200"]};
    `;

    const exampleTextContainer = css`
        background-color: ${theme.palette.grey["200"]};
        padding-top: 40px;
    `;

    const prioritiesContainer = css`
        flex: 0 0 auto;
        height: 100%;
        padding-top: 24px;
        padding-left: 24px;
        padding-bottom: 24px;
    `;

    const boardTicketsContainer = css`
        flex-grow: 1;
        height: 100%;
        display: flex;
    `;

    const headerTextContainer = css`
        padding-bottom: 16px;
    `;

    const exampleDescriptionTextContainer = css`
        width: 700px;
    `;

    return {
        exampleOverflow,
        prioritiesContainer,
        boardTicketsContainer,
        exampleTextContainer,
        headerTextContainer,
        exampleDescriptionTextContainer,
    };
};
