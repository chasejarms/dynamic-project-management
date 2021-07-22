import * as AWSCognitoIdentity from "amazon-cognito-identity-js";
import { userPool } from "../UserPool";

class CognitoUserSingleton {
    public cognitoUser: AWSCognitoIdentity.CognitoUser = new AWSCognitoIdentity.CognitoUser(
        {
            Username: localStorage.getItem("userEmail") || "",
            Pool: userPool,
        }
    );
}

export const cognitoUserSingleton = new CognitoUserSingleton();
