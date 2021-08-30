import { useBreakpoint } from "../../hooks/useBreakpoint";
import { INavBarItem } from "../navBar";
import { LargeNavBar } from "./largeNavBar";
import { SmallNavBar } from "./smallNavBar";

export default function NonAuthenticatedNavBar() {
    const breakpoints = useBreakpoint();

    const navItems: INavBarItem[] = [
        {
            label: "Home",
            route: "/",
        },
        {
            label: "Contact Us",
            route: "/contact",
        },
        {
            label: "Sign Up",
            route: "/sign-up",
        },
    ];

    return breakpoints.max768 ? (
        <SmallNavBar navItems={navItems} />
    ) : (
        <LargeNavBar navItems={navItems} />
    );
}
