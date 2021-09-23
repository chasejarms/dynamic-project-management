import React from "react";
import NavBar, { INavBarItem, NavBarActionButtonTypeEnum } from "../navBar";
import { Box } from "@mui/material";

export interface ILargeNavBarProps {
    navItems: INavBarItem[];
}

export function LargeNavBar(props: ILargeNavBarProps) {
    return (
        <Box
            sx={{
                py: 0,
                px: 4,
                width: "100vw",
            }}
        >
            <NavBar
                navItems={props.navItems}
                actionButtonType={NavBarActionButtonTypeEnum.SignIn}
            />
        </Box>
    );
}
