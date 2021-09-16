/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Card,
    CardContent,
    Typography,
    makeStyles,
    Divider,
} from "@material-ui/core";
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
}

const useStyles = makeStyles({
    card: {
        height: "100%",
    },
    cardContentRoot: {
        padding: 0,
        height: "100%",
        "&:last-child": {
            paddingBottom: 0,
        },
    },
});

export function TicketContainer(props: ITicketContainerProps) {
    const materialClasses = useStyles();
    const classes = createClasses();

    function internalVisibilityOnChange(isVisible: boolean) {
        if (isVisible && !!props.bottomLoadingSpinnerProps) {
            props.bottomLoadingSpinnerProps.onReachBottomOfList();
        }
    }

    return (
        <div css={classes.columnContainer}>
            <Card className={materialClasses.card}>
                <CardContent className={materialClasses.cardContentRoot}>
                    <div css={classes.cardContentContainer}>
                        <div css={classes.columnTitleContainer}>
                            <Typography variant="h6">{props.title}</Typography>
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
    `;

    const columnTitleContainer = css`
        padding: 16px;
        padding-bottom: 8px;
        flex: 0 0 auto;
    `;

    const cardContentContainer = css`
        display: flex;
        flex-direction: column;
        height: 100%;
    `;

    const moreTicketsLoadingSpinner = css`
        height: 60px;
        display: flex;
    `;

    return {
        columnContainer,
        ticketsContainer,
        columnTitleContainer,
        cardContentContainer,
        moreTicketsLoadingSpinner,
    };
};
