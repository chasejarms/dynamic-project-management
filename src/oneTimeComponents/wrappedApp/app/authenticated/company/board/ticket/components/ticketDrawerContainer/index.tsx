/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { Tabs, Tab } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { TicketType } from "../../../../../../../../../models/ticket/ticketType";
import { DrawerContainer } from "../../../components/drawerContainer";
import { RouteCreator } from "../../../../../../utils/routeCreator";

export interface TicketDrawerContainerProps {
    children: React.ReactNode;
    disallowPageNavigation?: boolean;
    ticketType: TicketType;
}

export function TicketDrawerContainer(props: TicketDrawerContainerProps) {
    const { companyId, boardId, ticketId } = useAppRouterParams();

    function ticketDataRoute() {
        if (props.ticketType === TicketType.InProgress) {
            return RouteCreator.inProgressTicketData(
                companyId,
                boardId,
                ticketId
            );
        } else if (props.ticketType === TicketType.Backlog) {
            return RouteCreator.backlogTicketData(companyId, boardId, ticketId);
        } else {
            return RouteCreator.archivedTicketData(
                companyId,
                boardId,
                ticketId
            );
        }
    }

    function ticketImagesRoute() {
        if (props.ticketType === TicketType.InProgress) {
            return RouteCreator.inProgressTicketImages(
                companyId,
                boardId,
                ticketId
            );
        } else if (props.ticketType === TicketType.Backlog) {
            return RouteCreator.backlogTicketImages(
                companyId,
                boardId,
                ticketId
            );
        } else {
            return RouteCreator.archivedTicketImages(
                companyId,
                boardId,
                ticketId
            );
        }
    }

    const tabs: {
        label: string;
        route: string;
    }[] = [
        {
            label: "Fields",
            route: ticketDataRoute(),
        },
        {
            label: "Images",
            route: ticketImagesRoute(),
        },
    ];

    const history = useHistory();
    const location = useLocation();
    function navigateToRoute(route: string) {
        return () => {
            history.push(route);
        };
    }

    const matchingTabValue =
        tabs.find((tab) => {
            return tab.route === location.pathname;
        })?.route || false;

    const classes = createClasses();

    function closeDrawer() {
        if (!props.disallowPageNavigation) {
            if (props.ticketType === TicketType.InProgress) {
                const route = RouteCreator.inProgressTickets(
                    companyId,
                    boardId
                );
                history.push(route);
            } else if (props.ticketType === TicketType.Backlog) {
                const route = RouteCreator.backlogTickets(companyId, boardId);
                history.push(route);
            } else {
                const route = RouteCreator.archivedTickets(companyId, boardId);
                history.push(route);
            }
        }
    }

    return (
        <DrawerContainer darkOpacityOnClick={closeDrawer}>
            <div css={classes.drawerAppBarContainer}>
                <Tabs
                    disabled={!!props.disallowPageNavigation}
                    value={matchingTabValue}
                    variant="scrollable"
                    scrollButtons="auto"
                    indicatorColor="secondary"
                    textColor="secondary"
                >
                    {tabs.map(({ route, label }, index) => {
                        return (
                            <Tab
                                disabled={!!props.disallowPageNavigation}
                                label={label}
                                onClick={navigateToRoute(route)}
                                value={route}
                            />
                        );
                    })}
                </Tabs>
            </div>
            <div css={classes.drawerInnerContentContainer}>
                {props.children}
            </div>
        </DrawerContainer>
    );
}

const createClasses = () => {
    const drawerAppBarContainer = css`
        flex: 0 0 auto;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    `;

    const drawerInnerContentContainer = css`
        flex-grow: 1;
        display: flex;
    `;

    return {
        drawerAppBarContainer,
        drawerInnerContentContainer,
    };
};
