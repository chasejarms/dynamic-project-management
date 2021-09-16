/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useState, useEffect } from "react";
import { Api } from "../../../../../../api";
import { StringValidator } from "../../../../../../classes/StringValidator";
import { BoardsContainer } from "../components/boardsContainer";
import { IWrappedButtonProps } from "../../../components/wrappedButton";
import { WrappedTextField } from "../../../components/wrappedTextField";
import { useControl } from "../../../hooks/useControl";
import { controlsAreValid } from "../../../utils/controlsAreValid";
import { useHistory } from "react-router-dom";
import { BottomPageToolbar } from "../components/bottomPageToolbar";
import { useAppRouterParams } from "../../../hooks/useAppRouterParams";
import { setUserAsBoardAdmin } from "../../../../../../redux/appBootstrapInformation";
import { useDispatch } from "react-redux";
import { BoardPriorityType } from "../../../../../../models/boardPriorityType";

export function CreateBoard() {
    const classes = createClasses();

    const history = useHistory();
    const { companyId, boardId } = useAppRouterParams();

    const boardNameControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (boardName: string) => {
            return new StringValidator()
                .required("Board name is required")
                .max(40, "Maximum board length is 40 characters")
                .validate(boardName);
        },
    });

    const boardDescriptionControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (boardDescription: string) => {
            return new StringValidator()
                .max(90, "Maximum board description is 90 characters")
                .validate(boardDescription);
        },
    });

    const showBoardNameError =
        boardNameControl.isTouched && boardNameControl.isValid;
    const showBoardDescriptionError =
        boardDescriptionControl.isTouched && boardDescriptionControl.isValid;
    const formIsValid = controlsAreValid(
        boardNameControl,
        boardDescriptionControl
    );

    const [isCreatingBoard, setIsCreatingBoard] = useState(false);
    function createBoard() {
        setIsCreatingBoard(true);
    }

    function openBoard(boardId: string) {
        history.push(`/app/company/${companyId}/board/${boardId}/tickets`);
    }

    const dispatch = useDispatch();
    useEffect(() => {
        if (!isCreatingBoard) return;

        let didCancel = false;

        Api.board
            .createBoardForCompany(
                companyId as string,
                boardNameControl.value,
                boardDescriptionControl.value,
                BoardPriorityType.TagBased
            )
            .then((board) => {
                if (didCancel) return;
                const setUserAsBoardAdminAction = setUserAsBoardAdmin({
                    companyId,
                    boardId: board.id,
                });
                dispatch(setUserAsBoardAdminAction);
                openBoard(board.id);
            })
            .catch(() => {
                if (didCancel) return;
                // probably do something here;
            })
            .finally(() => {
                if (didCancel) return;
                setIsCreatingBoard(false);
            });

        return () => {
            didCancel = true;
        };
        // create the board
    }, [isCreatingBoard]);

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: createBoard,
            color: "primary",
            disabled: !formIsValid || isCreatingBoard,
            showSpinner: isCreatingBoard,
            children: "Create",
        },
    ];

    return (
        <BoardsContainer>
            <div css={classes.container}>
                <div css={classes.controlsContainer}>
                    <div>
                        <div css={classes.columnInputContainer}>
                            <WrappedTextField
                                value={boardNameControl.value}
                                label="Board Name"
                                onChange={boardNameControl.onChange}
                                error={
                                    showBoardNameError
                                        ? boardNameControl.errorMessage
                                        : ""
                                }
                                disabled={isCreatingBoard}
                            />
                        </div>
                        <div css={classes.columnInputContainer}>
                            <WrappedTextField
                                value={boardDescriptionControl.value}
                                label="Board Description"
                                onChange={boardDescriptionControl.onChange}
                                error={
                                    showBoardDescriptionError
                                        ? boardDescriptionControl.errorMessage
                                        : ""
                                }
                                disabled={isCreatingBoard}
                            />
                        </div>
                    </div>
                </div>
                <BottomPageToolbar wrappedButtonProps={wrappedButtonProps} />
            </div>
        </BoardsContainer>
    );
}

const createClasses = () => {
    const container = css`
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        width: 100%;
    `;

    const controlsContainer = css`
        flex-grow: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const columnInputContainer = css`
        width: 300px;
    `;

    const bottomToolbarContainer = css`
        width: 100%;
    `;

    return {
        container,
        columnInputContainer,
        controlsContainer,
        bottomToolbarContainer,
    };
};
