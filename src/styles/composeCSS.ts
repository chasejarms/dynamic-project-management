import { SerializedStyles } from "@emotion/react";

type IComposeCSSParameter = SerializedStyles | false;

export function composeCSS(
    ...cssParameterOptions: IComposeCSSParameter[]
): SerializedStyles[] {
    return cssParameterOptions.filter(
        (cssParameterOption) => !!cssParameterOption
    ) as SerializedStyles[];
}
