import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { IStoreState } from "../../../../../../../../../../../../redux/storeState";
import {
    ITicketTemplateTextSectionControlState,
    ITicketTemplateNumberSectionControlState,
    createTicketTemplateId,
    setWeightedTicketTemplateCreationFromExistingTicketTemplate,
} from "../../../../../../../../../../../../redux/ticketTemplates";
import { IWrappedButtonProps } from "../../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../../hooks/useAppRouterParams";
import { RouteCreator } from "../../../../../../../../../utils/routeCreator";

export interface ITicketTemplateBottomToolbarLogicProps {
    onClickActionButton: () => void;
    actionButtonText: string;
    showActionButtonSpinner: boolean;
    ticketTemplateId: string;
}

export function useTicketTemplateBottomToolbarLogic(
    props: ITicketTemplateBottomToolbarLogicProps
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
                const {
                    labelError,
                    minError,
                    maxError,
                    aliasError,
                } = section as ITicketTemplateNumberSectionControlState;
                return !labelError && !minError && !maxError && !aliasError;
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
                              boardId
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

    return {
        leftWrappedButtonProps,
        rightWrappedButtonProps,
    };
}
