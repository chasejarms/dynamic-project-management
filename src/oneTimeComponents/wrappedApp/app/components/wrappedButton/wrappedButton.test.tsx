import { render, screen } from "@testing-library/react";
import { WrappedButton } from ".";

describe("Wrapped Button", () => {
    describe("the showSpinner prop is true", () => {
        it("should show the spinner", () => {
            render(
                <WrappedButton
                    showSpinner={true}
                    testIds={{
                        spinner: "spinner",
                    }}
                >
                    Some Text
                </WrappedButton>
            );

            screen.getByTestId("spinner");
        });
    });

    describe("the showSpinner prop is false", () => {
        it("should hide the spinner", () => {
            render(
                <WrappedButton
                    testIds={{
                        spinner: "spinner",
                    }}
                >
                    Some Text
                </WrappedButton>
            );

            const spinner = screen.queryByTestId("spinner");
            expect(spinner).toBeNull();
        });
    });
});
