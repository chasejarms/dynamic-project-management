/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../../../../../components/centerLoadingSpinner";
import { Paper, Snackbar } from "@material-ui/core";
import { WrappedButton } from "../../../../../../../../components/wrappedButton";
import { ITag } from "../../../../../../../../models/tag";
import { cloneDeep } from "lodash";
import { ITicket } from "../../../../../../../../models/ticket";
import { ISimplifiedTag } from "../../../../../../../../models/simplifiedTag";
import { ITicketUpdateRequest } from "../../../../../../../../models/ticketUpdateRequest";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { useHistory } from "react-router-dom";
import { TicketPageWrapper } from "../../../../../../../../components/ticketPageWrapper";
import { TitleSection } from "../../../../../../../../components/titleSection";
import { SummarySection } from "../../../../../../../../components/summarySection";
import { TicketTags } from "../../../../../../../../components/ticketTags";

export function TicketHome() {
    const { boardId, companyId, ticketId } = useAppRouterParams();
    const history = useHistory();

    const [
        isLoadingTicketInformation,
        setIsLoadingTicketInformation,
    ] = useState(true);
    const [allTagsForBoard, setAllTagsForBoard] = useState<ITag[]>([]);
    const [ticket, setTicket] = useState<ITicket | null>(null);
    const [controlInformation, setControlInformation] = useState<{
        [id: string]: {
            value: any;
            errorMessage: string;
            isDirty: boolean;
            type?: "title" | "summary";
        };
    }>({});
    function onStateChange(
        uniqueId: string,
        value: string,
        errorMessage: string,
        isDirty: boolean,
        type?: "title" | "summary"
    ) {
        setControlInformation((previousControlInformation) => {
            const clonedControlInformation = cloneDeep(
                previousControlInformation
            );
            clonedControlInformation[uniqueId] = {
                value,
                errorMessage,
                isDirty,
                type,
            };

            return clonedControlInformation;
        });
    }
    const someControlsAreInvalid = Object.values(controlInformation).some(
        ({ errorMessage }) => !!errorMessage
    );

    const [tagsState, setTagsState] = useState<{
        simplifiedTags: ISimplifiedTag[];
        isDirty: boolean;
    }>({
        simplifiedTags: [],
        isDirty: false,
    });
    function onTagsChange(simplifiedTags: ISimplifiedTag[], isDirty: boolean) {
        setTagsState({
            simplifiedTags,
            isDirty,
        });
    }

    const someControlsAreDirty =
        Object.values(controlInformation).some(({ isDirty }) => {
            return isDirty;
        }) || tagsState.isDirty;

    useEffect(() => {
        if (!boardId || !companyId || !ticketId) return;

        let didCancel = false;

        Promise.all([
            Api.columns.getColumns(companyId, boardId),
            Api.priorities.getAllTagsForBoard(companyId, boardId),
            Api.tickets.getTicketInformationById(companyId, boardId, ticketId),
        ])
            .then(([columnsFromDatabase, tags, ticketFromDatabase]) => {
                if (didCancel) return;
                setAllTagsForBoard(tags);
                setTicket(ticketFromDatabase);
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingTicketInformation(false);
            });

        return () => {
            didCancel = true;
        };
    }, [boardId, companyId]);

    const classes = createClasses();

    const [
        ticketUpdateRequest,
        setTicketUpdateRequest,
    ] = useState<null | ITicketUpdateRequest>(null);

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    function onCloseSnackbar() {
        setShowSuccessSnackbar(false);
    }

    useEffect(() => {
        if (!ticketUpdateRequest) return;

        let didCancel = false;

        Api.tickets
            .updateTicketInformation(
                ticket?.itemId || "",
                ticket?.belongsTo || "",
                ticketUpdateRequest
            )
            .then((updatedTicket) => {
                if (didCancel) return;
                setTicket((previousTicket) => {
                    if (previousTicket === null) {
                        return null;
                    }

                    return {
                        ...previousTicket,
                        title: updatedTicket.title,
                        summary: updatedTicket.summary,
                        tags: updatedTicket.tags,
                    };
                });
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setTicketUpdateRequest(null);
            });

        return () => {
            didCancel = true;
        };
    }, [ticketUpdateRequest]);

    function navigateToBoard() {
        history.push(`/app/company/${companyId}/board/${boardId}`);
    }

    function onClickUpdate() {
        const title = Object.values(controlInformation).find((control) => {
            return control.type === "title";
        })!.value;

        const summary = Object.values(controlInformation).find((control) => {
            return control.type === "summary";
        })!.value;

        setTicketUpdateRequest({
            title,
            summary,
            tags: tagsState.simplifiedTags,
        });
    }

    return (
        <TicketPageWrapper>
            {isLoadingTicketInformation ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.container}>
                    <div css={classes.ticketContentContainer}>
                        <div css={classes.nonTagTicketInformationContainer}>
                            <div css={classes.ticketSectionsContainer}>
                                <TitleSection
                                    title={ticket?.title || ""}
                                    label={
                                        ticket?.simplifiedTicketTemplate.title
                                            .label || ""
                                    }
                                    onStateChange={onStateChange}
                                />
                                <SummarySection
                                    summary={ticket?.summary || ""}
                                    label={
                                        ticket?.simplifiedTicketTemplate.summary
                                            .label || ""
                                    }
                                    onStateChange={onStateChange}
                                />
                            </div>
                        </div>
                        <TicketTags
                            tags={ticket?.tags || []}
                            allTagsForBoard={allTagsForBoard}
                            onTagsChange={onTagsChange}
                        />
                    </div>
                    <div css={classes.ticketActionBarContainer}>
                        <Paper elevation={10}>
                            <div css={classes.ticketActionBarInnerContainer}>
                                <WrappedButton
                                    color="primary"
                                    variant="contained"
                                    disabled={
                                        someControlsAreInvalid ||
                                        !someControlsAreDirty ||
                                        !!ticketUpdateRequest
                                    }
                                    showSpinner={!!ticketUpdateRequest}
                                    onClick={onClickUpdate}
                                >
                                    Update Ticket
                                </WrappedButton>
                            </div>
                        </Paper>
                    </div>
                </div>
            )}
            <Snackbar
                open={showSuccessSnackbar}
                onClose={onCloseSnackbar}
                message={"Ticket successfully created"}
                action={
                    <WrappedButton color="secondary" onClick={navigateToBoard}>
                        Return To Board
                    </WrappedButton>
                }
            />
        </TicketPageWrapper>
    );
}

const createClasses = () => {
    const container = css`
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    `;

    const ticketContentContainer = css`
        flex-grow: 1;
        display: grid;
        padding: 32px;
        grid-gap: 32px;
        grid-template-columns: 1fr 1fr 1fr;
    `;

    const ticketActionBarContainer = css`
        flex: 0 0 auto;
    `;

    const ticketActionBarInnerContainer = css`
        display: flex;
        padding: 8px 16px;
        justify-content: flex-end;
    `;

    const nonTagTicketInformationContainer = css`
        height: 100%;
    `;

    const ticketSectionsContainer = css`
        display: flex;
        flex-direction: column;
        margin-top: 16px;
    `;

    return {
        container,
        ticketContentContainer,
        ticketActionBarContainer,
        ticketActionBarInnerContainer,
        nonTagTicketInformationContainer,
        ticketSectionsContainer,
    };
};
