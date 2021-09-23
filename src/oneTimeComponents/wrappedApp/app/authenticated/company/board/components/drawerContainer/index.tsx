import { Box, Backdrop } from "@mui/material";
import { useRef } from "react";

export interface IDrawerContainerProps {
    children: React.ReactNode;
    darkOpacityOnClick?: () => void;
}

export function DrawerContainer(props: IDrawerContainerProps) {
    const containerRef = useRef(null);

    return (
        <Box
            sx={{
                position: "absolute",
                right: 0,
                zIndex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 400px",
                height: "100%",
                width: "100%",
            }}
            ref={containerRef}
        >
            <Box />
            <Backdrop open={true} onClick={props.darkOpacityOnClick} />
            <Box
                sx={{
                    bgcolor: "white",
                    boxShadow: 1,
                    display: "flex",
                    flexDirection: "column",
                    zIndex: (theme) => {
                        return theme.zIndex.modal + 1;
                    },
                }}
            >
                {props.children}
            </Box>
        </Box>
    );
}
