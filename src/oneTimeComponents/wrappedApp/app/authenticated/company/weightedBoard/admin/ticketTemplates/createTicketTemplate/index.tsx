/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomPageToolbar } from "../../../../../../../../../components/bottomPageToolbar";
import { WeightedBoardContainer } from "../../../../../../../../../components/weightedBoardContainer";
import { WeightedPriorityTicketTemplateActions } from "../../../../../../../../../components/weightedPriorityTicketTemplateActions";
import { WeightedTicketTemplateTextControl } from "../../../../../../../../../components/weightedTicketTemplateTextControl";
import { IWrappedButtonProps } from "../../../../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../../../../components/wrappedTextField";
import { useAppRouterParams } from "../../../../../../../../../hooks/useAppRouterParams";
import { IWeightedNumberSection } from "../../../../../../../../../models/weightedSections/weightedNumberSection";
import { IWeightedTextSection } from "../../../../../../../../../models/weightedSections/weightedTextSection";
import { IStoreState } from "../../../../../../../../../redux/storeState";
import {
    insertWeightedTicketCreationSection,
    overrideWeightedTicketCreationSection,
    updateWeightedTicketTemplateCreationDescription,
    updateWeightedTicketTemplateCreationName,
    updateWeightedTicketTemplateCreationSummary,
    updateWeightedTicketTemplateCreationTitle,
} from "../../../../../../../../../redux/weightedTicketTemplateCreation";
import { composeCSS } from "../../../../../../../../../styles/composeCSS";

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
        return (type: string) => {
            if (type === "text") {
                const weightedTextSection: IWeightedTextSection = {
                    type: "text",
                    label: "Default Label",
                    multiline: true,
                    required: false,
                };
                const action = insertWeightedTicketCreationSection({
                    value: weightedTextSection,
                    index,
                });
                dispatch(action);
            } else if (type === "number") {
                const weightedNumberSection: IWeightedNumberSection = {
                    type: "number",
                    label: "Default Label",
                    required: false,
                };
                const action = insertWeightedTicketCreationSection({
                    value: weightedNumberSection,
                    index,
                });
                dispatch(action);
            }
        };
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

    function onChangeLabelText(index: number) {
        return (
            eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const value = eventType.target.value as string;
            const updatedWeightedTextSection: IWeightedTextSection = {
                ...(weightedTicketTemplate.sections[
                    index
                ] as IWeightedTextSection),
                label: value,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedTextSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeMultilineValue(index: number) {
        return (checked: boolean) => {
            const updatedWeightedTextSection: IWeightedTextSection = {
                ...(weightedTicketTemplate.sections[
                    index
                ] as IWeightedTextSection),
                multiline: checked,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedTextSection,
                index,
            });
            dispatch(action);
        };
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
                            {weightedTicketTemplate.sections.map(
                                (section, index) => {
                                    if (section.type === "text") {
                                        return (
                                            <div
                                                css={composeCSS(
                                                    classes.columnInputContainer,
                                                    classes.textControlContainer
                                                )}
                                                key={index}
                                            >
                                                <div>
                                                    <WeightedTicketTemplateTextControl
                                                        label={section.label}
                                                        multiline={
                                                            section.multiline
                                                        }
                                                        disabled={
                                                            isCreatingTicketTemplate
                                                        }
                                                        error={""}
                                                        touched={false}
                                                        onChangeLabelText={onChangeLabelText(
                                                            index
                                                        )}
                                                        onChangeMultilineValue={onChangeMultilineValue(
                                                            index
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <WeightedPriorityTicketTemplateActions
                                                        disabled={
                                                            isCreatingTicketTemplate
                                                        }
                                                        onClickAddAfter={onClickAddAfter(
                                                            index
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    } else if (section.type === "number") {
                                        // do something
                                    }
                                }
                            )}
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
        overflow-y: auto;
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

    const textControlContainer = css`
        margin-top: 16px;
    `;

    return {
        container,
        gridContentContainer,
        formBuilderContainer,
        bottomToolbarContainer,
        flexContentContainer,
        columnInputContainer,
        textControlContainer,
    };
};
