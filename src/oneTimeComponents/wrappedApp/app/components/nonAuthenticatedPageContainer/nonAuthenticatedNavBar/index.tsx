import { useBreakpoint } from "../../../../../../hooks/useBreakpoint";
import { INavBarItem } from "../../../../../../components/navBar";
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
    ];

    return breakpoints.max768 ? (
        <SmallNavBar navItems={navItems} />
    ) : (
        <LargeNavBar navItems={navItems} />
    );
}
