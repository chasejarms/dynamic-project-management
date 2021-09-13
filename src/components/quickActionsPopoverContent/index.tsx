/** @jsxImportSource @emotion/react */
import React from "react";
import { jsx, css } from "@emotion/react";
import { makeStyles, MenuItem, Paper, Typography } from "@material-ui/core";

export interface IIndentedAction {
    header: string;
    informationForMenuItems: {
        text: string;
        onClick: () => void;
    }[];
}

export interface IQuickActionsPopoverContentProps {
    indentedActions: IIndentedAction[];
    onClose: (event: any) => void;
}

const useStyles = makeStyles({
    moreOptionsHeaderText: {
        fontWeight: 500,
    },
    menuItemRoot: {
        paddingLeft: 32,
        paddingRight: 32,
    },
});

export function QuickActionsPopoverContent(
    props: IQuickActionsPopoverContentProps
) {
    const classes = createClasses();
    const materialClasses = useStyles();

    function onClickInternal(menuItemInformationOnClick: () => void) {
        return (event: any) => {
            menuItemInformationOnClick();
            props.onClose(event);
        };
    }

    return (
        <Paper elevation={4}>
            <div css={classes.optionsContentContainer}>
                {props.indentedActions.map((indentedAction, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div css={classes.optionsHeaderContainer}>
                                <Typography
                                    className={
                                        materialClasses.moreOptionsHeaderText
                                    }
                                >
                                    {indentedAction.header}
                                </Typography>
                            </div>
                            {indentedAction.informationForMenuItems.map(
                                (menuItemInformation, innerIndex) => {
                                    return (
                                        <MenuItem
                                            onClick={onClickInternal(
                                                menuItemInformation.onClick
                                            )}
                                            className={
                                                materialClasses.menuItemRoot
                                            }
                                            key={innerIndex}
                                        >
                                            {menuItemInformation.text}
                                        </MenuItem>
                                    );
                                }
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </Paper>
    );
}

const createClasses = () => {
    const optionsContentContainer = css`
        width: 200px;
    `;

    const optionsHeaderContainer = css`
        padding: 8px 16px;
    `;

    return {
        optionsContentContainer,
        optionsHeaderContainer,
    };
};
