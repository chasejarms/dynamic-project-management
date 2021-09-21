/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import { RouteCreator } from "../../../../utils/routeCreator";
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
            route: RouteCreator.learningCenterEditor(),
        },
        {
            text: "Learning Center Videos",
            route: RouteCreator.learningCenterVideos(),
        },
    ];

    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {props.children}
        </AuthenticatedPageContainer>
    );
}
