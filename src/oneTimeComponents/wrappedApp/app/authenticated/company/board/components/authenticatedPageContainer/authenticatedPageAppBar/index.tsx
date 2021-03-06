import { Tab, Tabs, AppBar } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import React from "react";

export interface IAuthenticatedNavItem {
    text: string;
    route: string;
}

export interface IAuthenticatedPageAppBarProps {
    navItems: IAuthenticatedNavItem[];
}

function NonMemoizedAuthenticatedPageAppBar(
    props: IAuthenticatedPageAppBarProps
) {
    const history = useHistory();
    const location = useLocation();

    function navigateToRoute(route: string) {
        return () => {
            history.push(route);
        };
    }

    const matchingTabValue =
        props.navItems.find((navItem) => {
            return navItem.route === location.pathname;
        })?.route || false;

    return (
        <AppBar position="static">
            <Tabs
                value={matchingTabValue}
                scrollButtons="auto"
                variant="scrollable"
                indicatorColor="primary"
                textColor="inherit"
            >
                {props.navItems.map(({ text, route }, index) => {
                    return (
                        <Tab
                            key={text}
                            label={text}
                            onClick={navigateToRoute(route)}
                            value={route}
                        />
                    );
                })}
            </Tabs>
        </AppBar>
    );
}

export const AuthenticatedPageAppBar = React.memo(
    NonMemoizedAuthenticatedPageAppBar
);
