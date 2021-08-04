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
    const canManageCompanyUsers = !!user?.canManageCompanyUsers;
    const canCreateBoards = !!user?.canCreateBoards;

    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Boards",
            route: `/app/company/${companyId}/boards`,
        },
        canCreateBoards && {
            text: "Create Board",
            route: `/app/company/${companyId}/boards/create-board`,
        },
        canManageCompanyUsers && {
            text: "Company Users",
            route: `/app/company/${companyId}/company-users`,
        },
    ].filter((value) => !!value) as IAuthenticatedNavItem[];
    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
