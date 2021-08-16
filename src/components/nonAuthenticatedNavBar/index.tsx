import { useBreakpoint } from "../../hooks/useBreakpoint";
import { INavBarItem } from "../navBar";
import { LargeNavBar } from "./largeNavBar";

export default function NonAuthenticatedNavBar() {
    const breakpoints = useBreakpoint();

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

    return breakpoints.max768 ? <LargeNavBar navItems={navItems} /> : <div />;
}
