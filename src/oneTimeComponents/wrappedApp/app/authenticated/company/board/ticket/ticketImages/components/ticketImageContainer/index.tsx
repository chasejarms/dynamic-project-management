/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React from "react";
import {
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Typography,
    Popover,
} from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../../../../../api";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { IFileForTicket } from "../../../../../../../../../../models/fileForTicket";
import { ConfirmDialog } from "../../../../../components/confirmDialog";
import {
    IIndentedAction,
    QuickActionsPopoverContent,
} from "../../../../components/quickActionsPopoverContent";

export interface ITicketImageContainerProps {
    file: IFileForTicket;
    onDeleteFile: () => void;
}

function TicketImageContainerNotMemoized(props: ITicketImageContainerProps) {
    const { companyId, boardId, ticketId } = useAppRouterParams();

    const { file } = props;
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

    function onClose() {
        setActionsPopoverIsOpen(false);
    }

    return (
        <div>
            <Card elevation={3}>
                <CardMedia
                    component="img"
                    src={file.signedGetUrl}
                    title={file.fileName}
                    sx={{
                        height: "200px",
                        objectFit: "contain",
                        bgcolor: "grey.300",
                    }}
                />
                <CardContent
                    sx={{
                        "&:last-child": {
                            paddingBottom: 8,
                        },
                        paddingTop: 8,
                        paddingRight: 8,
                    }}
                >
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
                    onClose={onClose}
                >
                    <QuickActionsPopoverContent
                        indentedActions={indentedActions}
                        onClose={onClose}
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

export const TicketImageContainer = React.memo(TicketImageContainerNotMemoized);
