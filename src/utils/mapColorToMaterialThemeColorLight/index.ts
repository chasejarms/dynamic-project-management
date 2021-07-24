import { Theme } from "@material-ui/core";

export function mapColorToMaterialThemeColorLight(theme: Theme, color: string) {
    if (color === "red") {
        return theme.palette.error.light;
    } else if (color === "green") {
        return theme.palette.success.light;
    } else if (color === "blue") {
        return theme.palette.info.light;
    } else if (color === "yello") {
        return theme.palette.warning.light;
    } else {
        return "#ffffff";
    }
}
