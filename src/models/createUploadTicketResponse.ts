export interface ICreateUploadTicketResponse {
    [fileName: string]: {
        fileName: string;
        putSignedUrl: string;
        getSignedUrl: string;
    };
}
