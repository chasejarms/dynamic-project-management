import { render, screen } from "@testing-library/react";
import { BottomPageToolbar } from ".";

describe("Bottom Page Toolbar", () => {
    describe("the right button props are passed in", () => {
        it("should display the right button", () => {
            render(
                <BottomPageToolbar
                    rightWrappedButtonProps={[
                        {
                            variant: "contained",
                            onClick: () => null,
                            color: "primary",
                            disabled: false,
                            showSpinner: false,
                            children: "Right Button",
                        },
                    ]}
                />
            );

            screen.getByText("Right Button");
        });
    });

    describe("the left button props are passed in", () => {
        it("should display the left button", () => {
            render(
                <BottomPageToolbar
                    leftWrappedButtonProps={[
                        {
                            variant: "contained",
                            onClick: () => null,
                            color: "primary",
                            disabled: false,
                            showSpinner: false,
                            children: "Left Button",
                        },
                    ]}
                />
            );

            screen.getByText("Left Button");
        });
    });

    describe("the right and left button props are passed in", () => {
        it("should display the right and left button props", () => {
            render(
                <BottomPageToolbar
                    leftWrappedButtonProps={[
                        {
                            variant: "contained",
                            onClick: () => null,
                            color: "primary",
                            disabled: false,
                            showSpinner: false,
                            children: "Left Button",
                        },
                    ]}
                    rightWrappedButtonProps={[
                        {
                            variant: "contained",
                            onClick: () => null,
                            color: "primary",
                            disabled: false,
                            showSpinner: false,
                            children: "Right Button",
                        },
                    ]}
                />
            );

            screen.getByText("Left Button");
            screen.getByText("Right Button");
        });
    });
});
