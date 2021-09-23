import { Box } from "@mui/material";
import NonAuthenticatedNavBar from "./nonAuthenticatedNavBar";

interface INonAuthenticatedPageContainerProps {
    children: React.ReactNode;
    makeFullPage?: boolean;
}

export function NonAuthenticatedPageContainer(
    props: INonAuthenticatedPageContainerProps
) {
    return (
        <>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateRows: "auto 1fr",
                    height: props.makeFullPage ? "100vh" : "auto",
                }}
            >
                <NonAuthenticatedNavBar />
                {props.children}
            </Box>
        </>
    );
}
