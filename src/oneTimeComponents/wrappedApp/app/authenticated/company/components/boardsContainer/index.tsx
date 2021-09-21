/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { useAppRouterParams } from "../../../../hooks/useAppRouterParams";
import { useCompanyUser } from "../../hooks/useCompanyUser";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../../board/components/authenticatedPageContainer";
import { RouteCreator } from "../../../../utils/routeCreator";

export interface IBoardContainerProps {
    children: React.ReactNode;
}

export function BoardsContainer(props: IBoardContainerProps) {
    const { companyId } = useAppRouterParams();
    const user = useCompanyUser();
    const isChase = user?.email === "chasejarms@gmail.com";
    const canManageCompanyUsers = !!user?.canManageCompanyUsers;

    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Boards",
            route: RouteCreator.boards(companyId),
        },
        {
            text: "Create Board",
            route: RouteCreator.createBoard(companyId),
        },
        canManageCompanyUsers && {
            text: "Users",
            route: RouteCreator.companyUsers(companyId),
        },
        isChase && {
            text: "Add Company",
            route: RouteCreator.addCompany(companyId),
        },
    ].filter((value) => !!value) as IAuthenticatedNavItem[];
    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
