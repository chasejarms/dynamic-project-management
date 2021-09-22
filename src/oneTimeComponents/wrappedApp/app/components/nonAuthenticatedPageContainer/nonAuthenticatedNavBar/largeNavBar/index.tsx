/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import NavBar, { INavBarItem, NavBarActionButtonTypeEnum } from "../navBar";
import { useTheme, Theme } from "@material-ui/core";

export interface ILargeNavBarProps {
    navItems: INavBarItem[];
}

export function LargeNavBar(props: ILargeNavBarProps) {
    const theme = useTheme();
    const classes = createClasses(theme);
    return (
        <div css={classes.container}>
            <NavBar
                navItems={props.navItems}
                actionButtonType={NavBarActionButtonTypeEnum.SignIn}
            />
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const container = css`
        padding: 0px ${theme.spacing() * 4}px;
        width: 100vw;
    `;

    return {
        container,
    };
};
