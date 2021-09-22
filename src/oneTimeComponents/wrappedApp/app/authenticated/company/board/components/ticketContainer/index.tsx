/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Card, CardContent, Typography, Divider } from "@mui/material";
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
    const classes = createClasses();

    function internalVisibilityOnChange(isVisible: boolean) {
        if (isVisible && !!props.bottomLoadingSpinnerProps) {
            props.bottomLoadingSpinnerProps.onReachBottomOfList();
        }
    }

    return (
        <div css={classes.columnContainer}>
            <Card
                sx={{
                    height: "100%",
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
                    <div css={classes.innerCardContentContainer}>
                        <div css={classes.columnTitleContainer}>
                            <div>
                                {props.title ? (
                                    <Typography variant="h6">
                                        {props.title}
                                    </Typography>
                                ) : (
                                    <div css={classes.hiddenTitle}>
                                        <Typography variant="h6">
                                            Hidden
                                        </Typography>
                                    </div>
                                )}
                            </div>
                            <div>{props.topRightIcon}</div>
                        </div>
                        <Divider />
                        {!!props.showCenterSpinner ? (
                            <CenterLoadingSpinner size="small" />
                        ) : (
                            <div css={classes.ticketsContainer}>
                                {props.children}
                                {!!props.bottomLoadingSpinnerProps && (
                                    <ReactVisibilitySensor
                                        onChange={internalVisibilityOnChange}
                                    >
                                        <div
                                            css={
                                                classes.moreTicketsLoadingSpinner
                                            }
                                        >
                                            <CenterLoadingSpinner size="small" />
                                        </div>
                                    </ReactVisibilitySensor>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const createClasses = () => {
    const columnContainer = css`
        margin-right: 16px;
        width: 360px;
        min-width: 360px;
        height: 100%;
    `;

    const ticketsContainer = css`
        flex-grow: 1;
        overflow-y: auto;
        padding: 1px 16px;
        min-height: 0px;
    `;

    const columnTitleContainer = css`
        padding: 16px;
        padding-bottom: 8px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex: 0 0 auto;
    `;

    const outerCardContentContainer = css`
        display: flex;
        flex-direction: column;
        height: 100%;
    `;

    const bottomToolbarContainer = css`
        flex: 0 0 auto;
    `;

    const innerCardContentContainer = css`
        label: inner-card-content-container;
        height: 100%;
        display: flex;
        flex-direction: column;
    `;

    const moreTicketsLoadingSpinner = css`
        height: 60px;
        display: flex;
    `;

    const hiddenTitle = css`
        visibility: hidden;
    `;

    return {
        columnContainer,
        ticketsContainer,
        columnTitleContainer,
        outerCardContentContainer,
        moreTicketsLoadingSpinner,
        bottomToolbarContainer,
        innerCardContentContainer,
        hiddenTitle,
    };
};
