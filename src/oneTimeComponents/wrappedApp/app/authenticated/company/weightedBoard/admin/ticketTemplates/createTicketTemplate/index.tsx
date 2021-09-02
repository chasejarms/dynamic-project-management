/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomPageToolbar } from "../../../../../../../../../components/bottomPageToolbar";
import { TagChip } from "../../../../../../../../../components/tagChip";
import { WeightedBoardContainer } from "../../../../../../../../../components/weightedBoardContainer";
import { WeightedPriorityTicketTemplateActions } from "../../../../../../../../../components/weightedPriorityTicketTemplateActions";
import { WeightedTicketTemplateNumberControl } from "../../../../../../../../../components/weightedTicketTemplateNumberControl";
import { WeightedTicketTemplateTextControl } from "../../../../../../../../../components/weightedTicketTemplateTextControl";
import { IWrappedButtonProps } from "../../../../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../../../../components/wrappedTextField";
import { useAppRouterParams } from "../../../../../../../../../hooks/useAppRouterParams";
import { useControl } from "../../../../../../../../../hooks/useControl";
import { IWeightedNumberSection } from "../../../../../../../../../models/weightedSections/weightedNumberSection";
import { IWeightedTextSection } from "../../../../../../../../../models/weightedSections/weightedTextSection";
import { IStoreState } from "../../../../../../../../../redux/storeState";
import {
    deleteWeightedTicketTemplateCreationSection,
    insertWeightedTicketCreationSection,
    overrideWeightedTicketCreationSection,
    updateWeightedTicketTemplateCreationDescription,
    updateWeightedTicketTemplateCreationName,
    updateWeightedTicketTemplateCreationSummary,
    updateWeightedTicketTemplateCreationTitle,
    WeightedNumberSectionWithControls,
    WeightedTextSectionWithControls,
} from "../../../../../../../../../redux/weightedTicketTemplateCreation";
import { composeCSS } from "../../../../../../../../../styles/composeCSS";
import mathEvaluator from "math-expression-evaluator";

