/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { TicketPageWrapper } from "../../../../../../../../components/ticketPageWrapper";

export function TicketImages() {
    const [url, setUrl] = useState("");

    useEffect(() => {
        let didCancel = false;

        Api.tickets
            .createUploadTicketImageSignedUrl()
            .then((urlFromEndpoint) => {
                if (didCancel) return;
                setUrl(urlFromEndpoint);
            });

        return () => {
            didCancel = true;
        };
    }, []);

    return <TicketPageWrapper>{!!url && <img src={url} />}</TicketPageWrapper>;
}
