import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { AxiosError } from "axios";
import { Api } from "../../../../../../api";
import { IBoard } from "../../../../../../models/board";
import { BoardsContainer } from "../components/boardsContainer";
import { useAppRouterParams } from "../../../hooks/useAppRouterParams";
import { BoardForCompany } from "./components/boardForCompany";
import { ConfirmDialog } from "../components/confirmDialog";
import { useCompanyUser } from "../hooks/useCompanyUser";
import { CenterLoadingSpinner } from "../../components/centerLoadingSpinner";

export function Boards() {
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
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <CenterLoadingSpinner size="large" />
                </Box>
            ) : boards.length === 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gridAutoRows: "min-content",
                        gap: 2,
                        padding: 4,
                        width: "100%",
                        height: "100%",
                        overflow: "auto",
                    }}
                >
                    <Box
                        sx={{
                            width: "400px",
                        }}
                    >
                        <Typography>
                            It looks like you don't have access to any boards
                            yet. Go ahead and create a board to get started or
                            talk with your company account administrator to get
                            added to an existing company board.
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gridAutoRows: "min-content",
                        gap: 2,
                        padding: 4,
                        width: "100%",
                    }}
                >
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
                </Box>
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
