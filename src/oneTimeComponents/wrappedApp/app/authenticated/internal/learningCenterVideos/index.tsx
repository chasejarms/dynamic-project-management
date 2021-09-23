import { useEffect, useState } from "react";
import { Api } from "../../../../../../api";
import { InternalUserContainer } from "../components/internalUserContainer";
import { WrappedButton } from "../../../components/wrappedButton";
import Axios, { AxiosResponse } from "axios";
import { Box } from "@mui/material";

export function LearningCenterVideos() {
    const [{ file, isUploadingVideo }, setSignedUrlData] = useState<{
        file: File | null;
        isUploadingVideo: boolean;
    }>({
        file: null,
        isUploadingVideo: false,
    });

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const eventFiles = event.target.files;
        if (!eventFiles) return;

        const file: File | null = eventFiles.item(0);
        if (!file) return;

        setSignedUrlData({
            file,
            isUploadingVideo: true,
        });
    }

    useEffect(() => {
        if (!isUploadingVideo || !file) return;
        let didCancel = false;

        const { name, size, type } = file;
        Api.internal
            .createUploadLearningVideoSignedUrl(name, size, type)
            .then((response) => {
                if (didCancel) return;

                let uploadToS3Promise: Promise<AxiosResponse<any>>;
                const fileReader = new FileReader();
                fileReader.onloadend = (fileReaderProgressEvent) => {
                    const fileToUploadResult = fileReaderProgressEvent.target
                        ?.result as ArrayBuffer;
                    if (!fileToUploadResult) return;
                    let blobData = new Blob(
                        [new Uint8Array(fileToUploadResult)],
                        { type }
                    );
                    const uploadImageRequest = Axios.put(
                        response.signedUrlPut,
                        blobData
                    );
                    uploadToS3Promise = uploadImageRequest;
                };
                fileReader.readAsArrayBuffer(file);

                const interval = setInterval(() => {
                    const fileUploadIsReady = !!uploadToS3Promise;
                    if (fileUploadIsReady) {
                        uploadToS3Promise
                            .then(() => {
                                if (didCancel) return;
                                // setFilesForTicket((previousFilesForTicket) => {
                                //     const existingFilesMapping = previousFilesForTicket.reduce<{
                                //         [fileName: string]: IFileForTicket;
                                //     }>((mapping, previousFileForTicket) => {
                                //         mapping[
                                //             previousFileForTicket.fileName
                                //         ] = previousFileForTicket;
                                //         return mapping;
                                //     }, {});
                                //     Object.keys(response).forEach(
                                //         (fileName) => {
                                //             existingFilesMapping[fileName] = {
                                //                 size: 0,
                                //                 fileName,
                                //                 signedGetUrl:
                                //                     response[fileName]
                                //                         .getSignedUrl,
                                //             };
                                //         }
                                //     );

                                //     const updatedFilesForTicket = Object.keys(
                                //         existingFilesMapping
                                //     ).map((fileName) => {
                                //         return existingFilesMapping[fileName];
                                //     });
                                //     const sortedFiles = sortBy(
                                //         updatedFilesForTicket,
                                //         "fileName"
                                //     );
                                //     return sortedFiles;
                                // });
                            })
                            .catch(() => {
                                if (didCancel) return;
                            })
                            .finally(() => {
                                if (didCancel) return;
                                setSignedUrlData({
                                    file: null,
                                    isUploadingVideo: false,
                                });
                            });
                        clearInterval(interval);
                    }
                }, 20);
            })
            .catch(() => {
                if (didCancel) return;
                setSignedUrlData({
                    file: null,
                    isUploadingVideo: false,
                });
            })
            .finally(() => {
                if (didCancel) return;
            });

        return () => {
            didCancel = true;
        };
    }, [isUploadingVideo]);

    return (
        <InternalUserContainer>
            <Box
                sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateRows: "auto 1fr",
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        py: 2,
                        px: 4,
                    }}
                >
                    <WrappedButton
                        color="primary"
                        component="label"
                        disabled={isUploadingVideo}
                        showSpinner={isUploadingVideo}
                    >
                        Upload Video
                        <input
                            value=""
                            type="file"
                            hidden
                            accept="video/mp4"
                            onChange={onChange}
                        />
                    </WrappedButton>
                </Box>
            </Box>
        </InternalUserContainer>
    );
}
