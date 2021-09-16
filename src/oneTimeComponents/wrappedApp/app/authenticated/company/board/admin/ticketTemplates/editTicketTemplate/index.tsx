/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Snackbar } from "@material-ui/core";
import { BoardAdminContainer } from "../../components/boardAdminContainer";
import { CenterLoadingSpinner } from "../../../../../components/centerLoadingSpinner";
import { TicketTemplate } from "../components/ticketTemplate";
import { useEditTicketTemplateEndpoints } from "../../../../../../../../../hooks/useEditTicketTemplateEndpoints";

export function EditTicketTemplate() {
    const {
        isLoadingTicketTemplate,
        ticketTemplateId,
        showSuccessSnackbar,
        closeSuccessSnackbar,
        onClickUpdateTicketTemplate,
        isUpdatingTicketTemplate,
    } = useEditTicketTemplateEndpoints();

    const classes = createClasses();

    return (
        <BoardAdminContainer>
            {isLoadingTicketTemplate ? (
                <div css={classes.centerContainer}>
                    <CenterLoadingSpinner size="large" />
                </div>
            ) : (
                <TicketTemplate
                    onClickActionButton={onClickUpdateTicketTemplate}
                    actionButtonText="Update Priority Calculation"
                    actionInProgress={isUpdatingTicketTemplate}
                    ticketTemplateId={ticketTemplateId}
                    fieldsAreDisabled={true}
                />
            )}
            <Snackbar
                open={showSuccessSnackbar}
                onClose={closeSuccessSnackbar}
                message={"Success! The priority calculation was updated."}
            />
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
