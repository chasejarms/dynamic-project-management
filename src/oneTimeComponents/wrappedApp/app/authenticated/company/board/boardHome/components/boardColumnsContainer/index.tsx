import React from "react";
import { Box } from "@mui/material";

export interface IBoardColumnsContainerProps {
    children: React.ReactNode;
    removeTopPadding?: boolean;
}

export function BoardColumnsContainer(props: IBoardColumnsContainerProps) {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    overflowX: "auto",
                    display: "flex",
                    flexGrow: 1,
                    padding: 3,
                    paddingTop: !!props.removeTopPadding ? 0 : 2,
                }}
            >
                {props.children}
            </Box>
        </Box>
    );
}
