import { ISignUpRequest } from "../models/signUpRequest";
import Axios from "axios";
import { environmentVariables } from "../environmentVariables";

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
