/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography } from "@mui/material";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../../components/wrappedButton";

export interface IDrawerContentsWithActionBarProps {
    leftWrappedButtonProps?: IWrappedButtonProps[];
    rightWrappedButtonProps?: IWrappedButtonProps[];
    children: React.ReactNode;
    title?: string;
}

export function DrawerContentsWithActionBar(
    props: IDrawerContentsWithActionBarProps
) {
    const classes = createClasses();
    const wrappedButtonPropsExist =
        !!props.leftWrappedButtonProps || !!props.rightWrappedButtonProps;

    return (
        <div css={classes.container}>
            {!!props.title && (
                <div css={classes.titleContainer}>
                    <Typography variant="h6">{props.title}</Typography>
                </div>
            )}
            <div css={classes.contentContainer}>{props.children}</div>
            {wrappedButtonPropsExist && (
                <div css={classes.actionButtonContainer}>
                    <div>
                        {props.leftWrappedButtonProps?.map(
                            (wrappedButtonProps) => {
                                return (
                                    <WrappedButton {...wrappedButtonProps} />
                                );
                            }
                        )}
                    </div>
                    <div>
                        {props.rightWrappedButtonProps?.map(
                            (wrappedButtonProps) => {
                                return (
                                    <WrappedButton {...wrappedButtonProps} />
                                );
                            }
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const createClasses = () => {
    const container = css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    `;

    const titleContainer = css`
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        flex: 0 0 60px;
        display: flex;
        padding: 0 16px;
        justify-content: flex-start;
        align-items: center;
    `;

    const contentContainer = css`
        padding: 16px;
        flex-grow: 1;
        overflow-y: auto;
        height: 0px;
    `;

    const actionButtonContainer = css`
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        flex: 0 0 60px;
        overflow: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
    `;

    return {
        contentContainer,
        actionButtonContainer,
        container,
        titleContainer,
    };
};
