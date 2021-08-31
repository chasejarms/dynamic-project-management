/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomPageToolbar } from "../../../../../../../../../components/bottomPageToolbar";
import { WeightedBoardContainer } from "../../../../../../../../../components/weightedBoardContainer";
import { WeightedPriorityTicketTemplateActions } from "../../../../../../../../../components/weightedPriorityTicketTemplateActions";
import { IWrappedButtonProps } from "../../../../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../../../../components/wrappedTextField";
import { useAppRouterParams } from "../../../../../../../../../hooks/useAppRouterParams";
import { IStoreState } from "../../../../../../../../../redux/storeState";
import {
    updateWeightedTicketTemplateCreationDescription,
    updateWeightedTicketTemplateCreationName,
    updateWeightedTicketTemplateCreationSummary,
    updateWeightedTicketTemplateCreationTitle,
} from "../../../../../../../../../redux/weightedTicketTemplateCreation";

export function CreateTicketTemplate() {
    const { boardId, companyId } = useAppRouterParams();

    const [isCreatingTicketTemplate, setIsCreatingTicketTemplate] = useState(
        false
    );
    const dispatch = useDispatch();
    const weightedTicketTemplate = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation;
    });

    function onClickAddAfter(index: number) {
        return () => {};
    }

    function onClickDelete(index: number, uniqueId: string) {}

    useEffect(() => {
        if (!isCreatingTicketTemplate) return;
    }, [isCreatingTicketTemplate, companyId, boardId]);

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: () => {
                setIsCreatingTicketTemplate(true);
            },
            color: "primary",
            disabled: isCreatingTicketTemplate,
            showSpinner: isCreatingTicketTemplate,
            children: "Create Ticket Template",
        },
    ];

    function onChangeTicketTemplateName(
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const value = eventType.target.value as string;
        const action = updateWeightedTicketTemplateCreationName(value);
        dispatch(action);
    }

    function onChangeTicketTemplateDescription(
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const value = eventType.target.value as string;
        const action = updateWeightedTicketTemplateCreationDescription(value);
        dispatch(action);
    }

    function onChangeTicketTemplateTitle(
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const value = eventType.target.value as string;
        const action = updateWeightedTicketTemplateCreationTitle(value);
        dispatch(action);
    }

    function onChangeTicketTemplateSummary(
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const value = eventType.target.value as string;
        const action = updateWeightedTicketTemplateCreationSummary(value);
        dispatch(action);
    }

    const classes = createClasses();
    return (
        <WeightedBoardContainer>
            <div css={classes.container}>
                <div css={classes.flexContentContainer}>
                    <div css={classes.gridContentContainer}>
                        <div css={classes.formBuilderContainer}>
                            <div css={classes.columnInputContainer}>
                                <div>
                                    <WrappedTextField
                                        value={
                                            weightedTicketTemplate.name.value
                                        }
                                        label="Template Name"
                                        required
                                        onChange={onChangeTicketTemplateName}
                                        error={
                                            (weightedTicketTemplate.name
                                                .touched &&
                                                weightedTicketTemplate.name
                                                    .error) ||
                                            ""
                                        }
                                        disabled={isCreatingTicketTemplate}
                                    />
                                </div>
                                <div />
                            </div>
                            <div css={classes.columnInputContainer}>
                                <div>
                                    <WrappedTextField
                                        value={
                                            weightedTicketTemplate.description
                                                .value
                                        }
                                        label="Template Description"
                                        onChange={
                                            onChangeTicketTemplateDescription
                                        }
                                        error={
                                            (weightedTicketTemplate.description
                                                .touched &&
                                                weightedTicketTemplate
                                                    .description.error) ||
                                            ""
                                        }
                                        disabled={isCreatingTicketTemplate}
                                        multiline
                                        required
                                    />
                                </div>
                                <div />
                            </div>
                            <div css={classes.columnInputContainer}>
                                <div>
                                    <WrappedTextField
                                        value={
                                            weightedTicketTemplate.title.value
                                        }
                                        label="Ticket Title Label"
                                        onChange={onChangeTicketTemplateTitle}
                                        error={
                                            (weightedTicketTemplate.title
                                                .touched &&
                                                weightedTicketTemplate.title
                                                    .error) ||
                                            ""
                                        }
                                        disabled={isCreatingTicketTemplate}
                                        required
                                    />
                                </div>
                                <div />
                            </div>
                            <div css={classes.columnInputContainer}>
                                <div>
                                    <WrappedTextField
                                        value={
                                            weightedTicketTemplate.summary.value
                                        }
                                        label="Ticket Summary Label"
                                        onChange={onChangeTicketTemplateSummary}
                                        error={
                                            (weightedTicketTemplate.summary
                                                .touched &&
                                                weightedTicketTemplate.summary
                                                    .error) ||
                                            ""
                                        }
                                        disabled={isCreatingTicketTemplate}
                                        required
                                    />
                                </div>
                                <div>
                                    <WeightedPriorityTicketTemplateActions
                                        disabled={isCreatingTicketTemplate}
                                        onClickAddAfter={onClickAddAfter(-1)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div css={classes.bottomToolbarContainer}>
                    <BottomPageToolbar
                        wrappedButtonProps={wrappedButtonProps}
                    />
                </div>
            </div>
        </WeightedBoardContainer>
    );
}

const createClasses = () => {
    const container = css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    `;

    const gridContentContainer = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0 32px;
        flex-grow: 1;
    `;

    const flexContentContainer = css`
        display: flex;
        flex-grow: 1;
    `;

    const formBuilderContainer = css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding-top: 32px;
        padding-bottom: 32px;
        overflow-y: auto;
    `;

    const bottomToolbarContainer = css`
        flex: 0 0 auto;
    `;

    const columnInputContainer = css`
        display: grid;
        grid-template-columns: 1fr 100px;
        grid-gap: 32px;
    `;

    return {
        container,
        gridContentContainer,
        formBuilderContainer,
        bottomToolbarContainer,
        flexContentContainer,
        columnInputContainer,
    };
};
