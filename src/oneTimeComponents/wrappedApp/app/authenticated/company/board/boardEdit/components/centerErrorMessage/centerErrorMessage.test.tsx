import { render } from "@testing-library/react";
import { CenterErrorMessage } from "./";

describe("Center Error Message", () => {
    it("should show the message text", () => {
        const errorMessage = "Error Message Here";
        const renderResult = render(
            <CenterErrorMessage message={errorMessage} />
        );
        renderResult.getByText(errorMessage);
    });
});
