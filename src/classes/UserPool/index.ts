import * as AWSCognitoIdentity from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_hjQ631UTC", // Your user pool id here
    ClientId: "66k3lt6jo9ia50dcrdbp4ipoh7", // Your client id here
};
export const userPool = new AWSCognitoIdentity.CognitoUserPool(poolData);
