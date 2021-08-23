/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../authenticatedPageContainer";

export interface IBoardContainerProps {
    children: React.ReactNode;
}

export function InternalUserContainer(props: IBoardContainerProps) {
    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Learning Center Editor",
            route: `/app/internal/learning-center-editor`,
        },
    ];

    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
