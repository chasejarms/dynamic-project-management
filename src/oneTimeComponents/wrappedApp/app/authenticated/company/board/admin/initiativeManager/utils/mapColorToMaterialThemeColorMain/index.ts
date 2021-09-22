export function mapColorToMaterialThemeColorMain(color: string) {
    if (color === "red") {
        return "error.dark";
    } else if (color === "green") {
        return "success.dark";
    } else if (color === "blue") {
        return "info.dark";
    } else if (color === "yellow") {
        return "warning.dark";
    } else {
        return "grey.600";
    }
}
