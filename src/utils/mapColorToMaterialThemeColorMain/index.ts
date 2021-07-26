import { Theme } from "@material-ui/core";

export function mapColorToMaterialThemeColorMain(theme: Theme, color: string) {
    if (color === "red") {
        return theme.palette.error.dark;
    } else if (color === "green") {
        return theme.palette.success.dark;
    } else if (color === "blue") {
        return theme.palette.info.dark;
    } else if (color === "yellow") {
        return theme.palette.warning.dark;
    } else {
        return theme.palette.grey["600"];
    }
}
