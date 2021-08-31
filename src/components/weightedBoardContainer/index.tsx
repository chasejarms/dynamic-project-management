/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useEffect } from "react";
import { useAppRouterParams } from "../../hooks/useAppRouterParams";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../authenticatedPageContainer";
import { useSelector, useDispatch } from "react-redux";
import { IStoreState } from "../../redux/storeState";
import { addBoardAction } from "../../redux/boards";
import { Api } from "../../api";
import { CenterLoadingSpinner } from "../centerLoadingSpinner";
import { createCompanyBoardKey } from "../../utils/createCompanyBoardKey";
import { Typography } from "@material-ui/core";
import { useIsBoardAdmin } from "../../hooks/useIsBoardAdmin";

export interface IWeightedBoardContainerProps {
    children: React.ReactNode;
}

export function WeightedBoardContainer(props: IWeightedBoardContainerProps) {
    const { companyId, boardId } = useAppRouterParams();

    const board = useSelector((state: IStoreState) => {
        const boardItemId = createCompanyBoardKey(companyId, boardId);
        return state.boards[boardItemId];
    });
    const isLoadingBoard = !board;
    const dispatch = useDispatch();
    useEffect(() => {
        if (!isLoadingBoard) return;

        let didCancel = false;

        Api.board
            .getBoardForCompany(companyId, boardId)
            .then((board) => {
                if (didCancel) return;
                dispatch(addBoardAction(board));
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
            });

        return () => {
            didCancel = true;
        };
    }, [isLoadingBoard]);

    const hasBeenDeleted = !!board?.hasBeenDeleted;

    const isBoardAdmin = useIsBoardAdmin();

    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Board",
            route: `/app/company/${companyId}/weighted-board/${boardId}/tickets`,
        },
        {
            text: "Create Ticket",
            route: `/app/company/${companyId}/weighted-board/${boardId}/create-ticket`,
        },
        {
            text: "Backlog Tickets",
            route: `/app/company/${companyId}/weighted-board/${boardId}/backlog-tickets`,
        },
        {
            text: "Completed Tickets",
            route: `/app/company/${companyId}/weighted-board/${boardId}/completed-tickets`,
        },
        isBoardAdmin && {
            text: "Admin",
            route: `/app/company/${companyId}/weighted-board/${boardId}/admin/board-users`,
        },
    ].filter((tabValue) => !!tabValue) as IAuthenticatedNavItem[];

    const classes = createClasses();

    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {isLoadingBoard ? (
                <CenterLoadingSpinner size="large" />
            ) : hasBeenDeleted ? (
                <div css={classes.centerTextContainer}>
                    <Typography variant="h6">
                        This board has been deleted
                    </Typography>
                </div>
            ) : (
                props.children
            )}
        </AuthenticatedPageContainer>
    );
}

const createClasses = () => {
    const centerTextContainer = css`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    return {
        centerTextContainer,
    };
};
