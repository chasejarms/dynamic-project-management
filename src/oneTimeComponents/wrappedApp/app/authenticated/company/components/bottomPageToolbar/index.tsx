import React from "react";
import { Paper, Box } from "@mui/material";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../components/wrappedButton";

export interface IBottomPageToolbarProps {
    wrappedButtonProps: IWrappedButtonProps[];
    leftContent?: React.ReactNode;
}

export function BottomPageToolbar(props: IBottomPageToolbarProps) {
    return (
        <Box
            sx={{
                flex: "0 0 auto",
            }}
        >
            <Paper elevation={10}>
                <Box
                    sx={{
                        display: "flex",
                        py: 1,
                        px: 2,
                        justifyContent: "space-between",
                        flexDirection: "row",
                    }}
                >
                    <div>{props.leftContent}</div>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        {props.wrappedButtonProps.map(
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
