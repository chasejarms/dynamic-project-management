/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useTheme, Theme, Paper } from "@mui/material";

export interface IContentWithDynamicToolbarProps {
    toolbarContent: React.ReactNode;
    mainContent: React.ReactNode;
    ticketDrawerRoutes?: React.ReactNode;
}

export function ContentWithDynamicToolbar(
    props: IContentWithDynamicToolbarProps
) {
    const theme = useTheme();
    const classes = createClasses(theme);
    return (
        <div css={classes.container}>
            {props.ticketDrawerRoutes}
            <div css={classes.toolbarContainer}>{props.toolbarContent}</div>
            <div css={classes.contentContainer}>{props.mainContent}</div>
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const container = css`
        flex-grow: 1;
        display: grid;
        grid-template-rows: 60px 1fr;
        position: relative;
        flex-direction: column;
    `;

    const toolbarContainer = css`
        display: flex;
    `;

    const contentContainer = css`
        flex-grow: 1;
        display: flex;
        overflow-x: auto;
    `;

    return {
        container,
        toolbarContainer,
        contentContainer,
    };
};
