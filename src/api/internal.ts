import { environmentVariables } from "../environmentVariables";
import Axios from "axios";
import { signedLearningVideoUrlReplace } from "../utils/signedLearningVideoUrlReplace";

interface ISignedUrlResponse {
    signedUrlPut: string;
    signedUrlGet: string;
}

export interface IInternalApi {
    createUploadLearningVideoSignedUrl(
        name: string,
        size: number,
        contentType: string
    ): Promise<ISignedUrlResponse>;
}

export class InternalApi implements IInternalApi {
    public async createUploadLearningVideoSignedUrl(
        name: string,
        size: number,
        contentType: string
    ): Promise<ISignedUrlResponse> {
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/createUploadLearningVideoSignedUrl`,
            {
                name,
                size,
                contentType,
            }
        );

        const data = axiosResponse.data as ISignedUrlResponse;

        const signedUrlResponse: ISignedUrlResponse = {
            signedUrlGet: "",
            signedUrlPut: "",
        };
        signedUrlResponse.signedUrlGet = signedLearningVideoUrlReplace(
            data.signedUrlGet
        );
        signedUrlResponse.signedUrlPut = signedLearningVideoUrlReplace(
            data.signedUrlPut
        );

        return signedUrlResponse;
    }
}
