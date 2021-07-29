/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { cloneDeep, isEqual } from "lodash";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Api } from "../../../../../../../../api";
import { ControlValidator } from "../../../../../../../../classes/ControlValidator";
import { BoardContainer } from "../../../../../../../../components/boardContainer";
import { BottomPageToolbar } from "../../../../../../../../components/bottomPageToolbar";
import { IWrappedButtonProps } from "../../../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../../../components/wrappedTextField";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { ITextSection } from "../../../../../../../../models/ticketTemplate/textSection";
import { ITicketTemplatePutRequest } from "../../../../../../../../models/ticketTemplate/ticketTemplatePutRequest";

const defaultTicketTemplate: ITicketTemplatePutRequest = {
    name: "Default Name",
    description: "Default Description",
    title: {
        label: "Title",
    },
    summary: {
        isRequired: true,
        label: "Summary",
    },
    sections: [],
};

interface IControl {
    errorMessage: string;
    isDirty: boolean;
    showError: boolean;
}

export function CreateTicketTemplate() {
    const { boardId, companyId } = useAppRouterParams();

    const [
        { committedTicketTemplate, stagedTicketTemplate },
        setCommittedAndStagedTicketTemplate,
    ] = useState<{
        committedTicketTemplate: ITicketTemplatePutRequest;
        stagedTicketTemplate: ITicketTemplatePutRequest;
    }>({
        committedTicketTemplate: cloneDeep(defaultTicketTemplate),
        stagedTicketTemplate: cloneDeep(defaultTicketTemplate),
    });

    function onSuccessfulSaveTicketTemplate() {
        setCommittedAndStagedTicketTemplate({
            committedTicketTemplate: cloneDeep(defaultTicketTemplate),
            stagedTicketTemplate: cloneDeep(defaultTicketTemplate),
        });
    }

    function setStagedTicketTemplate(
        previousStagedTicketTemplateCallback: (
            previousStagedTicketTemplate: ITicketTemplatePutRequest
        ) => ITicketTemplatePutRequest
    ) {
        setCommittedAndStagedTicketTemplate(
            (previousCommittedAndStagedTicketTemplate) => {
                return {
                    committedTicketTemplate:
                        previousCommittedAndStagedTicketTemplate.committedTicketTemplate,
                    stagedTicketTemplate: previousStagedTicketTemplateCallback(
                        previousCommittedAndStagedTicketTemplate.stagedTicketTemplate
                    ),
                };
            }
        );
    }

    function onClickAddAfter(index: number) {
        const textSection: ITextSection = {
            label: "Section Title",
            multiline: false,
            type: "text",
        };

        setStagedTicketTemplate((previousStagedTicketTemplate) => {
            const previousSections = previousStagedTicketTemplate.sections;
            if (index === -1) {
                return {
                    ...previousStagedTicketTemplate,
                    sections: [textSection, ...previousSections],
                };
            } else {
                const beforeIndex = previousSections.slice(0, index);
                const afterIndex = previousSections.slice(index);

                return {
                    ...previousStagedTicketTemplate,
                    sections: [...beforeIndex, textSection, ...afterIndex],
                };
            }
        });
    }

    const nameControl: IControl = useMemo(() => {
        const isDirty = !isEqual(
            stagedTicketTemplate.name,
            committedTicketTemplate.name
        );

        const errorMessage = ControlValidator.string()
            .required("This field is required")
            .validate(stagedTicketTemplate.name);

        return {
            errorMessage,
            isDirty,
            showError: isDirty && !!errorMessage,
        };
    }, [stagedTicketTemplate.name]);
    function onNameChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setStagedTicketTemplate((previousStagedTicketTemplate) => {
            return {
                ...previousStagedTicketTemplate,
                name: event.target.value as string,
            };
        });
    }

    const descriptionControl: IControl = useMemo(() => {
        const isDirty = !isEqual(
            stagedTicketTemplate.description,
            committedTicketTemplate.description
        );

        const errorMessage = ControlValidator.string()
            .required("This field is required")
            .validate(stagedTicketTemplate.description);

        return {
            errorMessage,
            isDirty,
            showError: isDirty && !!errorMessage,
        };
    }, [stagedTicketTemplate.description]);
    function onDescriptionChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setStagedTicketTemplate((previousStagedTicketTemplate) => {
            return {
                ...previousStagedTicketTemplate,
                description: event.target.value as string,
            };
        });
    }

    const titleControl: IControl = useMemo(() => {
        const isDirty = !isEqual(
            stagedTicketTemplate.title.label,
            committedTicketTemplate.title.label
        );

        const errorMessage = ControlValidator.string()
            .required("This field is required")
            .validate(stagedTicketTemplate.title.label);

        return {
            errorMessage,
            isDirty,
            showError: isDirty && !!errorMessage,
        };
    }, [stagedTicketTemplate.title.label]);
    function onTitleChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setStagedTicketTemplate((previousStagedTicketTemplate) => {
            return {
                ...previousStagedTicketTemplate,
                title: {
                    ...previousStagedTicketTemplate.title,
                    label: event.target.value as string,
                },
            };
        });
    }

    const summaryControl: IControl = useMemo(() => {
        const isDirty = !isEqual(
            stagedTicketTemplate.summary.label,
            committedTicketTemplate.summary.label
        );

        const errorMessage = ControlValidator.string()
            .required("This field is required")
            .validate(stagedTicketTemplate.summary.label);

        return {
            errorMessage,
            isDirty,
            showError: isDirty && !!errorMessage,
        };
    }, [stagedTicketTemplate.summary.label]);
    function onSummaryChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setStagedTicketTemplate((previousStagedTicketTemplate) => {
            return {
                ...previousStagedTicketTemplate,
                summary: {
                    ...previousStagedTicketTemplate.summary,
                    label: event.target.value as string,
                },
            };
        });
    }

    const sectionControls: IControl[] = useMemo(() => {
        console.log("sections is running");

        return stagedTicketTemplate.sections.map((section) => {
            const errorMessage = ControlValidator.string()
                .required("This field is required")
                .validate(section.label);

            return {
                errorMessage,
                isDirty: false,
                showError: !!errorMessage,
            };
        });
    }, [stagedTicketTemplate.sections]);
    function onSectionChange(index: number) {
        return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setStagedTicketTemplate((previousStagedTicketTemplate) => {
                const sections = cloneDeep(
                    previousStagedTicketTemplate.sections
                );

                const updatedSection = {
                    ...sections[index],
                    label: event.target.value as string,
                };

                sections[index] = updatedSection;

                return {
                    ...previousStagedTicketTemplate,
                    sections,
                };
            });
        };
    }

    const [isCreatingTicketTemplate, setIsCreatingTicketTemplate] = useState(
        false
    );
    useEffect(() => {
        if (!isCreatingTicketTemplate) return;

        let didCancel = false;

        Api.ticketTemplates
            .createTicketTemplateForBoard(
                companyId,
                boardId,
                stagedTicketTemplate
            )
            .then((ticketTemplate) => {
                if (didCancel) return;
                onSuccessfulSaveTicketTemplate();
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsCreatingTicketTemplate(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isCreatingTicketTemplate, companyId, boardId]);

    const formIsInvalid =
        !!nameControl.errorMessage ||
        !!descriptionControl.errorMessage ||
        !!titleControl.errorMessage ||
        !!summaryControl.errorMessage;

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: () => {
                setIsCreatingTicketTemplate(true);
            },
            color: "primary",
            disabled: isCreatingTicketTemplate || formIsInvalid,
            showSpinner: isCreatingTicketTemplate,
            children: "Create Ticket Template",
        },
    ];

    const classes = createClasses();

    return (
        <BoardContainer>
            <div css={classes.container}>
                <div css={classes.innerContentContainer}>
                    <div css={classes.columnInputContainer}>
                        <WrappedTextField
                            value={stagedTicketTemplate.name}
                            label="Template Name"
                            onChange={onNameChange}
                            error={
                                nameControl.showError
                                    ? nameControl.errorMessage
                                    : ""
                            }
                            disabled={isCreatingTicketTemplate}
                        />
                    </div>
                    <div css={classes.columnInputContainer}>
                        <WrappedTextField
                            multiline
                            value={stagedTicketTemplate.description}
                            label="Template Description"
                            onChange={onDescriptionChange}
                            error={
                                descriptionControl.showError
                                    ? descriptionControl.errorMessage
                                    : ""
                            }
                            disabled={isCreatingTicketTemplate}
                        />
                    </div>
                    <div css={classes.columnInputContainer}>
                        <WrappedTextField
                            multiline
                            value={stagedTicketTemplate.title.label}
                            label="Ticket Title Label"
                            onChange={onTitleChange}
                            error={
                                titleControl.showError
                                    ? titleControl.errorMessage
                                    : ""
                            }
                            disabled={isCreatingTicketTemplate}
                        />
                    </div>
                    <div css={classes.columnInputContainer}>
                        <div css={classes.addAfterButtonContainer}>
                            <WrappedTextField
                                multiline
                                value={stagedTicketTemplate.summary.label}
                                label="Ticket Summary Label"
                                onChange={onSummaryChange}
                                error={
                                    summaryControl.showError
                                        ? summaryControl.errorMessage
                                        : ""
                                }
                                disabled={isCreatingTicketTemplate}
                            />
                            <div css={classes.addAfterInnerButtonContainer}>
                                <IconButton
                                    onClick={() => onClickAddAfter(-1)}
                                    color="primary"
                                >
                                    <Add />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    {stagedTicketTemplate.sections.map((section, index) => {
                        const sectionControl = sectionControls[index];
                        return (
                            <div css={classes.columnInputContainer} key={index}>
                                <div css={classes.addAfterButtonContainer}>
                                    <WrappedTextField
                                        multiline={section.multiline}
                                        value={section.label}
                                        label="Text Field Label"
                                        onChange={onSectionChange(index)}
                                        error={sectionControl.errorMessage}
                                        disabled={isCreatingTicketTemplate}
                                    />
                                    <div
                                        css={
                                            classes.addAfterInnerButtonContainer
                                        }
                                    >
                                        <IconButton
                                            onClick={() =>
                                                onClickAddAfter(index)
                                            }
                                            color="primary"
                                        >
                                            <Add />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div css={classes.bottomToolbarContainer}>
                    <BottomPageToolbar
                        wrappedButtonProps={wrappedButtonProps}
                    />
                </div>
            </div>
        </BoardContainer>
    );
}

const createClasses = () => {
    const container = css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    `;

    const innerContentContainer = css`
        flex-grow: 1;
        padding: 32px;
        padding-left: 64px;
        padding-right: 64px;
        overflow-y: auto;
    `;

    const innerInnerContentContainer = css`
        height: 100%;
        overflow-y: auto;
    `;

    const bottomToolbarContainer = css`
        flex: 0 0 auto;
    `;

    const columnInputContainer = css`
        width: 300px;
    `;

    const addAfterButtonContainer = css`
        position: relative;
    `;

    const addAfterInnerButtonContainer = css`
        position: absolute;
        right: -60px;
        top: 12px;
    `;

    return {
        container,
        bottomToolbarContainer,
        innerContentContainer,
        columnInputContainer,
        addAfterButtonContainer,
        addAfterInnerButtonContainer,
    };
};
