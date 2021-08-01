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

export function BoardsContainer(props: IBoardContainerProps) {
    const { companyId } = useAppRouterParams();

    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Boards",
            route: `/app/company/${companyId}/boards`,
        },
        {
            text: "Create Board",
            route: `/app/company/${companyId}/boards/create-board`,
        },
        {
            text: "Company Users",
            route: `/app/company/${companyId}/company-users`,
        },
    ];
    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
