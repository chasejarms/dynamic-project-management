import { environmentVariables } from "../../environmentVariables";

export function signedLearningVideoUrlReplace(signedUrl: string) {
    return !environmentVariables.isLocalDevelopment
        ? signedUrl
        : signedUrl.replace(
              "https://learning-center-files.s3.us-east-1.amazonaws.com",
              "/api/s3LearningVideoPresigned"
          );
}
