/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../../../../../components/centerLoadingSpinner";
import { summarySectionUniqueId } from "../../../../../../../../components/summarySection";
import { TicketBottomToolbar } from "../../../../../../../../components/ticketBottomToolbar";
import { TicketFields } from "../../../../../../../../components/ticketFields";
import { TicketPageWrapper } from "../../../../../../../../components/ticketPageWrapper";
import { titleSectionUniqueId } from "../../../../../../../../components/titleSection";
import { IWrappedButtonProps } from "../../../../../../../../components/wrappedButton";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { ITicket } from "../../../../../../../../models/ticket";
import { ITicketUpdateRequest } from "../../../../../../../../models/ticketUpdateRequest";
import { IStoreState } from "../../../../../../../../redux/storeState";
import ticket, {
    setInitialTicketData,
    ticketPreviewId,
} from "../../../../../../../../redux/ticket";
import { setWeightedTicketTemplate } from "../../../../../../../../redux/ticketTemplates";
import { generateUniqueId } from "../../../../../../../../utils/generateUniqueId";

export function TicketHome() {
    const { boardId, companyId, ticketId } = useAppRouterParams();

    const [
        isLoadingTicketInformation,
        setIsLoadingTicketInformation,
    ] = useState(true);

    const ticketState = useSelector((store: IStoreState) => {
        return store.ticket[ticketId];
    });

    const dispatch = useDispatch();
    useEffect(() => {
        if (!boardId || !companyId || !ticketId) return;

        let didCancel = false;

        Promise.all([
            Api.tickets.getTicketInformationById(companyId, boardId, ticketId),
        ])
            .then(([{ ticket, ticketTemplate }]) => {
                if (didCancel) return;

                const setWeightedTicketTemplateAction = setWeightedTicketTemplate(
                    {
                        ticketTemplate,
                        ticketTemplateId: ticketTemplate.shortenedItemId,
                    }
                );
                dispatch(setWeightedTicketTemplateAction);

                const action = setInitialTicketData({
                    ticket: {
                        title: {
                            value: ticket.title,
                            touched: false,
                            error: "",
                        },
                        summary: {
                            value: ticket.summary,
                            touched: false,
                            error: "",
                        },
                        sections: ticket.sections.map((section) => {
                            return {
                                value: section,
                                touched: false,
                                error: "",
                            };
                        }),
                    },
                    ticketTemplate,
                    priorityWeightingFunction: {
                        value: ticketTemplate.priorityWeightingCalculation,
                        error: "",
                    },
                    ticketId: ticket.shortenedItemId,
                });
                dispatch(action);
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

    // const [
    //     ticketUpdateRequest,
    //     setTicketUpdateRequest,
    // ] = useState<null | ITicketUpdateRequest>(null);

    // useEffect(() => {
    //     if (!ticketUpdateRequest) return;

    //     let didCancel = false;

    //     Api.tickets
    //         .updateTicketInformation(
    //             ticket?.itemId || "",
    //             ticket?.belongsTo || "",
    //             ticketUpdateRequest
    //         )
    //         .then((updatedTicket) => {
    //             if (didCancel) return;
    //             setTicket((previousTicket) => {
    //                 return {
    //                     ...(previousTicket as ITicket),
    //                     ...ticketUpdateRequest,
    //                 };
    //             });

    //             const updatedStarterGhostControlParamsMapping: IStarterGhostControlParamsMapping = {};
    //             Object.keys(ghostControlParamsMapping).forEach((key) => {
    //                 const ghostControlParamsValue =
    //                     ghostControlParamsMapping[key];
    //                 updatedStarterGhostControlParamsMapping[key] = {
    //                     uniqueId: key,
    //                     value: ghostControlParamsValue.value,
    //                 };
    //             });
    //             setStarterGhostControlParamsMappingAndSectionOrder(
    //                 (previous) => {
    //                     return {
    //                         ...previous,
    //                         starterGhostControlParamsMapping: updatedStarterGhostControlParamsMapping,
    //                     };
    //                 }
    //             );
    //         })
    //         .catch((error) => {
    //             if (didCancel) return;
    //         })
    //         .finally(() => {
    //             if (didCancel) return;
    //             setTicketUpdateRequest(null);
    //         });

    //     return () => {
    //         didCancel = true;
    //     };
    // }, [ticketUpdateRequest]);

    // function onClickUpdate() {
    //     const title = ghostControlParamsMapping[titleSectionUniqueId].value;
    //     const summary = ghostControlParamsMapping[summarySectionUniqueId].value;
    //     const sections = sectionOrder.map((sectionId) => {
    //         const sectionValue = ghostControlParamsMapping[sectionId].value;
    //         return sectionValue;
    //     });

    //     setTicketUpdateRequest({
    //         title,
    //         summary,
    //         tags: tagsState.simplifiedTags,
    //         sections,
    //     });
    // }

    const wrappedButtonProps: IWrappedButtonProps = {
        color: "primary",
        variant: "contained",
        disabled: false, // someControlsAreInvalid || !!ticketUpdateRequest,
        showSpinner: false, // !!ticketUpdateRequest,
        onClick: () => null, // onClickUpdate,
        children: "Update Ticket",
    };

    const classes = createClasses();

    return (
        <TicketPageWrapper>
            {isLoadingTicketInformation || !ticketState ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.container}>
                    <div css={classes.ticketContentContainer}>
                        <div css={classes.ticketContentContainerInnerFields}>
                            <TicketFields
                                ticketTemplateId={
                                    ticketState.ticketTemplate.shortenedItemId
                                }
                                ticketId={ticketId}
                                isTicketPreview={false}
                                disabled={false}
                                removePadding
                            />
                        </div>
                    </div>
                    <TicketBottomToolbar
                        ticketTemplateId={
                            ticketState.ticketTemplate.shortenedItemId
                        }
                        ticketId={ticketId}
                        actionButtonText="Update Ticket"
                        onClickActionButton={() => null}
                        showActionButtonSpinner={false}
                    />
                </div>
            )}
        </TicketPageWrapper>
    );

    //     return (
    //         <TicketPageWrapper>
    //             {isLoadingTicketInformation ? (
    //                 <CenterLoadingSpinner size="large" />
    //             ) : (
    //                 <OverflowContentAndActionBar
    //                     wrappedButtonProps={wrappedButtonProps}
    //                 >
    //                     <div css={classes.container}>
    //                         <div css={classes.ticketContentContainer}>
    //                             <div css={classes.nonTagTicketInformationContainer}>
    //                                 <div css={classes.ticketSectionsContainer}>
    //                                     <TitleSection
    //                                         title={titleControl.value}
    //                                         label={
    //                                             ticket?.simplifiedTicketTemplate
    //                                                 .title.label || ""
    //                                         }
    //                                         onStateChange={onStateChange}
    //                                         refreshToken={refreshToken}
    //                                     />
    //                                     <SummarySection
    //                                         summary={summaryControl.value}
    //                                         label={
    //                                             ticket?.simplifiedTicketTemplate
    //                                                 .summary.label || ""
    //                                         }
    //                                         onStateChange={onStateChange}
    //                                         refreshToken={refreshToken}
    //                                     />
    //                                     {sectionOrder.map((sectionId, index) => {
    //                                         const section =
    //                                             starterGhostControlParamsMapping[
    //                                                 sectionId
    //                                             ];
    //                                         const ticketTemplateSection = ticket
    //                                             ?.simplifiedTicketTemplate.sections[
    //                                             index
    //                                         ]!;

    //                                         if (!ticketTemplateSection) return null;
    //                                         return (
    //                                             <TextSection
    //                                                 uniqueId={sectionId}
    //                                                 label={
    //                                                     ticketTemplateSection.label
    //                                                 }
    //                                                 multiline={false}
    //                                                 onStateChange={onStateChange}
    //                                                 refreshToken={refreshToken}
    //                                                 value={section.value}
    //                                             />
    //                                         );
    //                                     })}
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </OverflowContentAndActionBar>
    //             )}
    //         </TicketPageWrapper>
    //     );
}

const createClasses = () => {
    const container = css`
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    `;

    const ticketContentContainer = css`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 32px;
    `;

    const ticketContentContainerInnerFields = css`
        width: 400px;
    `;

    return {
        container,
        ticketContentContainer,
        ticketContentContainerInnerFields,
    };
};
