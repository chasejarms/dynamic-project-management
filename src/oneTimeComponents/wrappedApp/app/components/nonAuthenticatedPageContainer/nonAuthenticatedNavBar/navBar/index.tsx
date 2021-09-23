/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography, Button, Theme, useTheme } from "@mui/material";
import { composeCSS } from "../../../../../../../styles/composeCSS";
import { useHistory, useLocation } from "react-router-dom";
import { CompanyLogo } from "../companyLogo";
import { RouteCreator } from "../../../../utils/routeCreator";

export interface INavBarItem {
    label: string;
    route: string;
}

export enum NavBarActionButtonTypeEnum {
    SignIn,
    SignUp,
    SignOut,
    None,
}

export interface INavBarProps {
    navItems: INavBarItem[];
    actionButtonType: NavBarActionButtonTypeEnum;
    hideNavItems?: boolean;
}

export default function NavBar(props: INavBarProps) {
    const theme = useTheme();
    const classes = createClasses(theme);
    const history = useHistory();
    const location = useLocation();

    function signOut() {
        const route = RouteCreator.signIn();
        history.push(route);
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
                {props.actionButtonType ===
                    NavBarActionButtonTypeEnum.SignIn && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={navigateToRoute(RouteCreator.signIn())}
                    >
                        Sign In
                    </Button>
                )}
                {props.actionButtonType ===
                    NavBarActionButtonTypeEnum.SignUp && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={navigateToRoute(RouteCreator.signUp())}
                    >
                        Sign Up
                    </Button>
                )}
                {props.actionButtonType ===
                    NavBarActionButtonTypeEnum.SignOut && (
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
        padding: ${theme.spacing(3)};
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
        margin: 0px ${theme.spacing(2)};
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
