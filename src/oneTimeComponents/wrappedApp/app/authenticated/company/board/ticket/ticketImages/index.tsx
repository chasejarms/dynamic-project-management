/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { TicketPageWrapper } from "../../../../../../../../components/ticketPageWrapper";
import { WrappedButton } from "../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import Axios, { AxiosResponse } from "axios";
import { environmentVariables } from "../../../../../../../../environmentVariables";
import { IFileForTicket } from "../../../../../../../../models/fileForTicket";
import { CenterLoadingSpinner } from "../../../../../../../../components/centerLoadingSpinner";
import { signedUrlReplace } from "../../../../../../../../utils/signedUrlReplace";
import { TicketImageContainer } from "../../../../../../../../components/ticketImageContainer";

export function TicketImages() {
    const { companyId, boardId, ticketId } = useAppRouterParams();

    const [{ files, isLoadingSignedUrls }, setSignedUrlData] = useState<{
        files: File[];
        isLoadingSignedUrls: boolean;
    }>({
        files: [],
        isLoadingSignedUrls: false,
    });
    useEffect(() => {
        if (!isLoadingSignedUrls) return;
        let didCancel = false;

        const filesForPresignedUrlRequest = files.map(({ name }) => {
            return {
                name,
            };
        });
        Api.tickets
            .createUploadTicketImageSignedUrls(
                companyId,
                boardId,
                ticketId,
                filesForPresignedUrlRequest
            )
            .then((signedUploadUrls) => {
                if (didCancel) return;

                const mappedSignedUploadUrls = signedUploadUrls.map((url) => {
                    return signedUrlReplace(url);
                });

                const uploadToS3Promises: Promise<AxiosResponse<any>>[] = [];
                mappedSignedUploadUrls.forEach((url, index) => {
                    const compareFile = files[index];
                    const fileReader = new FileReader();
                    fileReader.onloadend = (fileReaderProgressEvent) => {
                        const fileToUploadResult = fileReaderProgressEvent
                            .target?.result as ArrayBuffer;
                        if (!fileToUploadResult) return;
                        let blobData = new Blob(
                            [new Uint8Array(fileToUploadResult)],
                            { type: "image/png" }
                        );
                        const uploadImageRequest = Axios.put(url, blobData);
                        uploadToS3Promises[index] = uploadImageRequest;
                    };
                    fileReader.readAsArrayBuffer(compareFile);
                });

                const interval = setInterval(() => {
                    const allFileUploadsAreReady =
                        uploadToS3Promises.length === files.length &&
                        uploadToS3Promises.every((value) => !!value);
                    if (allFileUploadsAreReady) {
                        Promise.all(uploadToS3Promises)
                            .then(() => {
                                if (didCancel) return;
                            })
                            .catch(() => {
                                if (didCancel) return;
                            })
                            .finally(() => {
                                if (didCancel) return;
                                setSignedUrlData({
                                    files: [],
                                    isLoadingSignedUrls: false,
                                });
                            });
                        clearInterval(interval);
                    }
                }, 20);
            })
            .catch(() => {
                if (didCancel) return;
                setSignedUrlData({
                    files: [],
                    isLoadingSignedUrls: false,
                });
            })
            .finally(() => {
                if (didCancel) return;
            });

        return () => {
            didCancel = true;
        };
    }, [isLoadingSignedUrls]);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const eventFiles = event.target.files;
        if (!eventFiles) return;

        const files: File[] = [];
        for (let i = 0; i < eventFiles.length; i++) {
            const file = eventFiles.item(i)!;
            files.push(file);
        }
        setSignedUrlData({
            files,
            isLoadingSignedUrls: true,
        });
    }

    const [filesForTicket, setFilesForTicket] = useState<IFileForTicket[]>([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState(true);
    useEffect(() => {
        if (!isLoadingFiles) return;
        let didCancel = false;

        Api.tickets
            .getTicketFilesWithSignedUrls(companyId, boardId, ticketId)
            .then((filesForTicketFromDatabase) => {
                if (didCancel) return;
                setFilesForTicket(filesForTicketFromDatabase);
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingFiles(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isLoadingFiles]);

    const classes = createClasses();

    return (
        <TicketPageWrapper>
            {isLoadingFiles ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.container}>
                    <div css={classes.actionButtonHeaderContainer}>
                        <WrappedButton color="primary" component="label">
                            Upload Image(s)
                            <input
                                value=""
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={onChange}
                                multiple
                            />
                        </WrappedButton>
                    </div>
                    <div css={classes.imagesContainer}>
                        {filesForTicket.map((file, index) => {
                            const updatedFile = {
                                ...file,
                                signedGetUrl: signedUrlReplace(
                                    file.signedGetUrl!
                                ),
                            };
                            return (
                                <TicketImageContainer
                                    file={updatedFile}
                                    key={index}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </TicketPageWrapper>
    );
}

const createClasses = () => {
    const container = css`
        width: 100%;
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
    `;

    const actionButtonHeaderContainer = css`
        display: flex;
        justify-content: flex-start;
        padding: 16px 32px 16px 32px;
    `;

    const imagesContainer = css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 16px;
        padding: 0px 32px 32px 32px;
    `;

    return {
        container,
        actionButtonHeaderContainer,
        imagesContainer,
    };
};
