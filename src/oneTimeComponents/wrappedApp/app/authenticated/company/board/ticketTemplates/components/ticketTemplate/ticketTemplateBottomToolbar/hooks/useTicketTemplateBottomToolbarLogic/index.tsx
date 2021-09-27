import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    createTicketTemplateId,
    setWeightedTicketTemplateCreationFromExistingTicketTemplate,
} from "../../../../../../../../../../../../redux/ticketTemplates";
import { IWrappedButtonProps } from "../../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../../hooks/useAppRouterParams";
import { RouteCreator } from "../../../../../../../../../utils/routeCreator";
import { useTicketTemplateControlsAreValid } from "./hooks/useTicketTemplateControlsAreValid";

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
    const allControlsAreValid = useTicketTemplateControlsAreValid(
        props.ticketTemplateId
    );

    const dispatch = useDispatch();
    const leftWrappedButtonProps: IWrappedButtonProps[] =
        props.ticketTemplateId !== createTicketTemplateId
            ? [
                  {
                      variant: "outlined",
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
