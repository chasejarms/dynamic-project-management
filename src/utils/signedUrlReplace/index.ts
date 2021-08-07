import { environmentVariables } from "../../environmentVariables";

export function signedUrlReplace(signedUrl: string) {
    return !environmentVariables.isLocalDevelopment
        ? signedUrl
        : signedUrl.replace(
              "https://elastic-project-management-company-source-files.s3.us-east-1.amazonaws.com",
              "/api/s3Presigned"
          );
}
