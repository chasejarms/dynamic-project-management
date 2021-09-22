/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { IconButton } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { ChangeEvent, ReactNode } from "react";
import { ITicketTemplate } from "../../../../../../../../models/ticketTemplate";
import { useAppRouterParams } from "../../../../../hooks/useAppRouterParams";
import { IWrappedDropdownOption, WrappedDropdown } from "../wrappedDropdown";
import { ticketTemplateDropdownTestsIds } from "./ticketTemplateDropdown.testIds";
import { RouteCreator } from "../../../../../utils/routeCreator";

export interface ITicketTemplateDropdownProps {
    ticketTemplate: null | ITicketTemplate;
    ticketTemplates: ITicketTemplate[];
    onChangeTicketTemplate: (
        event: ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>,
        child: ReactNode
    ) => void;
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

    const classes = createClasses(!!showOpenIcon);
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

    return (
        <div css={classes.container}>
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
                    <div css={classes.iconContainer}>
                        <IconButton
                            onClick={openTicketTemplateInNewTab}
                            disabled={ticketTemplate === null}
                            data-testid={
                                ticketTemplateDropdownTestsIds.openIcon
                            }
                        >
                            <OpenInNew />
                        </IconButton>
                    </div>
                )}
            </div>
        </div>
    );
}

const createClasses = (showOpenIcon: boolean) => {
    const container = css`
        display: grid;
        grid-template-columns: ${showOpenIcon ? "1fr auto" : "1fr"};
        grid-gap: 8px;
    `;

    const iconContainer = css`
        position: relative;
        top: 8px;
    `;

    return {
        container,
        iconContainer,
    };
};
