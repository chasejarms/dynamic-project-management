import { Typography, Box } from "@mui/material";
import {
    IWrappedButtonProps,
    WrappedButton,
} from "../../../../../components/wrappedButton";

export interface INoDataWithActionButtonProps {
    text: string;
    wrappedButtonProps?: IWrappedButtonProps;
}

export function NoDataWithActionButton(props: INoDataWithActionButtonProps) {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    width: "300px",
                    flexDirection: "column",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: "center",
                    }}
                >
                    {props.text}
                </Typography>
                {!!props.wrappedButtonProps && (
                    <Box
                        sx={{
                            marginTop: 2,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <WrappedButton {...props.wrappedButtonProps} />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
