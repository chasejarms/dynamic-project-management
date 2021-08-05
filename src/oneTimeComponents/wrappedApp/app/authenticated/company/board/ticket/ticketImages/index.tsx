/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { TicketPageWrapper } from "../../../../../../../../components/ticketPageWrapper";
import { WrappedButton } from "../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";

export function TicketImages() {
    const { companyId, boardId, ticketId } = useAppRouterParams();

    const [{ fileNames, isLoadingSignedUrls }, setSignedUrlData] = useState<{
        fileNames: string[];
        isLoadingSignedUrls: boolean;
    }>({
        fileNames: [],
        isLoadingSignedUrls: false,
    });
    useEffect(() => {
        if (!isLoadingSignedUrls) return;
        let didCancel = false;

        const files = fileNames.map((fileName) => {
            return {
                name: fileName,
            };
        });
        Api.tickets
            .createUploadTicketImageSignedUrls(
                companyId,
                boardId,
                ticketId,
                files
            )
            .then((signedUploadUrls) => {
                if (didCancel) return;
                console.log("signedUploadUrls: ", signedUploadUrls);
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setSignedUrlData({
                    fileNames: [],
                    isLoadingSignedUrls: false,
                });
            });

        return () => {
            didCancel = true;
        };
    }, [isLoadingSignedUrls]);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files) return;

        const fileNames: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const fileName = files.item(i)!.name;
            fileNames.push(fileName);
        }
        setSignedUrlData({
            fileNames,
            isLoadingSignedUrls: true,
        });
    }

    return (
        <TicketPageWrapper>
            <WrappedButton variant="contained" component="label">
                Upload File
                <input
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
