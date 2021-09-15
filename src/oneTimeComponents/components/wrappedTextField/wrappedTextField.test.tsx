import { WrappedTextField } from "./index";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("wrappedTextField", () => {
    it("should display the passed in label", () => {
        const renderResult = render(
            <WrappedTextField
                label={"label"}
                value={""}
                onChange={() => null}
            />
        );

        renderResult.getByText("label");
    });

    it("should correctly call the on change method", () => {
        let valueFromRenderResult = "";

        const renderResult = render(
            <WrappedTextField
                label={"label"}
                value={""}
                onChange={(event) => {
                    valueFromRenderResult = event.target.value;
                }}
                testIds={{
                    input: "input",
                }}
            />
        );

        const input = renderResult.getByTestId("input");
        userEvent.type(input, "a");
        expect(valueFromRenderResult).toBe("a");
    });

    it("should show an error when an error is provided", () => {
        const renderResult = render(
            <WrappedTextField
                label={"label"}
                value={""}
                onChange={() => null}
                error={"error"}
            />
        );

        renderResult.getByText("error");
    });

    it("should always render the helper text container, even if there's no error message", () => {
        const renderResult = render(
            <WrappedTextField
                label={"label"}
                value={""}
                onChange={() => null}
                testIds={{
                    helperTextContainer: "container",
                }}
            />
        );

        renderResult.getByTestId("container");
    });
});
