/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
} from "@material-ui/core";
import { OpenInNew } from "@material-ui/icons";
import { ChangeEvent, ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { ITicketTemplate } from "../../../../../../../../models/ticketTemplate";

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

    const history = useHistory();
    function openTicketTemplateInNewTab() {
        history.push(`/`);
    }

    const classes = createClasses(!!showOpenIcon);
    return (
        <div css={classes.container}>
            <div>
                <FormControl fullWidth>
                    <InputLabel>Ticket Template</InputLabel>
                    <Select
                        value={ticketTemplate?.shortenedItemId || ""}
                        onChange={onChangeTicketTemplate}
                        disabled={disabled}
                    >
                        {ticketTemplates.map((ticketTemplateFromDatabase) => {
                            return (
                                <MenuItem
                                    value={
                                        ticketTemplateFromDatabase.shortenedItemId
                                    }
                                    key={
                                        ticketTemplateFromDatabase.shortenedItemId
                                    }
                                >
                                    {ticketTemplateFromDatabase.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </div>
            <div>
                {!!showOpenIcon && (
                    <IconButton onClick={openTicketTemplateInNewTab}>
                        <OpenInNew />
                    </IconButton>
                )}
            </div>
        </div>
    );
}

const createClasses = (showOpenIcon: boolean) => {
    const container = css`
        display: grid;
        grid-template-columns: ${showOpenIcon ? "1fr auto" : "1fr"};
        grid-gap: 16px;
    `;

    return {
        container,
    };
};
