/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { makeStyles, Typography, useTheme, Theme } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import React from "react";
import { ArrowForwardIos } from "@material-ui/icons";
import { composeCSS } from "../../styles/composeCSS";
import { WrappedButton } from "../wrappedButton";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import { cognitoUserSingleton } from "../../classes/CognitoUserSingleton";
import { useDispatch, useSelector } from "react-redux";
import { resetAppBootstrapInformation } from "../../redux/appBootstrapInformation";
import { resetBoardAction } from "../../redux/boards";
import { IStoreState } from "../../redux/storeState";
import { createCompanyBoardKey } from "../../utils/createCompanyBoardKey";

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
    const dispatch = useDispatch();
    function signOut() {
        cognitoUserSingleton.cognitoUser.signOut();
        const resetAppBootstrapInformationAction = resetAppBootstrapInformation();
        localStorage.clear();
        history.push("/sign-in");
        dispatch(resetAppBootstrapInformationAction);
        dispatch(resetBoardAction());
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

    const companies = useSelector((state: IStoreState) => {
        return state.appBootstrapInformation.companies;
    });
    const selectedCompany =
        companies.find((company) => {
            return company.shortenedItemId === companyId;
        }) || "";
    const userIsOnMultipleCompanies = companies.length > 1;

    const boards = useSelector((state: IStoreState) => {
        return state.boards;
    });
    const boardItemId = createCompanyBoardKey(companyId, boardId);
    const selectedBoard = boards[boardItemId];

    const breadcrumbTrail = (() => {
        const breadcrumbs: {
            text: string;
            route: string;
        }[] = [];

        if (userIsOnMultipleCompanies) {
            breadcrumbs.push({
                text: "Companies",
                route: `/app/companies`,
            });
        }

        if (!!companyId) {
            const companyText =
                selectedCompany && userIsOnMultipleCompanies
                    ? `Boards (${selectedCompany.name})`
                    : "Boards";
            breadcrumbs.push({
                text: companyText,
                route: `/app/company/${companyId}/boards`,
            });
        }

        if (!!boardId) {
            const boardText = selectedBoard
                ? `Board (${selectedBoard.name})`
                : "Board";
            breadcrumbs.push({
                text: boardText,
                route: `/app/company/${companyId}/board/${boardId}/tickets`,
            });
        }

        if (!!boardId && location.pathname.includes("/admin/")) {
            breadcrumbs.push({
                text: "Admin",
                route: `/app/company/${companyId}/board/${boardId}/admin/board-users`,
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
                route: `/app/company/${companyId}/board/${boardId}/admin/ticket-templates`,
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
            <div css={classes.buttonContainer}>
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

    const buttonContainer = css`
        margin-top: 8px;
        margin-bottom: 8px;
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
        buttonContainer,
    };
};

export const AuthenticatedPageTopBar = React.memo(
    NonMemoizedAuthenticatedPageTopBar
);
