import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "../../api";
import { IStoreState } from "../../redux/storeState";
import { setWeightedTicketTemplate } from "../../redux/ticketTemplates";
import { useAppRouterParams } from "../useAppRouterParams";

export function useEditTicketTemplateEndpoints() {
    const { boardId, companyId, ticketTemplateId } = useAppRouterParams();
    const [isLoadingTicketTemplate, setIsLoadingTicketTemplate] = useState(
        true
    );

    const dispatch = useDispatch();
    useEffect(() => {
        let didCancel = false;

        if (!isLoadingTicketTemplate) return;

        Api.ticketTemplates
            .getTicketTemplateForBoard(companyId, boardId, ticketTemplateId)
            .then((ticketTemplateFromDatabase) => {
                if (didCancel) return;
                const action = setWeightedTicketTemplate({
                    ticketTemplate: ticketTemplateFromDatabase,
                    ticketTemplateId,
                });
                dispatch(action);
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingTicketTemplate(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isLoadingTicketTemplate]);

    const [isUpdatingTicketTemplate, setIsUpdatingTicketTemplate] = useState(
        false
    );

    function onClickUpdateTicketTemplate() {
        setIsUpdatingTicketTemplate(true);
    }

    const weightedTicketTemplate = useSelector(
        (state: IStoreState) => {
            return state.weightedTicketTemplateCreation[ticketTemplateId];
        },
        () => {
            return !isUpdatingTicketTemplate;
        }
    );

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    function closeSuccessSnackbar() {
        setShowSuccessSnackbar(false);
    }

    useEffect(() => {
        if (!isUpdatingTicketTemplate) return;

        let didCancel = false;

        Api.ticketTemplates
            .updateTicketTemplateForBoard(
                companyId,
                boardId,
                ticketTemplateId,
                {
                    priorityWeightingCalculation:
                        weightedTicketTemplate.priorityWeightingCalculation
                            .value,
                }
            )
            .then(() => {
                if (didCancel) return;
                setShowSuccessSnackbar(true);
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsUpdatingTicketTemplate(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isUpdatingTicketTemplate]);

    return {
        isLoadingTicketTemplate,
        ticketTemplateId,
        showSuccessSnackbar,
        closeSuccessSnackbar,
        onClickUpdateTicketTemplate,
        isUpdatingTicketTemplate,
    };
}
