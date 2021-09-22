export function mapColorToMaterialThemeColorLight(color: string) {
    if (color === "red") {
        return "error.light";
    } else if (color === "green") {
        return "success.light";
    } else if (color === "blue") {
        return "info.light";
    } else if (color === "yellow") {
        return "warning.light";
    } else {
        return "grey.300";
    }
}
