/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect, useState } from "react";
import {
    CircularProgress,
    useTheme,
    Theme,
    Typography,
} from "@material-ui/core";
import { AxiosError } from "axios";
import { Api } from "../../../../../../api";
import { IBoard } from "../../../../../../models/board";
import { BoardsContainer } from "../../../../../../components/boardsContainer";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { BoardForCompany } from "./components/boardForCompany";
import { ConfirmDialog } from "../../../../../../components/confirmDialog";
import { useCompanyUser } from "../../../../../../hooks/useCompanyUser";

export function Boards() {
    const theme = useTheme();
    const classes = createClasses(theme);
    const { companyId } = useAppRouterParams();

    const [isLoadingBoards, setIsLoadingBoards] = useState(true);
    const [boards, setBoards] = useState<IBoard[]>([]);
    const user = useCompanyUser();

    useEffect(() => {
        if (!companyId) return;
        let didCancel = false;

        Api.board
            .getBoardsForCompany(companyId)
            .then((boards) => {
                if (didCancel) return;
                setBoards(boards);
            })
            .catch((error: Error | AxiosError) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingBoards(false);
            });

        return () => {
            didCancel = true;
        };
    }, [companyId]);

    const [boardToDelete, setBoardToDelete] = useState<IBoard | null>();
    function onCloseConfirmDialog() {
        setBoardToDelete(null);
    }

    const [isDeletingBoard, setIsDeletingBoard] = useState(false);
    function onClickConfirmDeleteBoard() {
        setIsDeletingBoard(true);
    }
    function onClickDeleteBoardAction(board: IBoard) {
        return () => {
            setBoardToDelete(board);
        };
    }

    useEffect(() => {
        let didCancel = false;
        if (!boardToDelete || !isDeletingBoard) return;

        Api.board
            .deleteBoardForCompany(companyId, boardToDelete.shortenedItemId)
            .then(() => {
                if (didCancel) return;
                setBoards((previousBoards) => {
                    return previousBoards.filter((compareBoard) => {
                        return (
                            compareBoard.shortenedItemId !==
                            boardToDelete.shortenedItemId
                        );
                    });
                });
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setBoardToDelete(null);
                setIsDeletingBoard(false);
            });

        return () => {
            didCancel = true;
        };
    }, [boardToDelete, isDeletingBoard]);

    return (
        <BoardsContainer>
            {isLoadingBoards ? (
                <div css={classes.loadingPageContainer}>
                    <CircularProgress color="primary" size={48} thickness={4} />
                </div>
            ) : boards.length === 0 ? (
                <div css={classes.centerContainer}>
                    <div css={classes.noBoardsTextContainer}>
                        <Typography>
                            It looks like you don't have access to any boards
                            yet. Go ahead and create a board to get started or
                            talk with your company account administrator to get
                            added to an existing company board.
                        </Typography>
                    </div>
                </div>
            ) : (
                <div css={classes.contentContainer}>
                    {boards!.map((board) => {
                        const isBoardAdmin = !!user?.boardRights[
                            board.shortenedItemId
                        ]?.isAdmin;
                        return (
                            <BoardForCompany
                                isBoardAdmin={isBoardAdmin}
                                key={board.shortenedItemId}
                                board={board}
                                onClickDeleteBoardAction={onClickDeleteBoardAction(
                                    board
                                )}
                            />
                        );
                    })}
                </div>
            )}
            <ConfirmDialog
                open={!!boardToDelete}
                isPerformingAction={isDeletingBoard}
                onConfirm={onClickConfirmDeleteBoard}
                onClose={onCloseConfirmDialog}
                title="Delete Board"
                content={`Are you sure want to delete board ${boardToDelete?.name}?`}
                confirmButtonText="Yes"
            />
        </BoardsContainer>
    );
}

const createClasses = (theme: Theme) => {
    const loadingPageContainer = css`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const contentContainer = css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-auto-rows: min-content;
        grid-gap: ${theme.spacing() * 2}px;
        padding: ${theme.spacing() * 4}px;
        width: 100%;
    `;

    const noBoardsTextContainer = css`
        width: 400px;
    `;

    const centerContainer = css`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    return {
        loadingPageContainer,
        contentContainer,
        noBoardsTextContainer,
        centerContainer,
    };
};
