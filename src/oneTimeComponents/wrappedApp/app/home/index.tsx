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
import { IWrappedButtonProps } from "../../../../components/wrappedButton";
import { useHistory } from "react-router-dom";
import { PrioritizationIsToughSvg } from "../../../../components/landingPageSvgs/prioritizationIsTough";
import { TeamVelocitySuffers } from "../../../../components/landingPageSvgs/teamVelocitySuffers";
import { ExistingSolutionsAreLimiting } from "../../../../components/landingPageSvgs/existingSolutionsAreLimiting";
import { RelativePrioritization } from "../../../../components/landingPageSvgs/relativePrioritization";
import { useBreakpoint } from "../../../../hooks/useBreakpoint";

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
        if (!destination) return;

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
            const actualTag = draggableId.replace("PRIORITIZEDCOLUMN-", "");
            const updatedPriorities = arrayBeforeInsertedIndex
                .concat([actualTag])
                .concat(arrayAfterInsertedIndex);

            return updatedPriorities;
        });
    }

    const history = useHistory();
    function scrollToExample() {
        const element = document.getElementById("example-section");
        if (!element) return;
        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            onClick: scrollToExample,
            children: "See An Example Project",
            color: "primary",
        },
        {
            onClick: () => {
                history.push("/contact");
            },
            children: "Request A Demo",
            color: "primary",
            variant: "outlined",
        },
    ];

    const breakpoints = useBreakpoint();
    const size = breakpoints.max768 ? 200 : 300;

    return (
        <NonAuthenticatedPageContainer>
            <LandingPageCommonSection
                title={"Prioritization is Tough"}
                textSections={[
                    "Prioritizing large projects is incredibly challenging. Between the backlog and the in progress board, there can be hundreds of individual tickets that the team needs to prioritize.",
                    "And as if that weren’t enough, stakeholders are often tweaking the direction of the project forcing the team to reorganize the board again and again. The more stakeholders that are involved, the more cumbersome this process becomes.",
                ]}
                placeContent="left"
                wrappedButtonProps={wrappedButtonProps}
                svgContent={<PrioritizationIsToughSvg size={size} />}
            />
            <LandingPageCommonSection
                title={"Team Velocity Suffers"}
                textSections={[
                    "Most of this work ends up falling on the project manager or the team lead. Instead of working on the product or spending time with customers, their time is consumed by administrative tasks.",
                    "And in spite of their best efforts, prioritization and backlog grooming often take a back seat to other responsibilities. When this happens, team members unknowingly work on low priority tasks.",
                ]}
                placeContent="right"
                wrappedButtonProps={wrappedButtonProps}
                svgContent={<TeamVelocitySuffers size={size} />}
            />
            <LandingPageCommonSection
                title={"Existing Solutions Are Limiting"}
                textSections={[
                    "Existing software solutions fall into one of two categories: Brute Force Prioritization and Fixed List Prioritization.",
                    "In brute force solutions, every ticket is managed individually and needs to be dragged up or down in the column to communicate priority. Not only is this time consuming but it's nearly impossible to maintain a perfectly prioritized board.",
                    "In fixed list solutions, the software provides a fixed list of tags like 'Low', 'Medium', and 'High'. When a project is small, this works great. But as the project grows, team members realize that 'Low' and 'Medium' tasks never get worked on so they begin adding the 'High' priority to every task",
                    "Unfortunately, when everything is everything is a high priority nothing is.",
                ]}
                placeContent="left"
                wrappedButtonProps={wrappedButtonProps}
                svgContent={<ExistingSolutionsAreLimiting size={size} />}
            />
            <LandingPageCommonSection
                title={"Introducing Relative Prioritization"}
                textSections={[
                    "Instead of having fixed lists or prioritizing each task individually, tasks can be prioritized in large chunks using dynamic tags.",
                    "Custom tags are applied to each ticket to indicate the type of work that the ticket represents. After applying proper tags and prioritizing the tags against each other, the backlog and all in progress tickets automatically adjust to reflect the new priorities.",
                ]}
                placeContent="right"
                wrappedButtonProps={wrappedButtonProps}
                svgContent={<RelativePrioritization size={size} />}
            />
            <div css={classes.exampleSection} id="example-section">
                <div css={classes.exampleTextContainer}>
                    <LandingPageCommonSection
                        title={"Example Board"}
                        textSections={[
                            "Reorder any of the priorities below to see the board adjust in real time. In a live project, adjusting the priorities will also reorganize the board backlog.",
                        ]}
                        placeContent="left"
                        hideTopAndBottomPadding
                        wrappedButtonProps={[wrappedButtonProps[1]]}
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
                                const tickets =
                                    columnsMapping[column.id].tickets;

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
                                                    isFirstTicket={
                                                        isFirstTicket
                                                    }
                                                    ticketType={
                                                        TicketType.InProgress
                                                    }
                                                    onUpdateTicketColumn={() =>
                                                        null
                                                    }
                                                    onDeleteTicket={() => null}
                                                    columnOptions={
                                                        mockColumnData
                                                    }
                                                    onClickDemoTicket={() =>
                                                        null
                                                    }
                                                />
                                            );
                                        })}
                                    </TicketContainer>
                                );
                            })}
                        </BoardColumnsContainer>
                    </div>
                </div>
            </div>
        </NonAuthenticatedPageContainer>
    );
}

const createClasses = (theme: Theme) => {
    const exampleOverflow = css`
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

    const exampleSection = css`
        width: 100%;
        overflow-x: auto;
        background-color: ${theme.palette.grey["200"]};
    `;

    const finalCTAContainer = css`
        padding: 24px;
        background-color: white;
        display: flex;
        justify-content: center;
    `;

    const innerCTAContainer = css`
        display: flex;
        flex-direction: row;
    `;

    const ctaTextContainer = css`
        margin-right: 24px;
    `;

    return {
        exampleOverflow,
        prioritiesContainer,
        boardTicketsContainer,
        exampleTextContainer,
        headerTextContainer,
        exampleDescriptionTextContainer,
        exampleSection,
        finalCTAContainer,
        innerCTAContainer,
        ctaTextContainer,
    };
};
