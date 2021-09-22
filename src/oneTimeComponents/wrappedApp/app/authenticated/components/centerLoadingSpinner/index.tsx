/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { Box, CircularProgress } from "@mui/material";

export interface ICenterLoadingSpinnerProps {
    size: "small" | "large";
}

export function CenterLoadingSpinner(props: ICenterLoadingSpinnerProps) {
    const sizeFromSizeProp = props.size === "small" ? 24 : 36;

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
            }}
        >
            <CircularProgress
                color="primary"
                size={sizeFromSizeProp}
                thickness={4}
            />
        </Box>
    );
}
