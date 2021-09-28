import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Color, colors } from "../../../../../../../../../../../models/color";
import { IStoreState } from "../../../../../../../../../../../redux/storeState";
import { setTemplateColor } from "../../../../../../../../../../../redux/ticketTemplates";
import { WrappedTextField } from "../../../../../../../../components/wrappedTextField";
import { mapColorToMaterialThemeColorLight } from "../../../../../initiativeManager/utils/mapColorToMaterialThemeColorLight";
import { mapColorToMaterialThemeColorDark } from "../../../../../initiativeManager/utils/mapColorToMaterialThemeColorDark";

export interface ITicketTemplateColorFieldProps {
    disabled: boolean;
    ticketTemplateId: string;
}

export function TicketTemplateColorField(
    props: ITicketTemplateColorFieldProps
) {
    const selectedColor =
        useSelector((store: IStoreState) => {
            return store.weightedTicketTemplateCreation[props.ticketTemplateId]
                .color;
        }) || Color.Grey;

    const dispatch = useDispatch();
    function onChangeColor(color: Color) {
        return () => {
            if (props.disabled) return;
            const action = setTemplateColor({
                color,
                ticketTemplateId: props.ticketTemplateId,
            });
            dispatch(action);
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

                        const bgOuterColor = mapColorToMaterialThemeColorDark(
                            color
                        );
                        const isSelected = selectedColor === color;
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
                                        cursor: props.disabled
                                            ? "auto"
                                            : "pointer",
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
