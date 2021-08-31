/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { IconButton } from "@material-ui/core";
import React from "react";
import { Add, DeleteForever } from "@material-ui/icons";
import { composeCSS } from "../../styles/composeCSS";

export interface IWeightedPriorityTicketTemplateActions {
    onClickAddAfter?: () => void;
    disabled: boolean;
    onClickDelete?: () => void;
}

export function WeightedPriorityTicketTemplateActions(
    props: IWeightedPriorityTicketTemplateActions
) {
    const classes = createClasses();

    return (
        <div css={classes.container}>
            <div>
                <IconButton
                    disabled={props.disabled}
                    onClick={props.onClickAddAfter}
                    color="primary"
                >
                    <Add />
                </IconButton>
            </div>
            {!!props.onClickDelete && (
                <div>
                    <IconButton
                        disabled={props.disabled}
                        onClick={props.onClickDelete}
                        color="primary"
                    >
                        <DeleteForever />
                    </IconButton>
                </div>
            )}
        </div>
    );
}

const createClasses = () => {
    const container = css`
        position: relative;
        width: 80px;
        display: grid;
        grid-template-columns: auto;
        grid-gap: 8px;
    `;

    return {
        container,
    };
};
