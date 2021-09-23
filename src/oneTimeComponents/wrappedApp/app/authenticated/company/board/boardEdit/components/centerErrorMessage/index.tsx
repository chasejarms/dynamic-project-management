import { Box, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

export interface ICenterErrorMessageProps {
    message: string;
}

export function CenterErrorMessage(props: ICenterErrorMessageProps) {
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    gap: 1,
                }}
            >
                <ErrorOutline
                    sx={{
                        bgcolor: "error.main",
                    }}
                    fontSize="large"
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Typography>{props.message}</Typography>
                </Box>
            </Box>
        </Box>
    );
}
