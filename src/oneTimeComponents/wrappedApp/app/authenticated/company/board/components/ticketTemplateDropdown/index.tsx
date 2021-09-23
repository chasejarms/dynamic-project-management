import { IconButton, SelectChangeEvent, Box } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { ITicketTemplate } from "../../../../../../../../models/ticketTemplate";
import { useAppRouterParams } from "../../../../../hooks/useAppRouterParams";
import { IWrappedDropdownOption, WrappedDropdown } from "../wrappedDropdown";
import { ticketTemplateDropdownTestsIds } from "./ticketTemplateDropdown.testIds";
import { RouteCreator } from "../../../../../utils/routeCreator";

export interface ITicketTemplateDropdownProps {
    ticketTemplate: null | ITicketTemplate;
    ticketTemplates: ITicketTemplate[];
    onChangeTicketTemplate: (event: SelectChangeEvent<any>) => void;
    disabled: boolean;
    showOpenIcon?: boolean;
}

export function TicketTemplateDropdown(props: ITicketTemplateDropdownProps) {
    const {
        ticketTemplate,
        ticketTemplates,
        disabled,
        onChangeTicketTemplate,
        showOpenIcon,
    } = props;

    const { companyId, boardId } = useAppRouterParams();

    function openTicketTemplateInNewTab() {
        const ticketTemplateEditRoute = RouteCreator.ticketTemplateEdit(
            companyId,
            boardId,
            ticketTemplate?.shortenedItemId || ""
        );
        window.open(ticketTemplateEditRoute, "_blank");
    }

    const options: IWrappedDropdownOption[] = ticketTemplates.map(
        (ticketTemplateFromDatabase) => {
            return {
                value: ticketTemplateFromDatabase.shortenedItemId,
                label: ticketTemplateFromDatabase.name,
                key: ticketTemplateFromDatabase.shortenedItemId,
                testId: ticketTemplateDropdownTestsIds.createMenuItemTestId(
                    ticketTemplateFromDatabase.shortenedItemId
                ),
            };
        }
    );

    const gridTemplateColumns = !!props.showOpenIcon ? "1fr auto" : "1fr";
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns,
                gap: 1,
            }}
        >
            <div>
                <WrappedDropdown
                    value={ticketTemplate?.shortenedItemId || ""}
                    onChange={onChangeTicketTemplate}
                    label="Ticket Template"
                    disabled={disabled}
                    testIds={{
                        root: ticketTemplateDropdownTestsIds.root,
                        select: ticketTemplateDropdownTestsIds.select,
                    }}
                    options={options}
                />
            </div>
            <div>
                {!!showOpenIcon && (
                    <Box
                        sx={{
                            position: "relative",
                            top: "8px",
                        }}
                    >
                        <IconButton
                            onClick={openTicketTemplateInNewTab}
                            disabled={ticketTemplate === null}
                            data-testid={
                                ticketTemplateDropdownTestsIds.openIcon
                            }
                        >
                            <OpenInNew />
                        </IconButton>
                    </Box>
                )}
            </div>
        </Box>
    );
}
