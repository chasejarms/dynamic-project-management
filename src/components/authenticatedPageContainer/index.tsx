/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { AuthenticatedPageAppBar } from "../authenticatedPageAppBar";
import { AuthenticatedPageTopBar } from "../authenticatedPageTopBar";

export interface IAuthenticatedNavItem {
    text: string;
    route: string;
}

export interface IAuthenticatedPageContainerProps {
    children: React.ReactNode;
    navItems: IAuthenticatedNavItem[];
}

export function AuthenticatedPageContainer(
    props: IAuthenticatedPageContainerProps
) {
    const classes = createClasses();

    return (
        <div css={classes.container}>
            <AuthenticatedPageTopBar />
            <div>
                <AuthenticatedPageAppBar navItems={props.navItems} />
            </div>
            <div css={classes.contentContainer}>{props.children}</div>
        </div>
    );
}

const createClasses = () => {
    const container = css`
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: auto;
    `;

    const contentContainer = css`
        flex-grow: 1;
        display: flex;
        overflow-y: auto;
    `;

    return {
        container,
        contentContainer,
    };
};
