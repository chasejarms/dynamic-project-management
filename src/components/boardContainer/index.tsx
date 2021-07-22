/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../authenticatedPageContainer";
import { useParams } from "react-router-dom";

export interface IBoardContainerProps {
    children: React.ReactNode;
}

export function BoardContainer(props: IBoardContainerProps) {
    const { companyId, boardId } = useParams<{
        companyId: string;
        boardId: string;
    }>();

    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Board",
            route: `/app/company/${companyId}/board/${boardId}`,
        },
        {
            text: "Create Ticket",
            route: `/app/company/${companyId}/board/${boardId}/create-ticket`,
        },
        {
            text: "Priorities",
            route: `/app/company/${companyId}/board/${boardId}/priorities`,
        },
        // {
        //     text: "Users",
        //     route: `/app/company/${companyId}/board/${boardId}/users`,
        // },
        {
            text: "Columns",
            route: `/app/company/${companyId}/board/${boardId}/columns`,
        },
        {
            text: "Ticket Templates",
            route: `/app/company/${companyId}/board/${boardId}/ticket-templates`,
        },
        {
            text: "Backlog Tickets",
            route: `/app/company/${companyId}/board/${boardId}/backlog-tickets`,
        },
        {
            text: "Completed Tickets",
            route: `/app/company/${companyId}/board/${boardId}/completed-tickets`,
        },
    ];
    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
