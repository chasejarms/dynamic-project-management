import React from "react";
import { MenuItem, Paper, Typography, Box } from "@mui/material";

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

export function QuickActionsPopoverContent(
    props: IQuickActionsPopoverContentProps
) {
    function onClickInternal(menuItemInformationOnClick: () => void) {
        return (event: any) => {
            menuItemInformationOnClick();
            props.onClose(event);
        };
    }

    return (
        <Paper elevation={4}>
            <Box
                sx={{
                    width: "200px",
                }}
            >
                {props.indentedActions.map((indentedAction, index) => {
                    return (
                        <React.Fragment key={index}>
                            <Box
                                sx={{
                                    py: 1,
                                    px: 2,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 500,
                                    }}
                                >
                                    {indentedAction.header}
                                </Typography>
                            </Box>
                            {indentedAction.informationForMenuItems.map(
                                (menuItemInformation, innerIndex) => {
                                    return (
                                        <MenuItem
                                            onClick={onClickInternal(
                                                menuItemInformation.onClick
                                            )}
                                            sx={{
                                                paddingLeft: 4,
                                                paddingRight: 4,
                                            }}
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
            </Box>
        </Paper>
    );
}
