/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INumberSection } from "../../models/ticketTemplate/section/numberSection";
import { ITextSection } from "../../models/ticketTemplate/section/textSection";
import { IStoreState } from "../../redux/storeState";
import {
    WeightedTextSectionWithControls,
    WeightedNumberSectionWithControls,
    overrideWeightedTicketCreationSection,
    deleteWeightedTicketTemplateCreationSection,
    insertWeightedTicketCreationSection,
    updateWeightedTicketTemplateCreationDescription,
    updateWeightedTicketTemplateCreationName,
    updateWeightedTicketTemplateCreationSummary,
    updateWeightedTicketTemplateCreationTitle,
} from "../../redux/weightedTicketTemplateCreation";
import { composeCSS } from "../../styles/composeCSS";
import { WeightedPriorityTicketTemplateActions } from "../weightedPriorityTicketTemplateActions";
import { WeightedTicketTemplateNumberControl } from "../weightedTicketTemplateNumberControl";
import { WeightedTicketTemplateTextControl } from "../weightedTicketTemplateTextControl";
import { WrappedTextField } from "../wrappedTextField";
import { Theme, useTheme } from "@material-ui/core";

export interface ITicketTemplateFieldsContainerProps {
    disabled: boolean;
}

export function TicketTemplateFieldsContainer(
    props: ITicketTemplateFieldsContainerProps
) {
    const dispatch = useDispatch();
    const weightedTicketTemplate = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation;
    });

    function onClickAddAfter(index: number) {
        return (type: string) => {
            if (type === "text") {
                const weightedTextSection: ITextSection = {
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
                const weightedNumberSection: INumberSection = {
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
            const updatedWeightedTextSection: ITextSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as ITextSection),
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
            const updatedWeightedTextSection: ITextSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as ITextSection),
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
            const updatedWeightedTextSection: ITextSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as ITextSection),
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
            const updatedWeightedNumberSection: INumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as INumberSection),
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
            const updatedWeightedNumberSection: INumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as INumberSection),
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
            const updatedWeightedNumberSection: INumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as INumberSection),
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
            const updatedWeightedNumberSection: INumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as INumberSection),
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
            const updatedWeightedNumberSection: INumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as INumberSection),
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
            const updatedWeightedNumberSection: INumberSection = {
                ...(weightedTicketTemplate.sections[index]
                    .value as INumberSection),
                alias: value,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    const theme = useTheme();
    const classes = createClasses(theme);

    return (
        <div css={classes.formBuilderContainer}>
            <div css={classes.columnInputContainer}>
                <div>
                    <WrappedTextField
                        value={weightedTicketTemplate.name.value}
                        label="Template Name"
                        required
                        onChange={onChangeTicketTemplateName}
                        error={
                            (weightedTicketTemplate.name.touched &&
                                weightedTicketTemplate.name.error) ||
                            ""
                        }
                        disabled={props.disabled}
                    />
                </div>
                <div />
            </div>
            <div css={classes.columnInputContainer}>
                <div>
                    <WrappedTextField
                        value={weightedTicketTemplate.description.value}
                        label="Template Description"
                        onChange={onChangeTicketTemplateDescription}
                        error={
                            (weightedTicketTemplate.description.touched &&
                                weightedTicketTemplate.description.error) ||
                            ""
                        }
                        disabled={props.disabled}
                        multiline
                        required
                    />
                </div>
                <div />
            </div>
            <div css={classes.columnInputContainer}>
                <div>
                    <WrappedTextField
                        value={weightedTicketTemplate.title.value}
                        label="Ticket Title Label"
                        onChange={onChangeTicketTemplateTitle}
                        error={
                            (weightedTicketTemplate.title.touched &&
                                weightedTicketTemplate.title.error) ||
                            ""
                        }
                        disabled={props.disabled}
                        required
                    />
                </div>
                <div />
            </div>
            <div css={classes.columnInputContainer}>
                <div>
                    <WrappedTextField
                        value={weightedTicketTemplate.summary.value}
                        label="Ticket Summary Label"
                        onChange={onChangeTicketTemplateSummary}
                        error={
                            (weightedTicketTemplate.summary.touched &&
                                weightedTicketTemplate.summary.error) ||
                            ""
                        }
                        disabled={props.disabled}
                        required
                    />
                </div>
                <div>
                    <WeightedPriorityTicketTemplateActions
                        disabled={props.disabled}
                        onClickAddAfter={onClickAddAfter(-1)}
                    />
                </div>
            </div>
            {weightedTicketTemplate.sections.map((section, index) => {
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
                                    label={section.value.label}
                                    multiline={section.value.multiline}
                                    disabled={props.disabled}
                                    error={
                                        weightedTextSectionWithControls.error
                                    }
                                    touched={true}
                                    required={section.value.required}
                                    onChangeLabelText={onChangeLabelText(index)}
                                    onChangeMultilineValue={onChangeMultilineValue(
                                        index
                                    )}
                                    onChangeRequiredValue={onChangeRequiredValue(
                                        index
                                    )}
                                />
                            </div>
                            <div
                                css={classes.actionButtonContainerForTextField}
                            >
                                <WeightedPriorityTicketTemplateActions
                                    disabled={props.disabled}
                                    onClickAddAfter={onClickAddAfter(index)}
                                    onClickDelete={onClickDelete(index)}
                                />
                            </div>
                        </div>
                    );
                } else if (section.value.type === "number") {
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
                                    alias={section.value.alias}
                                    aliasError={
                                        weightedNumberSectionWithControls.aliasError
                                    }
                                    onChangeAlias={onChangeAlias(index)}
                                    label={section.value.label}
                                    labelError={
                                        weightedNumberSectionWithControls.labelError
                                    }
                                    allowOnlyIntegers={
                                        section.value.allowOnlyIntegers
                                    }
                                    disabled={props.disabled}
                                    required={section.value.required}
                                    onChangeLabelText={onChangeNumberLabelText(
                                        index
                                    )}
                                    onChangeMinValue={onChangeMinValue(index)}
                                    onChangeMaxValue={onChangeMaxValue(index)}
                                    onChangeAllowOnlyIntegers={onChangeAllowOnlyIntegers(
                                        index
                                    )}
                                    onChangeRequiredValue={onChangeNumberRequiredValue(
                                        index
                                    )}
                                    minValue={section.value.minValue}
                                    minError={
                                        weightedNumberSectionWithControls.minError
                                    }
                                    maxValue={section.value.maxValue}
                                    maxError={
                                        weightedNumberSectionWithControls.maxError
                                    }
                                />
                            </div>
                            <div
                                css={classes.actionButtonContainerForTextField}
                            >
                                <WeightedPriorityTicketTemplateActions
                                    disabled={props.disabled}
                                    onClickAddAfter={onClickAddAfter(index)}
                                    onClickDelete={onClickDelete(index)}
                                />
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
}

const createClasses = (theme: Theme) => {
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

    const ticketPreviewContainer = css`
        display: grid;
        grid-template-rows: auto 1fr;
    `;

    const ticketPreviewHeaderContainer = css`
        display: flex;
        justify-content: space-between;
        background-color: ${theme.palette.grey["200"]};
        padding: 16px;
    `;

    return {
        ticketPreviewHeaderContainer,
        ticketPreviewContainer,
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
