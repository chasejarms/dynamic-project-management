/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";

export interface IDrawerContainerProps {
    children: React.ReactNode;
    darkOpacityOnClick?: () => void;
}

export function DrawerContainer(props: IDrawerContainerProps) {
    const classes = createClasses();
    return (
        <div css={classes.drawerContainer}>
            <div
                css={classes.drawerDarkOpacityContainer}
                onClick={props.darkOpacityOnClick}
            ></div>
            <div css={classes.drawerContentContainer}>{props.children}</div>
        </div>
    );
}

const createClasses = () => {
    const drawerContainer = css`
        position: absolute;
        right: 0;
        z-index: 1;
        display: grid;
        grid-template-columns: auto 400px;
        height: 100%;
        width: 100%;
    `;

    const drawerDarkOpacityContainer = css`
        background-color: rgba(0, 0, 0, 0.5);
    `;

    const drawerContentContainer = css`
        background-color: white;
        box-shadow: 0px 8px 10px -5px rgb(0 0 0 / 20%),
            0px 16px 24px 2px rgb(0 0 0 / 14%),
            0px 6px 30px 5px rgb(0 0 0 / 12%);
        display: flex;
        flex-direction: column;
    `;

    return {
        drawerContainer,
        drawerDarkOpacityContainer,
        drawerContentContainer,
    };
};
