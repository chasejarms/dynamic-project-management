/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    makeStyles,
    Typography,
    useTheme,
    Theme,
    Tab,
    Tabs,
    AppBar,
} from "@material-ui/core";
import { ArrowForwardIos } from "@material-ui/icons";
import { composeCSS } from "../../styles/composeCSS";
import { WrappedButton } from "../wrappedButton";
import { useHistory, useLocation } from "react-router-dom";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";

const useStyles = makeStyles({
    drawer: {
        width: 200,
        flexShrink: 0,
    },
    drawerPaper: {
        width: 200,
    },
    breadcrumbText: {
        "&:hover": {
            textDecoration: "underline",
            cursor: "pointer",
        },
    },
});

export interface IAuthenticatedNavItem {
    text: string;
    route: string;
}

export interface IAuthenticatedPageContainerProps {
    children: React.ReactNode;
    navItems: IAuthenticatedNavItem[];
}

export function AuthenticatedPageContainer(
    props: IAuthenticatedPageContainerProps
) {
    const theme = useTheme();
    const classes = createClasses(theme);
    const materialStyles = useStyles();
    const history = useHistory();
    const location = useLocation();

    const { companyId, boardId, ticketId } = useAppRouterParams();

    function navigateToRoute(route: string) {
        return () => {
            history.push(route);
        };
    }

    function signOut() {
        // TODO: sign the user out
        history.push("/sign-in");
    }

    const breadcrumbTrail = (() => {
        const breadcrumbs: {
            text: string;
            route: string;
        }[] = [
            {
                text: "Companies",
                route: `/app/companies`,
            },
        ];

        if (location.pathname.includes("boards") || !!boardId) {
            breadcrumbs.push({
                text: "Boards",
                route: `/app/company/${companyId}/boards`,
            });
        }

        if (!!boardId) {
            breadcrumbs.push({
                text: "Board",
                route: `/app/company/${companyId}/board/${boardId}`,
            });
        }

        if (!!ticketId) {
            breadcrumbs.push({
                text: "Ticket",
                route: `/app/company/${companyId}/board/${boardId}/ticket/${ticketId}`,
            });
        }

        return breadcrumbs;
    })();

    return (
        <div css={classes.container}>
            <div css={classes.topBarContainer}>
                <div css={classes.breadcrumbContainer}>
                    {breadcrumbTrail.map((breadcrumb, index) => {
                        const isNotLastItem =
                            breadcrumbTrail.length - 1 !== index;
                        return (
                            <div
                                css={composeCSS(
                                    isNotLastItem && classes.rightPadding,
                                    classes.breadcrumbAndIconContainer
                                )}
                                key={index}
                            >
                                <Typography
                                    variant="body2"
                                    className={materialStyles.breadcrumbText}
                                    onClick={navigateToRoute(breadcrumb.route)}
                                >
                                    {breadcrumb.text}
                                </Typography>
                                {isNotLastItem && (
                                    <div
                                        css={composeCSS(
                                            classes.rightPadding,
                                            classes.arrowContainer,
                                            classes.leftPadding
                                        )}
                                    >
                                        <div css={classes.arrowInnerContainer}>
                                            <ArrowForwardIos
                                                fontSize={"inherit"}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div>
                    <WrappedButton onClick={signOut} color="primary">
                        Sign Out
                    </WrappedButton>
                </div>
            </div>
            <div>
                <AppBar position="static">
                    <Tabs
                        value={location.pathname}
                        scrollButtons="auto"
                        variant="scrollable"
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
            </div>
            <div css={classes.contentContainer}>{props.children}</div>
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const container = css`
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: auto;
    `;

    const breadcrumbContainer = css`
        display: flex;
        justify-content: flex-start;
    `;

    const topBarContainer = css`
        height: 60px;
        flex: 0 0 auto;
        display: flex;
        justify-content: space-between;
        padding-left: ${theme.spacing() * 4}px;
        padding-right: ${theme.spacing() * 4}px;
        align-items: center;
    `;

    const navContainer = css`
        flex: 0 0 auto;
        display: flex;
        justify-content: space-between;
        padding: 16px;
        padding-left: 0px;
    `;

    const innerContentContainer = css`
        flex-grow: 1;
    `;

    const backToBoard = css`
        display: flex;
        flex-direction: row;
    `;

    const backToBoardsText = css`
        position: relative;
        top: 12px;
        margin-left: 2px;
    `;

    const listsContainer = css`
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        height: 100%;
    `;

    const rightPadding = css`
        padding-right: ${theme.spacing() * 1.5}px;
    `;

    const leftPadding = css`
        padding-left: ${theme.spacing() * 1.5}px;
    `;

    const breadcrumbAndIconContainer = css`
        display: flex;
        flex-direction: row;
    `;

    const arrowContainer = css`
        position: relative;
    `;

    const arrowInnerContainer = css`
        top: 5px;
        position: absolute;
        font-size: 12px;
    `;

    const contentContainer = css`
        flex-grow: 1;
        display: flex;
        overflow-y: auto;
    `;

    return {
        container,
        navContainer,
        innerContentContainer,
        backToBoard,
        backToBoardsText,
        listsContainer,
        breadcrumbContainer,
        rightPadding,
        breadcrumbAndIconContainer,
        arrowContainer,
        arrowInnerContainer,
        leftPadding,
        contentContainer,
        topBarContainer,
    };
};
