import { useState, useEffect } from "react";
import { useAppRouterParams } from "../useAppRouterParams";

export function useCreateTicketTemplateCall() {
    const { boardId, companyId } = useAppRouterParams();

    const [isCreatingTicketTemplate, setIsCreatingTicketTemplate] = useState(
        false
    );

    useEffect(() => {
        if (!isCreatingTicketTemplate) return;
    }, [isCreatingTicketTemplate, companyId, boardId]);

    function onClickCreateTicketTemplate() {
        setIsCreatingTicketTemplate(true);
    }

    return {
        isCreatingTicketTemplate,
        onClickCreateTicketTemplate,
    };
}
