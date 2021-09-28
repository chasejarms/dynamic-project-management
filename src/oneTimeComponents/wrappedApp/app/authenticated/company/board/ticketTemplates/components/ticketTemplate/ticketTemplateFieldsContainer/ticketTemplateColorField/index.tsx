import { Box, FormControl, InputLabel, Typography } from "@mui/material";
import { Color, colors } from "../../../../../../../../../../../models/color";
import { WrappedTextField } from "../../../../../../../../components/wrappedTextField";
import { mapColorToMaterialThemeColorLight } from "../../../../../initiativeManager/utils/mapColorToMaterialThemeColorLight";
import { mapColorToMaterialThemeColorMain } from "../../../../../initiativeManager/utils/mapColorToMaterialThemeColorMain";

export function TicketTemplateColorField() {
    function onChangeColor(color: Color) {
        return () => {
            // do something with that information
        };
    }

    return (
        <Box
            sx={{
                position: "relative",
            }}
        >
            <WrappedTextField
                label="Template Color"
                onChange={() => null}
                value=" "
                multiline
                minRows={2}
            />
            <Box
                sx={{
                    top: "-5px",
                    right: 0,
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        marginLeft: 2,
                    }}
                >
                    {colors.map((color) => {
                        const bgInnerColor = mapColorToMaterialThemeColorLight(
                            color
                        );

                        const bgOuterColor = mapColorToMaterialThemeColorMain(
                            color
                        );
                        const isSelected = color === Color.Blue;
                        // const isSelected = colorControl.value === color;
                        const actualBgOuterColor = isSelected
                            ? bgOuterColor
                            : "transparent";

                        return (
                            <Box
                                sx={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: "50%",
                                    marginRight: 2,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    bgcolor: actualBgOuterColor,
                                }}
                                key={color}
                            >
                                <Box
                                    sx={{
                                        height: 32,
                                        width: 32,
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        bgcolor: bgInnerColor,
                                    }}
                                    onClick={onChangeColor(color)}
                                />
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
}
