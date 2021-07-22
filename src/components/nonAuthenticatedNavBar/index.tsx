/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import NavBar, { NavBarActionButtonType, INavBarItem } from "../navBar";
import { useLocation } from "react-router-dom";

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
            label: "Pricing",
            route: "/pricing",
        },
        {
            label: "Contact",
            route: "/contact",
        },
    ];

    return <NavBar navItems={navItems} actionButtonType={actionButtonType} />;
}
