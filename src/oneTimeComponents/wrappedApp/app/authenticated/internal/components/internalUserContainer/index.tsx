/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../../../company/board/components/authenticatedPageContainer";

export interface IBoardContainerProps {
    children: React.ReactNode;
}

export function InternalUserContainer(props: IBoardContainerProps) {
    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Learning Center Editor",
            route: `/app/internal/learning-center-editor`,
        },
        {
            text: "Learning Center Videos",
            route: `/app/internal/learning-center-videos`,
        },
    ];

    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
