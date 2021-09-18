import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export function showDropdownOptionsFromRootTestId(rootTestId: string) {
    const dropdownRootTestId = screen.getByTestId(rootTestId);
    const dropdownButton = within(dropdownRootTestId).getByRole("button");
    userEvent.click(dropdownButton);
}
