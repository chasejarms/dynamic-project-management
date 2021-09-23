import { Box } from "@mui/material";

export interface IDrawerContainerProps {
    children: React.ReactNode;
    darkOpacityOnClick?: () => void;
}

export function DrawerContainer(props: IDrawerContainerProps) {
    return (
        <Box
            sx={{
                position: "absolute",
                right: 0,
                zIndex: (theme) => {
                    return theme.zIndex.modal;
                },
                display: "grid",
                gridTemplateColumns: "1fr 400px",
                height: "100%",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                }}
                onClick={props.darkOpacityOnClick}
            ></Box>
            <Box
                sx={{
                    bgcolor: "white",
                    boxShadow: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {props.children}
            </Box>
        </Box>
    );
}
