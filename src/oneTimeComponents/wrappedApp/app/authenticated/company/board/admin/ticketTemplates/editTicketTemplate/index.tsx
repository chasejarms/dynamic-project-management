/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Api } from "../../../../../../../../../api";
import { BoardAdminContainer } from "../../../../../../../../../components/boardAdminContainer";
import { CenterLoadingSpinner } from "../../../../../../../../../components/centerLoadingSpinner";
import { TicketTemplate } from "../../../../../../../../../components/ticketTemplate";
import { useAppRouterParams } from "../../../../../../../../../hooks/useAppRouterParams";
import { setWeightedTicketTemplate } from "../../../../../../../../../redux/weightedTicketTemplateCreation";

export function EditTicketTemplate() {
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

    const classes = createClasses();

    return (
        <BoardAdminContainer>
            {isLoadingTicketTemplate ? (
                <div css={classes.centerContainer}>
                    <CenterLoadingSpinner size="large" />
                </div>
            ) : (
                <TicketTemplate
                    onClickActionButton={() => null}
                    actionButtonText="Update Priority Calculation"
                    actionInProgress={false}
                    ticketTemplateId={ticketTemplateId}
                    fieldsAreDisabled={true}
                />
            )}
        </BoardAdminContainer>
    );
}

const createClasses = () => {
    const centerContainer = css`
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
    `;

    return {
        centerContainer,
    };
};
