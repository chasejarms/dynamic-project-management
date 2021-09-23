import { Box } from "@mui/material";

export interface IContentWithDynamicToolbarProps {
    toolbarContent: React.ReactNode;
    mainContent: React.ReactNode;
    ticketDrawerRoutes?: React.ReactNode;
}

export function ContentWithDynamicToolbar(
    props: IContentWithDynamicToolbarProps
) {
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "grid",
                height: "100%",
                gridTemplateRows: "60px 1fr",
                position: "relative",
                flexDirection: "column",
            }}
        >
            {props.ticketDrawerRoutes}
            <Box
                sx={{
                    display: "flex",
                }}
            >
                {props.toolbarContent}
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    overflowX: "auto",
                }}
            >
                {props.mainContent}
            </Box>
        </Box>
    );
}