export function CreateTicketTemplate() {
    const { boardId, companyId } = useAppRouterParams();

    const [isCreatingTicketTemplate, setIsCreatingTicketTemplate] = useState(
        false
    );
    const dispatch = useDispatch();
    const weightedTicketTemplate = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation;
    });
    const validAliasList = weightedTicketTemplate.sections
        .filter((section) => {
            return section.value.type === "number" && !!section.value.alias;
        })
        .map(
            (section) =>
                (section as WeightedNumberSectionWithControls).value.alias
        );

    const priorityWeightingCalculationFunction = useControl({
        value: "",
        onChange: (
            event: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
            }>
        ) => {
            return event.target.value as string;
        },
        validatorError: (stringFunction: string) => {
            const trimmedWords = stringFunction.match(/\b[a-zA-Z]+/g);

            const wordsAreValid = trimmedWords
                ? trimmedWords.every((trimmedWord) => {
                      return trimmedWord.match(/^$|^[a-zA-Z]+$/);
                  })
                : true;

            if (!wordsAreValid) {
                return "The provided aliases are not valid.";
            }

            const validAliasMapping = validAliasList.reduce<{
                [aliasName: string]: boolean;
            }>((mapping, aliasName) => {
                mapping[aliasName] = true;
                return mapping;
            }, {});

            const aliasesExist = trimmedWords
                ? trimmedWords.every((trimmedWord) => {
                      return validAliasMapping[trimmedWord];
                  })
                : true;
            if (!aliasesExist) {
                return "The provided aliases do not exist on the ticket template";
            }

            const onlyAllowedCharactersArePresent = stringFunction.match(
                /^$|^[a-zA-Z0-9\.\+\-\*\/() ]+$/
            );
            if (!onlyAllowedCharactersArePresent) {
                return "Only simple math values are allowed (parenthesis, decimals, +, -, /, *)";
            }

            try {
                let expressionToEvaluate = stringFunction;
                Object.keys(validAliasMapping).forEach((key) => {
                    expressionToEvaluate = expressionToEvaluate.replaceAll(
                        key,
                        "1"
                    );
                });
                mathEvaluator.eval(expressionToEvaluate);
            } catch (e) {
                return "There is an error with the calculation setup";
            }

            return "";
        },
    });

    const allControlsAreValid = useSelector((store: IStoreState) => {
        const {
            name,
            description,
            title,
            summary,
            sections,
        } = store.weightedTicketTemplateCreation;

        const nameIsValid = !name.error;
        const descriptionIsValid = !description.error;
        const titleIsValid = !title.error;
        const summaryIsValid = !summary.error;
        const sectionsAreValid = sections.every((section) => {
            if (section.value.type === "text") {
                const textSectionWithControls = section as WeightedTextSectionWithControls;
                return !textSectionWithControls.error;
            } else if (section.value.type === "number") {
                const numberSectionWithControls = section as WeightedNumberSectionWithControls;
                return (
                    !numberSectionWithControls.labelError &&
                    !numberSectionWithControls.minError &&
                    !numberSectionWithControls.maxError
                );
            }
        });

        return (
            nameIsValid &&
            descriptionIsValid &&
            titleIsValid &&
            summaryIsValid &&
            sectionsAreValid
        );
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
                    allowOnlyIntegers: false,
                    alias: "",
                };
                const action = insertWeightedTicketCreationSection({
                    value: weightedNumberSection,
                    index,
                });
                dispatch(action);
            }
        };
    }

    function onClickDelete(index: number) {
        return () => {
            const action = deleteWeightedTicketTemplateCreationSection(index);
            dispatch(action);
        };
    }

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
            disabled: isCreatingTicketTemplate || !allControlsAreValid,
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
                ...(weightedTicketTemplate.sections[index]
                    .value as IWeightedTextSection),
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
                ...(weightedTicketTemplate.sections[index]
                    .value as IWeightedTextSection),
                multiline: checked,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedTextSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeRequiredValue(index: number) {
        return (checked: boolean) => {
            const updatedWeightedTextSection: IWeightedTextSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as IWeightedTextSection),
                required: checked,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedTextSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeNumberLabelText(index: number) {
        return (
            eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const value = eventType.target.value as string;
            const updatedWeightedNumberSection: IWeightedNumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as IWeightedNumberSection),
                label: value,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeMinValue(index: number) {
        return (
            eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const value = eventType.target.value as string;
            const minValue = value !== "" ? Number(value) : undefined;
            const updatedWeightedNumberSection: IWeightedNumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as IWeightedNumberSection),
                minValue,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeMaxValue(index: number) {
        return (
            eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const value = eventType.target.value as string;
            const maxValue = value !== "" ? Number(value) : undefined;
            const updatedWeightedNumberSection: IWeightedNumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as IWeightedNumberSection),
                maxValue,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeAllowOnlyIntegers(index: number) {
        return (checked: boolean) => {
            const updatedWeightedNumberSection: IWeightedNumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as IWeightedNumberSection),
                allowOnlyIntegers: checked,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeNumberRequiredValue(index: number) {
        return (checked: boolean) => {
            const updatedWeightedNumberSection: IWeightedNumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as IWeightedNumberSection),
                required: checked,
                alias: "",
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeAlias(index: number) {
        return (
            eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const value = eventType.target.value as string;
            const updatedWeightedNumberSection: IWeightedNumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as IWeightedNumberSection),
                alias: value,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
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
                                    if (section.value.type === "text") {
                                        const weightedTextSectionWithControls = section as WeightedTextSectionWithControls;
                                        return (
                                            <div
                                                css={composeCSS(
                                                    classes.columnInputContainer,
                                                    classes.sectionControlContainer
                                                )}
                                                key={index}
                                            >
                                                <div>
                                                    <WeightedTicketTemplateTextControl
                                                        label={
                                                            section.value.label
                                                        }
                                                        multiline={
                                                            section.value
                                                                .multiline
                                                        }
                                                        disabled={
                                                            isCreatingTicketTemplate
                                                        }
                                                        error={
                                                            weightedTextSectionWithControls.error
                                                        }
                                                        touched={true}
                                                        required={
                                                            section.value
                                                                .required
                                                        }
                                                        onChangeLabelText={onChangeLabelText(
                                                            index
                                                        )}
                                                        onChangeMultilineValue={onChangeMultilineValue(
                                                            index
                                                        )}
                                                        onChangeRequiredValue={onChangeRequiredValue(
                                                            index
                                                        )}
                                                    />
                                                </div>
                                                <div
                                                    css={
                                                        classes.actionButtonContainerForTextField
                                                    }
                                                >
                                                    <WeightedPriorityTicketTemplateActions
                                                        disabled={
                                                            isCreatingTicketTemplate
                                                        }
                                                        onClickAddAfter={onClickAddAfter(
                                                            index
                                                        )}
                                                        onClickDelete={onClickDelete(
                                                            index
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    } else if (
                                        section.value.type === "number"
                                    ) {
                                        const weightedNumberSectionWithControls = section as WeightedNumberSectionWithControls;
                                        return (
                                            <div
                                                css={composeCSS(
                                                    classes.columnInputContainer,
                                                    classes.sectionControlContainer
                                                )}
                                                key={index}
                                            >
                                                <div>
                                                    <WeightedTicketTemplateNumberControl
                                                        alias={
                                                            section.value.alias
                                                        }
                                                        aliasError={
                                                            weightedNumberSectionWithControls.aliasError
                                                        }
                                                        onChangeAlias={onChangeAlias(
                                                            index
                                                        )}
                                                        label={
                                                            section.value.label
                                                        }
                                                        labelError={
                                                            weightedNumberSectionWithControls.labelError
                                                        }
                                                        allowOnlyIntegers={
                                                            section.value
                                                                .allowOnlyIntegers
                                                        }
                                                        disabled={
                                                            isCreatingTicketTemplate
                                                        }
                                                        required={
                                                            section.value
                                                                .required
                                                        }
                                                        onChangeLabelText={onChangeNumberLabelText(
                                                            index
                                                        )}
                                                        onChangeMinValue={onChangeMinValue(
                                                            index
                                                        )}
                                                        onChangeMaxValue={onChangeMaxValue(
                                                            index
                                                        )}
                                                        onChangeAllowOnlyIntegers={onChangeAllowOnlyIntegers(
                                                            index
                                                        )}
                                                        onChangeRequiredValue={onChangeNumberRequiredValue(
                                                            index
                                                        )}
                                                        minValue={
                                                            section.value
                                                                .minValue
                                                        }
                                                        minError={
                                                            weightedNumberSectionWithControls.minError
                                                        }
                                                        maxValue={
                                                            section.value
                                                                .maxValue
                                                        }
                                                        maxError={
                                                            weightedNumberSectionWithControls.maxError
                                                        }
                                                    />
                                                </div>
                                                <div
                                                    css={
                                                        classes.actionButtonContainerForTextField
                                                    }
                                                >
                                                    <WeightedPriorityTicketTemplateActions
                                                        disabled={
                                                            isCreatingTicketTemplate
                                                        }
                                                        onClickAddAfter={onClickAddAfter(
                                                            index
                                                        )}
                                                        onClickDelete={onClickDelete(
                                                            index
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }
                                }
                            )}
                        </div>
                        <div css={classes.priorityWeightAndPreviewContainer}>
                            <div>
                                <div css={classes.validAliasContainer}>
                                    {validAliasList.map((aliasName) => {
                                        return (
                                            <div
                                                css={
                                                    classes.individualChipContainer
                                                }
                                            >
                                                <TagChip
                                                    size="small"
                                                    tagName={aliasName}
                                                    tagColor={"gray"}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <WrappedTextField
                                    value={
                                        priorityWeightingCalculationFunction.value
                                    }
                                    label="Priority Weighting Calculation"
                                    onChange={
                                        priorityWeightingCalculationFunction.onChange
                                    }
                                    error={
                                        priorityWeightingCalculationFunction.isTouched &&
                                        !priorityWeightingCalculationFunction.isValid
                                            ? priorityWeightingCalculationFunction.errorMessage
                                            : ""
                                    }
                                    disabled={isCreatingTicketTemplate}
                                />
                            </div>
                            <div>world</div>
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
        padding: 32px;
        overflow-y: auto;
        padding-right: 16px;
    `;

    const bottomToolbarContainer = css`
        flex: 0 0 auto;
    `;

    const columnInputContainer = css`
        display: grid;
        grid-template-columns: 1fr 96px;
        grid-gap: 16px;
    `;

    const sectionControlContainer = css`
        margin-top: 16px;
    `;

    const actionButtonContainerForTextField = css`
        height: 100%;
        display: flex;
        align-items: center;
    `;

    const priorityWeightAndPreviewContainer = css`
        flex-grow: 1;
        display: grid;
        grid-template-rows: auto 1fr;
        grid-gap: 16px;
        padding: 32px;
        padding-left: 16px;
    `;

    const individualChipContainer = css`
        margin-right: 4px;
        margin-bottom: 4px;
        display: inline-flex;
    `;

    const validAliasContainer = css`
        padding-bottom: 8px;
    `;

    return {
        container,
        gridContentContainer,
        formBuilderContainer,
        bottomToolbarContainer,
        flexContentContainer,
        columnInputContainer,
        sectionControlContainer,
        actionButtonContainerForTextField,
        priorityWeightAndPreviewContainer,
        individualChipContainer,
        validAliasContainer,
    };
};
