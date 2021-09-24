import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../../redux/storeState";
import {
    ITicketTemplateTextSectionControlState,
    ITicketTemplateNumberSectionControlState,
    createTicketTemplateId,
    setWeightedTicketTemplateCreationFromExistingTicketTemplate,
} from "../../../../../../../../../../redux/ticketTemplates";
import { BottomPageToolbar } from "../../../../../components/bottomPageToolbar";
import { IWrappedButtonProps } from "../../../../../../../components/wrappedButton";
import { useHistory } from "react-router-dom";
import { RouteCreator } from "../../../../../../../utils/routeCreator";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";

export interface ITicketTemplateBottomToolbarProps {
    onClickActionButton: () => void;
    actionButtonText: string;
    showActionButtonSpinner: boolean;
    ticketTemplateId: string;
}

export function TicketTemplateBottomToolbar(
    props: ITicketTemplateBottomToolbarProps
) {
    const { companyId, boardId } = useAppRouterParams();
    const history = useHistory();
    const allControlsAreValid = useSelector((store: IStoreState) => {
        const {
            name,
            description,
            title,
            summary,
            sections,
            priorityWeightingCalculation,
        } = store.weightedTicketTemplateCreation[props.ticketTemplateId];

        const nameIsValid = !name.error;
        const descriptionIsValid = !description.error;
        const titleIsValid = !title.error;
        const summaryIsValid = !summary.error;
        const sectionsAreValid = sections.every((section) => {
            if (section.value.type === "text") {
                const textSectionWithControls = section as ITicketTemplateTextSectionControlState;
                return !textSectionWithControls.error;
            } else if (section.value.type === "number") {
                const numberSectionWithControls = section as ITicketTemplateNumberSectionControlState;
                return (
                    !numberSectionWithControls.labelError &&
                    !numberSectionWithControls.minError &&
                    !numberSectionWithControls.maxError
                );
            }
        });
        const priorityWeightingCalculationIsValid = !priorityWeightingCalculation.error;

        return (
            nameIsValid &&
            descriptionIsValid &&
            titleIsValid &&
            summaryIsValid &&
            sectionsAreValid &&
            priorityWeightingCalculationIsValid
        );
    });

    const dispatch = useDispatch();
    const leftWrappedButtonProps: IWrappedButtonProps[] =
        props.ticketTemplateId !== createTicketTemplateId
            ? [
                  {
                      variant: "text",
                      onClick: () => {
                          const action = setWeightedTicketTemplateCreationFromExistingTicketTemplate(
                              {
                                  ticketTemplateId: props.ticketTemplateId,
                              }
                          );
                          dispatch(action);
                          const route = RouteCreator.createTicketTemplate(
                              companyId,
                              boardId,
                              true
                          );
                          history.push(route);
                      },
                      color: "primary",
                      disabled:
                          props.showActionButtonSpinner || !allControlsAreValid,
                      children: "Copy Template",
                  },
              ]
            : [];

    const rightWrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: () => {
                props.onClickActionButton();
            },
            color: "primary",
            disabled: props.showActionButtonSpinner || !allControlsAreValid,
            showSpinner: props.showActionButtonSpinner,
            children: props.actionButtonText,
        },
    ];

    return (
        <BottomPageToolbar
            leftWrappedButtonProps={leftWrappedButtonProps}
            rightWrappedButtonProps={rightWrappedButtonProps}
        />
    );
}
