import { environmentVariables } from "../environmentVariables";
import Axios from "axios";

export interface IContactApi {
    capturePublicFormData(formData: any): Promise<void>;
}

export class ContactApi implements IContactApi {
    public async capturePublicFormData(formData: any): Promise<void> {
        return Axios.post(
            `${environmentVariables.basePublicApiUrl}/capture-public-form-data`,
            formData
        );
    }
}
