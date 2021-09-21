import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { INavBarItem } from "./navBar";
import { LargeNavBar } from "./largeNavBar";
import { SmallNavBar } from "./smallNavBar";
import { RouteCreator } from "../../../utils/routeCreator";

export default function NonAuthenticatedNavBar() {
    const breakpoints = useBreakpoint();

    const navItems: INavBarItem[] = [
        {
            label: "Home",
            route: RouteCreator.home(),
        },
        {
            label: "Contact Us",
            route: RouteCreator.contact(),
        },
    ];

    return breakpoints.max768 ? (
        <SmallNavBar navItems={navItems} />
    ) : (
        <LargeNavBar navItems={navItems} />
    );
}
