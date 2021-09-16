/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../../../../../../../components/authenticatedPageContainer";

export interface IBoardContainerProps {
    children: React.ReactNode;
}

export function CompaniesContainer(props: IBoardContainerProps) {
    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Companies",
            route: `/app/companies`,
        },
    ];
    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
