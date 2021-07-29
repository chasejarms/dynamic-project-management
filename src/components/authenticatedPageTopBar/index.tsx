/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { makeStyles, Typography, useTheme, Theme } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import React from "react";
import { ArrowForwardIos } from "@material-ui/icons";
import { composeCSS } from "../../styles/composeCSS";
import { WrappedButton } from "../wrappedButton";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";

export interface IAuthenticatedPageTopBarProps {}

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

function NonMemoizedAuthenticatedPageTopBar(
    props: IAuthenticatedPageTopBarProps
) {
    const history = useHistory();
    const location = useLocation();
    function signOut() {
        // TODO: sign the user out
        history.push("/sign-in");
    }

    function navigateToRoute(route: string) {
        return () => {
            history.push(route);
        };
    }

    const {
        companyId,
        boardId,
        ticketId,
        ticketTemplateId,
    } = useAppRouterParams();

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
                route: `/app/company/${companyId}/board/${boardId}/tickets`,
            });
        }

        if (!!ticketId) {
            breadcrumbs.push({
                text: "Ticket",
                route: `/app/company/${companyId}/board/${boardId}/ticket/${ticketId}/data`,
            });
        }

        if (!!ticketTemplateId) {
            breadcrumbs.push({
                text: "Ticket Templates",
                route: `/app/company/${companyId}/board/${boardId}/ticket-templates`,
            });
        }

        return breadcrumbs;
    })();

    const theme = useTheme();
    const materialStyles = useStyles();
    const classes = createClasses(theme);
    return (
        <div css={classes.topBarContainer}>
            <div css={classes.breadcrumbContainer}>
                {breadcrumbTrail.map((breadcrumb, index) => {
                    const isNotLastItem = breadcrumbTrail.length - 1 !== index;
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
                                        <ArrowForwardIos fontSize={"inherit"} />
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
    );
}

const createClasses = (theme: Theme) => {
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

    return {
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
        topBarContainer,
    };
};

export const AuthenticatedPageTopBar = React.memo(
    NonMemoizedAuthenticatedPageTopBar
);
