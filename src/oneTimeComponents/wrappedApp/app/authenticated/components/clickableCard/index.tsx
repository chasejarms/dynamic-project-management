import { Box, Typography, TypographyProps, useTheme } from "@mui/material";

type TypographyVariant = Pick<TypographyProps, "variant">;

export interface IClickableCardProps {
    onClick: () => void;
    title: string;
    useDefaultBackgroundColor?: boolean;
}

export function ClickableCard(props: IClickableCardProps) {
    const theme = useTheme();
    const bgcolor = !!props.useDefaultBackgroundColor
        ? "background.default"
        : "background.paper";

    return (
        <Box
            sx={{
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: "divider",
                borderRadius: "5px",
                bgcolor,
                cursor: "pointer",
                "&:hover": {
                    borderColor: "primary.main",
                },
            }}
            onClick={props.onClick}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    padding: 2,
                }}
            >
                <Typography variant="h5">{props.title}</Typography>
            </Box>
        </Box>
    );
}
