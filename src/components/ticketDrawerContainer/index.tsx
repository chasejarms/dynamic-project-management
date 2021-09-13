/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import { Tabs, Tab } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";

export interface TicketDrawerContainerProps {
    children: React.ReactNode;
    disallowClosingDrawer?: boolean;
}

export function TicketDrawerContainer(props: TicketDrawerContainerProps) {
    const { companyId, boardId, ticketId } = useAppRouterParams();

    const tabs: {
        label: string;
        route: string;
    }[] = [
        {
            label: "Data",
            route: `/app/company/${companyId}/board/${boardId}/tickets/${ticketId}/data`,
        },
        {
            label: "Images",
            route: `/app/company/${companyId}/board/${boardId}/tickets/${ticketId}/images`,
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
        if (!props.disallowClosingDrawer) {
            history.push(`/app/company/${companyId}/board/${boardId}/tickets`);
        }
    }

    return (
        <div css={classes.drawerContainer}>
            <div
                css={classes.drawerDarkOpacityContainer}
                onClick={closeDrawer}
            ></div>
            <div css={classes.drawerContentContainer}>
                <div css={classes.drawerAppBarContainer}>
                    <Tabs
                        value={matchingTabValue}
                        variant="scrollable"
                        scrollButtons="auto"
                        indicatorColor="secondary"
                        textColor="secondary"
                    >
                        {tabs.map(({ route, label }, index) => {
                            return (
                                <Tab
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
            </div>
        </div>
    );
}

const createClasses = () => {
    const drawerContainer = css`
        position: absolute;
        right: 0;
        z-index: 1;
        display: grid;
        grid-template-columns: auto 400px;
        height: 100%;
        width: 100%;
    `;

    const drawerDarkOpacityContainer = css`
        background-color: rgba(0, 0, 0, 0.5);
    `;

    const drawerContentContainer = css`
        background-color: white;
        box-shadow: 0px 8px 10px -5px rgb(0 0 0 / 20%),
            0px 16px 24px 2px rgb(0 0 0 / 14%),
            0px 6px 30px 5px rgb(0 0 0 / 12%);
        display: flex;
        flex-direction: column;
    `;

    const drawerAppBarContainer = css`
        flex: 0 0 auto;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    `;

    const drawerInnerContentContainer = css`
        flex-grow: 1;
        display: flex;
    `;

    return {
        drawerContainer,
        drawerDarkOpacityContainer,
        drawerContentContainer,
        drawerAppBarContainer,
        drawerInnerContentContainer,
    };
};