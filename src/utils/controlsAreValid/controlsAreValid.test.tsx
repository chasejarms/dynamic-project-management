import { controlsAreValid } from "./index";
import { useControl } from "../../oneTimeComponents/wrappedApp/app/hooks/useControl";

describe("controlsAreValid", () => {
    it("should only return true if all controls are valid", () => {
        const controlsAreValidTest = controlsAreValid(
            {
                isValid: true,
            } as any,
            {
                isValid: true,
            } as any
        );
        expect(controlsAreValidTest).toBe(true);
    });

    it("should return false if any control is invalid", () => {
        const controlsAreValidTest = controlsAreValid(
            {
                isValid: true,
            } as any,
            {
                isValid: false,
            } as any
        );
        expect(controlsAreValidTest).toBe(false);
    });
});
