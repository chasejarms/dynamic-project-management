import { Typography, Box } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { CompanyLogo } from "../companyLogo";
import { RouteCreator } from "../../../../utils/routeCreator";
import { WrappedButton } from "../../../wrappedButton";

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
        <Box
            sx={{
                padding: 3,
                paddingLeft: 0,
                paddingRight: 0,
                display: "grid",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "-12px",
                    }}
                >
                    <CompanyLogo />
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {props.navItems?.map(({ label, route }) => {
                    const itemIsActive = location.pathname.endsWith(route);

                    return (
                        <Box
                            sx={{
                                my: 0,
                                mx: 2,
                                borderBottom: "3px solid transparent",
                                borderBottomColor: itemIsActive
                                    ? "primary.main"
                                    : "transparent",
                            }}
                            key={label}
                        >
                            <Box
                                onClick={navigateToRoute(route)}
                                sx={{
                                    "&:hover": {
                                        cursor: "pointer",
                                    },
                                    visibility: !!props.hideNavItems
                                        ? "hidden"
                                        : "visible",
                                }}
                            >
                                <Typography>{label}</Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    right: 0,
                }}
            >
                {props.actionButtonType ===
                    NavBarActionButtonTypeEnum.SignIn && (
                    <WrappedButton
                        variant="contained"
                        color="primary"
                        onClick={navigateToRoute(RouteCreator.signIn())}
                    >
                        Sign In
                    </WrappedButton>
                )}
                {props.actionButtonType ===
                    NavBarActionButtonTypeEnum.SignUp && (
                    <WrappedButton
                        variant="contained"
                        color="primary"
                        onClick={navigateToRoute(RouteCreator.signUp())}
                    >
                        Sign Up
                    </WrappedButton>
                )}
                {props.actionButtonType ===
                    NavBarActionButtonTypeEnum.SignOut && (
                    <WrappedButton
                        variant="contained"
                        color="primary"
                        onClick={signOut}
                    >
                        Sign Out
                    </WrappedButton>
                )}
            </Box>
        </Box>
    );
}
