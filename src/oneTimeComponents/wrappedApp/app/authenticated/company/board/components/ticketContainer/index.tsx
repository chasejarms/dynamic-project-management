import { Card, CardContent, Typography, Divider, Box } from "@mui/material";
import ReactVisibilitySensor from "react-visibility-sensor";
import { CenterLoadingSpinner } from "../../../../components/centerLoadingSpinner";

export interface ITicketContainerProps {
    children: React.ReactNode;
    title: string;
    showCenterSpinner?: boolean;
    bottomLoadingSpinnerProps?: {
        showSpinner: boolean;
        onReachBottomOfList: () => void;
    };
    bottomBarContent?: React.ReactNode;
    topRightIcon?: React.ReactNode;
}

export function TicketContainer(props: ITicketContainerProps) {
    function internalVisibilityOnChange(isVisible: boolean) {
        if (isVisible && !!props.bottomLoadingSpinnerProps) {
            props.bottomLoadingSpinnerProps.onReachBottomOfList();
        }
    }

    return (
        <Box
            sx={{
                marginRight: 2,
                width: "360px",
                minWidth: "360px",
                height: "100%",
            }}
        >
            <Card
                sx={{
                    height: "100%",
                    marginTop: "2px",
                }}
            >
                <CardContent
                    sx={{
                        padding: 0,
                        height: "100%",
                        "&:last-child": {
                            paddingBottom: 0,
                        },
                    }}
                >
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box
                            sx={{
                                padding: 2,
                                paddingBottom: 1,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                flex: "0 0 auto",
                            }}
                        >
                            <div>
                                {props.title ? (
                                    <Typography variant="h6">
                                        {props.title}
                                    </Typography>
                                ) : (
                                    <Box
                                        sx={{
                                            visibility: "hidden",
                                        }}
                                    >
                                        <Typography variant="h6">
                                            Hidden
                                        </Typography>
                                    </Box>
                                )}
                            </div>
                            <div>{props.topRightIcon}</div>
                        </Box>
                        <Divider />
                        {!!props.showCenterSpinner ? (
                            <CenterLoadingSpinner size="small" />
                        ) : (
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    overflow: "auto",
                                    py: "1px",
                                    px: 2,
                                    minHeight: 0,
                                }}
                            >
                                {props.children}
                                {!!props.bottomLoadingSpinnerProps && (
                                    <ReactVisibilitySensor
                                        onChange={internalVisibilityOnChange}
                                    >
                                        <Box
                                            sx={{
                                                height: "60px",
                                                display: "flex",
                                            }}
                                        >
                                            <CenterLoadingSpinner size="small" />
                                        </Box>
                                    </ReactVisibilitySensor>
                                )}
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
