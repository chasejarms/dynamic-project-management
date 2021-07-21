import { useControl, IControl } from "./index";
import {
    renderHook,
    RenderHookResult,
    Renderer,
    act,
} from "@testing-library/react-hooks";

describe("useControl", () => {
    let renderHookResult: RenderHookResult<
        unknown,
        IControl<string, string>,
        Renderer<unknown>
    >;

    beforeEach(() => {
        renderHookResult = renderHook(() => {
            return useControl({
                value: "",
                onChange: (value: string) => value,
                validatorError: (value) => {
                    if (value === "") {
                        return "required";
                    } else {
                        return "";
                    }
                },
            });
        });
    });

    it("should default touched to false", () => {
        expect(renderHookResult.result.current.isTouched).toBe(false);
    });

    it("should mark the control as touched when the value changes", () => {
        act(() => {
            renderHookResult.result.current.onChange("hello");
        });
        expect(renderHookResult.result.current.isTouched).toBe(true);
    });

    it("should run the validation on mount by default", () => {
        expect(renderHookResult.result.current.errorMessage).toBe("required");
    });

    it("should NOT run the validation on mount if the props is false", () => {
        renderHookResult = renderHook(() => {
            return useControl({
                value: "",
                onChange: (value: string) => value,
                validatorError: (value) => {
                    if (value === "") {
                        return "required";
                    } else {
                        return "";
                    }
                },
                skipValidateOnMount: true,
            });
        });

        expect(renderHookResult.result.current.errorMessage).toBe("");
    });

    it("should run validation with every change", () => {
        act(() => {
            renderHookResult.result.current.onChange("hello");
        });
        expect(renderHookResult.result.current.errorMessage).toBe("");
        act(() => {
            renderHookResult.result.current.onChange("");
        });
        expect(renderHookResult.result.current.errorMessage).toBe("required");
    });

    it("should set isValid to false if there is an error", () => {
        act(() => {
            renderHookResult.result.current.onChange("hello");
        });
        expect(renderHookResult.result.current.errorMessage).toBe("");
        expect(renderHookResult.result.current.isValid).toBe(true);
        act(() => {
            renderHookResult.result.current.onChange("");
        });
        expect(renderHookResult.result.current.errorMessage).toBe("required");
        expect(renderHookResult.result.current.isValid).toBe(false);
    });

    // TODO: Finish out these tests
    it("should run validation based on additional validation dependencies passed in", () => {});

    it("should correctly handle the isDirty state", () => {});
});
