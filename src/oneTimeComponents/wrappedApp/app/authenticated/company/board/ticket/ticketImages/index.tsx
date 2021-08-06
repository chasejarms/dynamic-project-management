/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { TicketPageWrapper } from "../../../../../../../../components/ticketPageWrapper";
import { WrappedButton } from "../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import Axios, { AxiosResponse } from "axios";
import { environmentVariables } from "../../../../../../../../environmentVariables";

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

                console.log("environment variables: ", environmentVariables);

                const mappedSignedUploadUrls = !environmentVariables.isLocalDevelopment
                    ? signedUploadUrls
                    : signedUploadUrls.map((url) => {
                          const updatedUrl = url.replace(
                              "https://elastic-project-management-company-source-files.s3.us-east-1.amazonaws.com",
                              "/api/s3Presigned"
                          );
                          return updatedUrl;
                      });

                const uploadToS3Promises: Promise<AxiosResponse<any>>[] = [];
                mappedSignedUploadUrls.forEach((url, index) => {
                    const compareFile = files[index];
                    var body = new FormData();
                    const fileReader = new FileReader();
                    fileReader.onload = (fileReaderProgressEvent) => {
                        const fileToUploadResult =
                            fileReaderProgressEvent.target?.result;
                        if (!fileToUploadResult) return;
                        body.set("file", fileToUploadResult as any);
                        const uploadImageRequest = Axios.put(url, body);
                        uploadToS3Promises[index] = uploadImageRequest;
                    };
                    fileReader.readAsBinaryString(compareFile);
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

    return (
        <TicketPageWrapper>
            <WrappedButton variant="contained" component="label">
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
        </TicketPageWrapper>
    );
}
