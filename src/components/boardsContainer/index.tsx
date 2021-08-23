/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import { useCompanyUser } from "../../hooks/useCompanyUser";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../authenticatedPageContainer";

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
            route: `/app/company/${companyId}/boards`,
        },
        {
            text: "Create Board",
            route: `/app/company/${companyId}/boards/create-board`,
        },
        canManageCompanyUsers && {
            text: "Users",
            route: `/app/company/${companyId}/company-users`,
        },
        isChase && {
            text: "Add Company",
            route: `/app/company/${companyId}/add-company`,
        },
    ].filter((value) => !!value) as IAuthenticatedNavItem[];
    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
