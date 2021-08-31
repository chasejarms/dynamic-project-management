/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { Api } from "../../../../../../api";
import { CenterLoadingSpinner } from "../../../../../../components/centerLoadingSpinner";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { useIsCheckingForBoardAccess } from "../../../../../../hooks/useIsCheckingForBoardAccess";
import { BoardPriorityType } from "../../../../../../models/boardPriorityType";
import { addBoardAction } from "../../../../../../redux/boards";
import { IStoreState } from "../../../../../../redux/storeState";
import { createCompanyBoardKey } from "../../../../../../utils/createCompanyBoardKey";

export function BoardRouter() {
    const { companyId, boardId } = useAppRouterParams();
    console.log("companyId: ", companyId);
    console.log("boardId: ", boardId);
    const location = useLocation();
    const history = useHistory();
    const isCheckingForBoardAccess = useIsCheckingForBoardAccess();

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
    }, [isCheckingForBoardAccess]);

    useEffect(() => {
        if (!board) return;

        const isWeightedBoard =
            board.priorityType === BoardPriorityType.Weighted;
        const replacementRoute = isWeightedBoard
            ? "weighted-board"
            : "tags-board";

        const updatedRoute = location.pathname.replace(
            "board-router",
            replacementRoute
        );
        history.push(updatedRoute);
    }, [board]);

    const classes = createClasses();
    return isCheckingForBoardAccess || isLoadingBoard ? (
        <div css={classes.centerLoadingSpinner}>
            <CenterLoadingSpinner size="large" />
        </div>
    ) : null;
}

const createClasses = () => {
    const centerLoadingSpinner = css`
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    return {
        centerLoadingSpinner,
    };
};
