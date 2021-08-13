/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import NavBar, { NavBarActionButtonType, INavBarItem } from "../navBar";
import { useLocation } from "react-router-dom";
import { Theme, useTheme } from "@material-ui/core";

export default function NonAuthenticatedNavBar() {
    const location = useLocation();
    const actionButtonType: NavBarActionButtonType = location.pathname.includes(
        "sign-in"
    )
        ? "sign-up"
        : "sign-in";

    const navItems: INavBarItem[] = [
        {
            label: "Home",
            route: "/",
        },
        {
            label: "Contact",
            route: "/contact",
        },
    ];

    const theme = useTheme();
    const classes = createClasses(theme);
    return (
        <div css={classes.container}>
            <NavBar navItems={navItems} actionButtonType={actionButtonType} />;
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const container = css`
        padding: 0px ${theme.spacing() * 10}px;
    `;

    return {
        container,
    };
};
