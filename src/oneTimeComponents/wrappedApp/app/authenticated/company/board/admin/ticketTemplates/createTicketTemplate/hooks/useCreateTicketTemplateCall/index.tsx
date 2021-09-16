import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "../../../../../../../../../../../api";
import { IStoreState } from "../../../../../../../../../../../redux/storeState";
import {
    createTicketTemplateId,
    resetWeightedTicketTemplateCreationState,
} from "../../../../../../../../../../../redux/ticketTemplates";
import { useAppRouterParams } from "../../../../../../../../../../../hooks/useAppRouterParams";

export function useCreateTicketTemplateCall() {
    const { boardId, companyId } = useAppRouterParams();

    const [isCreatingTicketTemplate, setIsCreatingTicketTemplate] = useState(
        false
    );

    const weightedTicketTemplate = useSelector(
        (state: IStoreState) => {
            return state.weightedTicketTemplateCreation[createTicketTemplateId];
        },
        () => {
            return !isCreatingTicketTemplate;
        }
    );

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    function closeSuccessSnackbar() {
        setShowSuccessSnackbar(false);
    }

    const dispatch = useDispatch();
    useEffect(() => {
        if (!isCreatingTicketTemplate) return;
        let didCancel = false;

        Api.ticketTemplates
            .createTicketTemplateForBoard(companyId, boardId, {
                name: weightedTicketTemplate.name.value,
                description: weightedTicketTemplate.description.value,
                title: {
                    label: weightedTicketTemplate.title.value,
                },
                summary: {
                    label: weightedTicketTemplate.summary.value,
                },
                sections: weightedTicketTemplate.sections.map((section) => {
                    return section.value;
                }),
                priorityWeightingCalculation:
                    weightedTicketTemplate.priorityWeightingCalculation.value,
            })
            .then(() => {
                if (didCancel) return;
                const action = resetWeightedTicketTemplateCreationState();
                dispatch(action);
                setShowSuccessSnackbar(true);
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsCreatingTicketTemplate(false);
            });
    }, [isCreatingTicketTemplate, companyId, boardId]);

    function onClickCreateTicketTemplate() {
        setIsCreatingTicketTemplate(true);
    }

    return {
        isCreatingTicketTemplate,
        onClickCreateTicketTemplate,
        showSuccessSnackbar,
        closeSuccessSnackbar,
    };
}
