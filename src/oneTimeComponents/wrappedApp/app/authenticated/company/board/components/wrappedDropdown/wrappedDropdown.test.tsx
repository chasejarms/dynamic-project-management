import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChangeEvent } from "react";
import { IWrappedDropdownProps, WrappedDropdown } from "./";
import { showDropdownOptionsFromRootTestId } from "./utils/showDropdownOptionsFromRootTestId";

describe("WrappedDropdown", () => {
    let wrappedDropdownProps: IWrappedDropdownProps;

    beforeEach(() => {
        wrappedDropdownProps = {
            value: "a",
            onChange: () => null,
            disabled: false,
            label: "Label",
            testIds: {
                root: "root",
                select: "select",
            },
            options: [
                {
                    value: "a",
                    label: "a",
                    testId: "a-option",
                    key: "a",
                },
                {
                    value: "b",
                    label: "b",
                    testId: "b-option",
                    key: "b",
                },
            ],
        };
    });

    it("should show the label", () => {
        render(<WrappedDropdown {...wrappedDropdownProps} />);
        screen.getByText("Label");
    });

    describe("the disabled prop is true", () => {
        it("should disable the dropdown", () => {
            wrappedDropdownProps.disabled = true;
            render(<WrappedDropdown {...wrappedDropdownProps} />);
            const select = screen.getByTestId("select");
            expect(select).toHaveClass("Mui-disabled");
        });
    });

    describe("the disabled prop is false", () => {
        it("should enable the dropdown", () => {
            wrappedDropdownProps.disabled = false;
            render(<WrappedDropdown {...wrappedDropdownProps} />);
            const select = screen.getByTestId("select");
            expect(select).not.toHaveClass("Mui-disabled");
        });
    });

    describe("the selected value changes", () => {
        it("should call the onChange function", () => {
            let updatedValue: any;
            wrappedDropdownProps.onChange = (
                event: ChangeEvent<{
                    name?: string | undefined;
                    value: unknown;
                }>
            ) => {
                updatedValue = event.target.value;
            };
            render(<WrappedDropdown {...wrappedDropdownProps} />);
            showDropdownOptionsFromRootTestId("root");

            const bItem = screen.getByTestId("b-option");
            userEvent.click(bItem);
            expect(updatedValue).toBe("b");
        });
    });
});
