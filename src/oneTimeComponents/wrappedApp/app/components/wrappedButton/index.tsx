import { ButtonProps, Button, CircularProgress, Box } from "@mui/material";

export interface IWrappedButtonProps extends ButtonProps {
    showSpinner?: boolean;
    component?: string;
    testIds?: {
        button?: string;
        spinner?: string;
    };
}

export function WrappedButton(props: IWrappedButtonProps) {
    const { showSpinner, testIds, ...rest } = props;

    return (
        <Box
            sx={{
                position: "relative",
            }}
        >
            {props.showSpinner && (
                <Box
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    data-testid={testIds?.spinner}
                >
                    <CircularProgress color="primary" size={24} thickness={4} />
                </Box>
            )}
            <Button {...rest} data-testid={testIds?.button} />
        </Box>
    );
}
