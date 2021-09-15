/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useEffect } from "react";
import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../../../../../../../../components/authenticatedPageContainer";
import { useSelector, useDispatch } from "react-redux";
import { IStoreState } from "../../../../../../../../redux/storeState";
import { addBoardAction } from "../../../../../../../../redux/boards";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../../../../../components/centerLoadingSpinner";
import { createCompanyBoardKey } from "../../../../../../../../utils/createCompanyBoardKey";
import { Typography } from "@material-ui/core";
import { useIsBoardAdmin } from "../../../../../../../../hooks/useIsBoardAdmin";

export interface IBoardContainer {
    children: React.ReactNode;
}

export function BoardContainer(props: IBoardContainer) {
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
            route: `/app/company/${companyId}/board/${boardId}/tickets`,
        },
        {
            text: "Backlog Tickets",
            route: `/app/company/${companyId}/board/${boardId}/backlog-tickets`,
        },
        {
            text: "Archived Tickets",
            route: `/app/company/${companyId}/board/${boardId}/archived-tickets`,
        },
        isBoardAdmin && {
            text: "Admin",
            route: `/app/company/${companyId}/board/${boardId}/admin/board-admins`,
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
