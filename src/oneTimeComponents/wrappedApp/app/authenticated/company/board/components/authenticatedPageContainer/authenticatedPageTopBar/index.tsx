/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Typography,
    useTheme,
    Theme,
    IconButton,
    Popover,
} from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { ArrowForwardIos, AccountCircle } from "@mui/icons-material";
import { composeCSS } from "../../../../../../../../../styles/composeCSS";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { cognitoUserSingleton } from "../../../../../../../../../classes/CognitoUserSingleton";
import { useDispatch, useSelector } from "react-redux";
import { resetAppBootstrapInformation } from "../../../../../../../../../redux/appBootstrapInformation";
import { resetBoardAction } from "../../../../../../../../../redux/boards";
import { IStoreState } from "../../../../../../../../../redux/storeState";
import { createCompanyBoardKey } from "../../../utils/createCompanyBoardKey";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../../quickActionsPopoverContent";
import { CompanyLogoIcon } from "../companyLogoIcon";
import { RouteCreator } from "../../../../../../utils/routeCreator";

export interface IAuthenticatedPageTopBarProps {}

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
        const route = RouteCreator.signIn();
        history.push(route);
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
    const isInternalUser = useSelector((state: IStoreState) => {
        return !!state.appBootstrapInformation.internalUser;
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

        const isOnInternalRoute = location.pathname.includes("/internal/");

        if (isOnInternalRoute) {
            // no breadcrumbs
        } else {
            if (userIsOnMultipleCompanies) {
                breadcrumbs.push({
                    text: "Companies",
                    route: RouteCreator.companies(),
                });
            }

            if (!!companyId) {
                const companyText =
                    selectedCompany && userIsOnMultipleCompanies
                        ? `Boards (${selectedCompany.name})`
                        : "Boards";
                breadcrumbs.push({
                    text: companyText,
                    route: RouteCreator.boards(companyId),
                });
            }

            if (!!boardId) {
                const boardText = selectedBoard
                    ? `Board (${selectedBoard.name})`
                    : "Board";
                breadcrumbs.push({
                    text: boardText,
                    route: RouteCreator.inProgressTickets(companyId, boardId),
                });
            }

            if (!!boardId && location.pathname.includes("/admin/")) {
                breadcrumbs.push({
                    text: "Admin",
                    route: RouteCreator.boardAdmins(companyId, boardId),
                });
            }

            if (!!ticketTemplateId) {
                breadcrumbs.push({
                    text: "Ticket Templates",
                    route: RouteCreator.ticketTemplates(companyId, boardId),
                });
            }
        }

        return breadcrumbs;
    })();

    const [anchorEl, setAnchorEl] = useState(null);
    const [accountSettingsIsOpen, setAccountSettingsIsOpen] = useState(false);
    function openAccountSettings(event: any) {
        setAnchorEl(event.currentTarget);
        setAccountSettingsIsOpen(true);
    }
    function onCloseAccountSettings() {
        setAccountSettingsIsOpen(false);
    }

    function navigateToLearningCenterEditor() {
        const route = RouteCreator.learningCenterEditor();
        history.push(route);
    }

    function navigateBackToApp() {
        history.push(RouteCreator.companies());
    }

    const indentedActions: IIndentedAction[] = [
        {
            header: "User Actions",
            informationForMenuItems: [
                {
                    text: "Sign Out",
                    onClick: signOut,
                },
            ],
        },
        isInternalUser && {
            header: "Internal User",
            informationForMenuItems: [
                {
                    text: "Internal Admin Home",
                    onClick: navigateToLearningCenterEditor,
                },
                {
                    text: "App Home",
                    onClick: navigateBackToApp,
                },
            ],
        },
    ].filter((action) => !!action) as IIndentedAction[];

    const theme = useTheme();
    const classes = createClasses(theme);
    return (
        <div css={classes.topBarContainer}>
            <div css={classes.breadcrumbContainerAndLogoContainer}>
                <div css={classes.logoIconOuterContainer}>
                    <div css={classes.logoIconInnerContainer}>
                        <CompanyLogoIcon />
                    </div>
                </div>
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
                                sx={{
                                    "&:hover": {
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                    },
                                }}
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
                <IconButton onClick={openAccountSettings}>
                    <AccountCircle />
                </IconButton>
                <Popover
                    open={accountSettingsIsOpen}
                    anchorEl={anchorEl}
                    onClose={onCloseAccountSettings}
                >
                    <QuickActionsPopoverContent
                        indentedActions={indentedActions}
                        onClose={onCloseAccountSettings}
                    />
                </Popover>
            </div>
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const breadcrumbContainerAndLogoContainer = css`
        display: flex;
        justify-content: flex-start;
    `;

    const topBarContainer = css`
        flex: 0 0 auto;
        display: flex;
        justify-content: space-between;
        padding-left: ${Number(theme.spacing()) * 2}px;
        padding-right: ${Number(theme.spacing()) * 2}px;
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
        padding-right: ${Number(theme.spacing()) * 1.5}px;
    `;

    const leftPadding = css`
        padding-left: ${Number(theme.spacing()) * 1.5}px;
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
        margin-top: 2px;
        margin-bottom: 2px;
    `;

    const logoIconOuterContainer = css`
        position: relative;
        width: 60px;
    `;

    const logoIconInnerContainer = css`
        position: absolute;
        top: -19px;
    `;

    return {
        navContainer,
        innerContentContainer,
        backToBoard,
        backToBoardsText,
        listsContainer,
        breadcrumbContainerAndLogoContainer,
        rightPadding,
        breadcrumbAndIconContainer,
        arrowContainer,
        arrowInnerContainer,
        leftPadding,
        topBarContainer,
        buttonContainer,
        logoIconOuterContainer,
        logoIconInnerContainer,
    };
};

export const AuthenticatedPageTopBar = React.memo(
    NonMemoizedAuthenticatedPageTopBar
);
