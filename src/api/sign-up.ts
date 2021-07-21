import { ISignUpRequest } from "../models/signUpRequest";
import { environmentVariables } from "../environmentVariables";
import Axios from "axios";

export interface ISignUpApi {
    signUp(request: ISignUpRequest): Promise<any>;
}

export class SignUpApi implements ISignUpApi {
    public signUp(request: ISignUpRequest) {
        return Axios.post(
            `${environmentVariables.basePublicApiUrl}/sign-up-new-user`,
            request
        );
    }
}
