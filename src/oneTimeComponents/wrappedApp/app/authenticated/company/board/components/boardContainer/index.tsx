import React, { useEffect } from "react";
import { useAppRouterParams } from "../../../../../hooks/useAppRouterParams";
import {
    AuthenticatedPageContainer,
    IAuthenticatedNavItem,
} from "../authenticatedPageContainer";
import { useSelector, useDispatch } from "react-redux";
import { IStoreState } from "../../../../../../../../redux/storeState";
import { addBoardAction } from "../../../../../../../../redux/boards";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../components/centerLoadingSpinner";
import { createCompanyBoardKey } from "../../utils/createCompanyBoardKey";
import { Box, Typography } from "@mui/material";
import { useIsBoardAdmin } from "../../hooks/useIsBoardAdmin";
import { RouteCreator } from "../../../../../utils/routeCreator";

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
            route: RouteCreator.inProgressTickets(companyId, boardId),
        },
        {
            text: "Backlog",
            route: RouteCreator.backlogTickets(companyId, boardId),
        },
        {
            text: "Archive",
            route: RouteCreator.archivedTickets(companyId, boardId),
        },
        isBoardAdmin && {
            text: "Admin",
            route: RouteCreator.boardAdmins(companyId, boardId),
        },
    ].filter((tabValue) => !!tabValue) as IAuthenticatedNavItem[];

    return (
        <AuthenticatedPageContainer navItems={navItems}>
            {isLoadingBoard ? (
                <CenterLoadingSpinner size="large" />
            ) : hasBeenDeleted ? (
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6">
                        This board has been deleted
                    </Typography>
                </Box>
            ) : (
                props.children
            )}
        </AuthenticatedPageContainer>
    );
}
