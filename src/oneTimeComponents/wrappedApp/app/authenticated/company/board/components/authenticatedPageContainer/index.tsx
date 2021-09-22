import { Box } from "@mui/material";
import { AuthenticatedPageAppBar } from "./authenticatedPageAppBar";
import { AuthenticatedPageTopBar } from "./authenticatedPageTopBar";

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
    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "grid",
                gridTemplateRows: "auto auto 1fr",
            }}
        >
            <AuthenticatedPageTopBar />
            <AuthenticatedPageAppBar navItems={props.navItems} />
            <Box
                sx={{
                    overflow: "auto",
                }}
            >
                {props.children}
            </Box>
        </Box>
    );
}
