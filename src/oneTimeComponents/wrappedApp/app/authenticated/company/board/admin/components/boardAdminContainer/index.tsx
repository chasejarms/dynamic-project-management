/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { RouteCreator } from "../../../../../../utils/routeCreator";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../../../components/authenticatedPageContainer";

export interface IBoardContainerProps {
    children: React.ReactNode;
}

export function BoardAdminContainer(props: IBoardContainerProps) {
    const { companyId, boardId } = useAppRouterParams();

    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Board Admins",
            route: RouteCreator.boardAdmins(companyId, boardId),
        },
        {
            text: "Ticket Templates",
            route: RouteCreator.ticketTemplates(companyId, boardId),
        },
    ];

    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
