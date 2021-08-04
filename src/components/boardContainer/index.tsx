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

export interface IBoardContainerProps {
    children: React.ReactNode;
}

export function BoardContainer(props: IBoardContainerProps) {
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

    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Board",
            route: `/app/company/${companyId}/board/${boardId}/tickets`,
        },
        {
            text: "Create Ticket",
            route: `/app/company/${companyId}/board/${boardId}/create-ticket`,
        },
        {
            text: "Priorities",
            route: `/app/company/${companyId}/board/${boardId}/priorities`,
        },
        {
            text: "Backlog Tickets",
            route: `/app/company/${companyId}/board/${boardId}/backlog-tickets`,
        },
        {
            text: "Completed Tickets",
            route: `/app/company/${companyId}/board/${boardId}/completed-tickets`,
        },
        {
            text: "Admin",
            route: `/app/company/${companyId}/board/${boardId}/admin/board-users`,
        },
    ];

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
