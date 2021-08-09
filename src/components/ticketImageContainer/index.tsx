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
    Popover,
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { Api } from "../../api";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import { IFileForTicket } from "../../models/fileForTicket";
import { ConfirmDialog } from "../confirmDialog";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../quickActionsPopoverContent";

export interface ITicketImageContainerProps {
    file: IFileForTicket;
    onDeleteFile: () => void;
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
    const { companyId, boardId, ticketId } = useAppRouterParams();

    const { file } = props;
    const theme = useTheme();
    const materialClasses = useStyles(theme);
    const classes = createClasses();

    const [anchorEl, setAnchorEl] = useState(null);
    const [actionsPopoverIsOpen, setActionsPopoverIsOpen] = useState(false);
    function toggleMoreOptions(event: any) {
        setAnchorEl(event.currentTarget);
        setActionsPopoverIsOpen((previous) => !previous);
    }

    const [
        showConfirmDeleteImageDialog,
        setShowConfirmDeleteImageDialog,
    ] = useState(false);

    function onClickDeleteImage() {
        setActionsPopoverIsOpen(false);
        setShowConfirmDeleteImageDialog(true);
    }

    const [isDeletingImage, setIsDeletingImage] = useState(false);
    useEffect(() => {
        if (!isDeletingImage) return;

        let didCancel = false;

        Api.tickets
            .deleteTicketFile(companyId, boardId, ticketId, file.fileName)
            .then((url) => {
                if (didCancel) return;
                props.onDeleteFile();
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsDeletingImage(false);
                setShowConfirmDeleteImageDialog(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isDeletingImage]);
    function onClickDownloadImage() {
        Api.tickets
            .getDownloadFileSignedUrl(
                companyId,
                boardId,
                ticketId,
                file.fileName
            )
            .then((signedUrl) => {
                window.open(signedUrl, "_blank");
            })
            .catch(() => {})
            .finally(() => {});
    }

    const indentedActions: IIndentedAction[] = [
        {
            header: "Quick Actions",
            informationForMenuItems: [
                {
                    text: "Delete Image",
                    onClick: onClickDeleteImage,
                },
                {
                    text: "Download Image",
                    onClick: onClickDownloadImage,
                },
            ],
        },
    ];

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
                            <IconButton disabled={isDeletingImage}>
                                <MoreHoriz onClick={toggleMoreOptions} />
                            </IconButton>
                        </div>
                    </div>
                </CardContent>
                <Popover
                    open={actionsPopoverIsOpen}
                    anchorEl={anchorEl}
                    onClose={() => {
                        setActionsPopoverIsOpen(false);
                    }}
                >
                    <QuickActionsPopoverContent
                        indentedActions={indentedActions}
                    />
                </Popover>
            </Card>
            {showConfirmDeleteImageDialog && (
                <ConfirmDialog
                    open={showConfirmDeleteImageDialog}
                    isPerformingAction={isDeletingImage}
                    onConfirm={() => setIsDeletingImage(true)}
                    onClose={() => setShowConfirmDeleteImageDialog(false)}
                    title="Delete Image"
                    content={`Are you sure want to delete this image? This action cannot be undone.`}
                    confirmButtonText="Yes"
                />
            )}
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
