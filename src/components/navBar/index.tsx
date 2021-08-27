/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography, Button, Theme, useTheme } from "@material-ui/core";
import { composeCSS } from "../../styles/composeCSS";
import { useHistory, useLocation } from "react-router-dom";
import { CompanyLogo } from "../companyLogo";

export interface INavBarItem {
    label: string;
    route: string;
}

export type NavBarActionButtonType = "sign-in" | "sign-up" | "sign-out" | null;

export interface INavBarProps {
    navItems: INavBarItem[];
    actionButtonType: NavBarActionButtonType;
    hideNavItems?: boolean;
}

export default function NavBar(props: INavBarProps) {
    const theme = useTheme();
    const classes = createClasses(theme);
    const history = useHistory();
    const location = useLocation();

    function signOut() {
        // sign the user out
        history.push("/sign-in");
    }

    function navigateToRoute(route: string) {
        return () => {
            history.push(route);
        };
    }

    return (
        <div css={classes.navBar}>
            <div css={classes.logoContainer}>
                <div css={classes.logoInnerContainer}>
                    <CompanyLogo />
                </div>
            </div>
            <div css={classes.innerNavBar}>
                {props.navItems?.map(({ label, route }) => {
                    const itemIsActive = location.pathname.endsWith(route);

                    return (
                        <div
                            css={composeCSS(
                                classes.navItemContainer,
                                classes.navInactiveItem,
                                itemIsActive && classes.activeItem
                            )}
                            key={label}
                        >
                            <div
                                onClick={navigateToRoute(route)}
                                css={composeCSS(
                                    classes.typographyContainer,
                                    !!props.hideNavItems && classes.hideNavItems
                                )}
                            >
                                <Typography>{label}</Typography>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div css={classes.actionButtonContainer}>
                {props.actionButtonType === "sign-in" && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={navigateToRoute("/sign-in")}
                    >
                        Sign In
                    </Button>
                )}
                {props.actionButtonType === "sign-up" && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={navigateToRoute("/sign-up")}
                    >
                        Sign Up
                    </Button>
                )}
                {props.actionButtonType === "sign-out" && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={signOut}
                    >
                        Sign Out
                    </Button>
                )}
            </div>
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const navBar = css`
        padding: ${theme.spacing() * 3}px;
        padding-left: 0;
        padding-right: 0;
        display: grid;
        position: relative;
    `;

    const innerNavBar = css`
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const navItemContainer = css`
        margin: 0px ${theme.spacing() * 2}px;
    `;

    const actionButtonContainer = css`
        position: absolute;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        right: 0;
    `;

    const typographyContainer = css`
        &:hover {
            cursor: pointer;
        }
    `;

    const activeItem = css`
        border-bottom-color: ${theme.palette.primary.main};
    `;

    const navInactiveItem = css`
        border-bottom: 3px solid transparent;
    `;

    const hideNavItems = css`
        visibility: hidden;
    `;

    const logoContainer = css`
        position: relative;
    `;

    const logoInnerContainer = css`
        position: absolute;
        top: -12px;
    `;

    return {
        navBar,
        innerNavBar,
        navItemContainer,
        actionButtonContainer,
        typographyContainer,
        activeItem,
        navInactiveItem,
        hideNavItems,
        logoInnerContainer,
        logoContainer,
    };
};
