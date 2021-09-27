import { ButtonProps, Button, CircularProgress, Box } from "@mui/material";

export interface IWrappedButtonProps extends ButtonProps {
    showSpinner?: boolean;
    component?: string;
    testIds?: {
        button?: string;
        spinner?: string;
    };
    // eliminating the text button as it's difficult to see in dark mode
    variant?: "contained" | "outlined";
}

export function WrappedButton(props: IWrappedButtonProps) {
    const { showSpinner, testIds, variant, ...rest } = props;
    const actualVariant = variant || "outlined";

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
            <Button
                variant={actualVariant}
                {...rest}
                data-testid={testIds?.button}
            />
        </Box>
    );
}
