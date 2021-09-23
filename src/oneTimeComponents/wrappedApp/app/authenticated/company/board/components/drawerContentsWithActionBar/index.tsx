import { Typography, Box } from "@mui/material";
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
    const wrappedButtonPropsExist =
        !!props.leftWrappedButtonProps || !!props.rightWrappedButtonProps;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
            }}
        >
            {!!props.title && (
                <Box
                    sx={{
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                        flex: "0 0 60px",
                        display: "flex",
                        py: 0,
                        px: 2,
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6">{props.title}</Typography>
                </Box>
            )}
            <Box
                sx={{
                    padding: 2,
                    flexGrow: 1,
                    overflow: "auto",
                    height: 0,
                }}
            >
                {props.children}
            </Box>
            {wrappedButtonPropsExist && (
                <Box
                    sx={{
                        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                        flex: "0 0 60px",
                        overflow: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 0,
                        px: 2,
                    }}
                >
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
                </Box>
            )}
        </Box>
    );
}
