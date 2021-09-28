import React from "react";
import { Paper, Box } from "@mui/material";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../components/wrappedButton";

export interface IBottomPageToolbarProps {
    rightWrappedButtonProps?: IWrappedButtonProps[];
    leftWrappedButtonProps?: IWrappedButtonProps[];
}

export function BottomPageToolbar(props: IBottomPageToolbarProps) {
    return (
        <Box
            sx={{
                flex: "0 0 auto",
            }}
        >
            <Paper elevation={10} square>
                <Box
                    sx={{
                        display: "flex",
                        py: 1,
                        px: 2,
                        justifyContent: "space-between",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        {props.leftWrappedButtonProps?.map(
                            (wrappedButtonProps, index) => {
                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            marginRight: 1,
                                        }}
                                    >
                                        <WrappedButton
                                            {...wrappedButtonProps}
                                        />
                                    </Box>
                                );
                            }
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        {props.rightWrappedButtonProps?.map(
                            (wrappedButtonProps, index) => {
                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            marginLeft: 1,
                                        }}
                                    >
                                        <WrappedButton
                                            {...wrappedButtonProps}
                                        />
                                    </Box>
                                );
                            }
                        )}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
