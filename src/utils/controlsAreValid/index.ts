import { IControl } from "../../hooks/useControl";

export function controlsAreValid(...controls: IControl<any, any>[]) {
    return controls.every((control) => control.isValid);
}
