/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { useAppRouterParams } from "../../../../../../../../../hooks/useAppRouterParams";
import { Tabs, Tab } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { TicketType } from "../../../../../../../../../models/ticket/ticketType";
import { DrawerContainer } from "../../../components/drawerContainer";

export interface TicketDrawerContainerProps {
    children: React.ReactNode;
    disallowPageNavigation?: boolean;
    ticketType: TicketType;
}

export function TicketDrawerContainer(props: TicketDrawerContainerProps) {
    const { companyId, boardId, ticketId } = useAppRouterParams();

    function ticketDataRoute() {
        if (props.ticketType === TicketType.InProgress) {
            return `/app/company/${companyId}/board/${boardId}/tickets/${ticketId}/data`;
        } else if (props.ticketType === TicketType.Backlog) {
            return `/app/company/${companyId}/board/${boardId}/backlog-tickets/${ticketId}/data`;
        } else {
            return `/app/company/${companyId}/board/${boardId}/archived-tickets/${ticketId}/data`;
        }
    }

    function ticketImagesRoute() {
        if (props.ticketType === TicketType.InProgress) {
            return `/app/company/${companyId}/board/${boardId}/tickets/${ticketId}/images`;
        } else if (props.ticketType === TicketType.Backlog) {
            return `/app/company/${companyId}/board/${boardId}/backlog-tickets/${ticketId}/images`;
        } else {
            return `/app/company/${companyId}/board/${boardId}/archived-tickets/${ticketId}/images`;
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
                history.push(
                    `/app/company/${companyId}/board/${boardId}/tickets`
                );
            } else if (props.ticketType === TicketType.Backlog) {
                history.push(
                    `/app/company/${companyId}/board/${boardId}/backlog-tickets`
                );
            } else {
                history.push(
                    `/app/company/${companyId}/board/${boardId}/archived-tickets`
                );
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
