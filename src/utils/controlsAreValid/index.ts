import { IControl } from "../../oneTimeComponents/wrappedApp/app/hooks/useControl";

export function controlsAreValid(...controls: IControl<any, any>[]) {
    return controls.every((control) => control.isValid);
}
