/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Card,
    CardContent,
    CardMedia,
    IconButton,
    makeStyles,
    Theme,
    useTheme,
    Typography,
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import { IFileForTicket } from "../../models/fileForTicket";

export interface ITicketImageContainerProps {
    file: IFileForTicket;
}

const useStyles = makeStyles({
    cardMedia: (theme: Theme) => ({
        height: "200px",
        objectFit: "contain",
        backgroundColor: theme.palette.grey["300"],
    }),
    cardContent: (theme: Theme) => ({
        "&:last-child": {
            paddingBottom: "8px",
        },
        paddingTop: "8px",
        paddingRight: "8px",
    }),
});

export function TicketImageContainer(props: ITicketImageContainerProps) {
    const { file } = props;
    const theme = useTheme();
    const materialClasses = useStyles(theme);
    const classes = createClasses();

    return (
        <div>
            <Card elevation={3}>
                <CardMedia
                    component="img"
                    src={file.signedGetUrl}
                    title={file.fileName}
                    className={materialClasses.cardMedia}
                />
                <CardContent className={materialClasses.cardContent}>
                    <div css={classes.cardContentContainer}>
                        <div css={classes.imageTextContainer}>
                            <Typography>{file.fileName}</Typography>
                        </div>
                        <div css={classes.iconButtonContainer}>
                            <IconButton>
                                <MoreHoriz />
                            </IconButton>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const createClasses = () => {
    const cardContentContainer = css`
        display: flex;
        align-items: center;
        flex-direction: row;
    `;

    const iconButtonContainer = css`
        flex: 0 0 auto;
    `;

    const imageTextContainer = css`
        flex-grow: 1;
    `;

    return {
        cardContentContainer,
        iconButtonContainer,
        imageTextContainer,
    };
};
