import React from "react";
import { RouteCreator } from "../../../../utils/routeCreator";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../../../company/board/components/authenticatedPageContainer";

export interface IBoardContainerProps {
    children: React.ReactNode;
}

export function CompaniesContainer(props: IBoardContainerProps) {
    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Companies",
            route: RouteCreator.companies(),
        },
    ];
    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
