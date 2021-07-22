/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../authenticatedPageContainer";

export interface ITicketPageWrapperProps {
    children: React.ReactNode;
}

export function TicketPageWrapper(props: ITicketPageWrapperProps) {
    const { boardId, companyId, ticketId } = useAppRouterParams();

    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Ticket Information",
            route: `/app/company/${companyId}/board/${boardId}/ticket/${ticketId}/data`,
        },
    ];
    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
