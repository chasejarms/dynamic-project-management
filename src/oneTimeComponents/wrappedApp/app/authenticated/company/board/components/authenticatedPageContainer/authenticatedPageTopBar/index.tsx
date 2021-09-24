import { Typography, IconButton, Popover, Box } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { ArrowForwardIos, AccountCircle } from "@mui/icons-material";
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
import { ColorModeIcon } from "./colorModeIcon";

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

    return (
        <Box
            sx={{
                flex: "0 0 60px",
                display: "flex",
                justifyContent: "space-between",
                paddingLeft: 2,
                paddingRight: 2,
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "60px",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            width: "60px",
                            top: "-21px",
                            left: "-8px",
                        }}
                    >
                        <CompanyLogoIcon />
                    </Box>
                </Box>
                {breadcrumbTrail.map((breadcrumb, index) => {
                    const isNotLastItem = breadcrumbTrail.length - 1 !== index;
                    return (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                paddingRight: isNotLastItem ? 1.5 : "0px",
                            }}
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
                                <Box
                                    sx={{
                                        paddingRight: 1.5,
                                        position: "relative",
                                        paddingLeft: 1.5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            top: "5px",
                                            position: "absolute",
                                            fontSize: "12px",
                                        }}
                                    >
                                        <ArrowForwardIos fontSize={"inherit"} />
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
            <Box
                sx={{
                    marginTop: "2px",
                    marginBottom: "2px",
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <ColorModeIcon />
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
            </Box>
        </Box>
    );
}

export const AuthenticatedPageTopBar = React.memo(
    NonMemoizedAuthenticatedPageTopBar
);
