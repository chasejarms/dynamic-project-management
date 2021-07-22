/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Theme, useTheme } from "@material-ui/core";
import NonAuthenticatedNavBar from "../nonAuthenticatedNavBar";
import { composeCSS } from "../../styles/composeCSS";

interface INonAuthenticatedPageContainerProps {
    children: React.ReactNode;
    makeFullPage?: boolean;
}

export function NonAuthenticatedPageContainer(
    props: INonAuthenticatedPageContainerProps
) {
    const theme = useTheme();
    const classes = createClasses(theme);

    return (
        <>
            <div
                css={composeCSS(
                    classes.container,
                    !!props.makeFullPage && classes.makeFullPage
                )}
            >
                <NonAuthenticatedNavBar />
                {props.children}
            </div>
        </>
    );
}

const createClasses = (theme: Theme) => {
    const container = css`
        display: grid;
        grid-template-rows: auto 1fr;
        padding: 0px ${theme.spacing() * 10}px;
    `;

    const makeFullPage = css`
        height: 100vh;
    `;

    return {
        container,
        makeFullPage,
    };
};
