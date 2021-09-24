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
import { RouteCreator } from "../../../utils/routeCreator";
import { Box } from "@mui/material";

export function CreateBoard() {
    const history = useHistory();
    const { companyId } = useAppRouterParams();

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
        const route = RouteCreator.inProgressTickets(companyId, boardId);
        history.push(route);
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

    const rightWrappedButtonProps: IWrappedButtonProps[] = [
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
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <Box
                            sx={{
                                width: "300px",
                            }}
                        >
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
                        </Box>
                        <Box
                            sx={{
                                width: "300px",
                            }}
                        >
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
                        </Box>
                    </div>
                </Box>
                <BottomPageToolbar
                    rightWrappedButtonProps={rightWrappedButtonProps}
                />
            </Box>
        </BoardsContainer>
    );
}
