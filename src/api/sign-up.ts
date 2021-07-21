import { ISignUpRequest } from "../models/signUpRequest";
import { environmentVariables } from "../environmentVariables";
import { axiosInstance } from "../hooks/useAxiosInterceptor";

export interface ISignUpApi {
    signUp(request: ISignUpRequest): Promise<any>;
}

export class SignUpApi implements ISignUpApi {
    public signUp(request: ISignUpRequest) {
        return axiosInstance.post(
            `${environmentVariables.basePublicApiUrl}/sign-up-new-user`,
            request
        );
    }
}
