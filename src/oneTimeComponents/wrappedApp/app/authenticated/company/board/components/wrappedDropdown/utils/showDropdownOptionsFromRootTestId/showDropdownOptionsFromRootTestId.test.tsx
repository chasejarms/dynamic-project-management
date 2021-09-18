import { render, screen } from "@testing-library/react";
import { WrappedDropdown } from "../..";
import { showDropdownOptionsFromRootTestId } from "./";

describe("showDropdownOptionsFromRootTestId", () => {
    it("should show the dropdown options", () => {
        render(
            <WrappedDropdown
                value={"a"}
                onChange={() => null}
                disabled={false}
                label={"Label"}
                testIds={{
                    root: "root",
                    select: "select",
                }}
                options={[
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
                ]}
            />
        );

        showDropdownOptionsFromRootTestId("select");
        screen.getByTestId("a-option");
        screen.getByTestId("b-option");
    });
});
