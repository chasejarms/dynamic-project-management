/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../authenticatedPageContainer";

export interface IBoardContainerProps {
    children: React.ReactNode;
}

export function BoardAdminContainer(props: IBoardContainerProps) {
    const { companyId, boardId } = useAppRouterParams();

    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Board Users",
            route: `/app/company/${companyId}/board/${boardId}/admin/board-users`,
        },
        {
            text: "Columns",
            route: `/app/company/${companyId}/board/${boardId}/admin/columns`,
        },
        {
            text: "Ticket Templates",
            route: `/app/company/${companyId}/board/${boardId}/admin/ticket-templates`,
        },
        {
            text: "Tags Manager",
            route: `/app/company/${companyId}/board/${boardId}/admin/manage-tags`,
        },
    ];

    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
