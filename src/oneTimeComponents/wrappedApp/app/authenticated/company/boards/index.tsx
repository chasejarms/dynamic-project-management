/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect, useState, ChangeEvent } from "react";
import {
    CircularProgress,
    Card,
    CardActions,
    Typography,
    CardContent,
    Button,
    useTheme,
    Theme,
    makeStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@material-ui/core";
import { AxiosError } from "axios";
import { Api } from "../../../../../../api";
import { ControlValidator } from "../../../../../../classes/ControlValidator";
import { IAuthenticatedNavItem } from "../../../../../../components/authenticatedPageContainer";
import { WrappedButton } from "../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../components/wrappedTextField";
import { useControl } from "../../../../../../hooks/useControl";
import { IBoard } from "../../../../../../models/board";
import { controlsAreValid } from "../../../../../../utils/controlsAreValid";
import { useHistory, useParams } from "react-router-dom";
import { BoardsContainer } from "../../../../../../components/boardsContainer";

const useStyles = makeStyles({
    createBoardContainer: {
        height: "100%",
    },
});

export function Boards() {
    const theme = useTheme();
    const materialStyles = useStyles();
    const classes = createClasses(theme);
    const history = useHistory();
    const { companyId } = useParams<{
        companyId?: string;
    }>();

    const [isLoadingBoards, setIsLoadingBoards] = useState(true);
    const [boards, setBoards] = useState<IBoard[]>([]);
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

    function openBoard(boardId: string) {
        return () => {
            history.push(`/app/company/${companyId}/board/${boardId}`);
        };
    }

    const navItems: IAuthenticatedNavItem[] = [
        {
            text: "Boards",
            route: `/app/company/${companyId}/boards`,
        },
    ];

    const [createBoardDialogIsOpen, setCreateBoardDialogIsOpen] = useState(
        false
    );
    function openCreateBoardDialog() {
        setCreateBoardDialogIsOpen(true);
    }
    function closeCreateBoardDialog() {
        setCreateBoardDialogIsOpen(false);
    }

    const boardNameControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (boardName: string) => {
            return ControlValidator.string()
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
            return ControlValidator.string()
                .max(90, "Maximum board description is 90 characters")
                .validate(boardDescription);
        },
    });

    const [isCreatingBoard, setIsCreatingBoard] = useState(false);
    function createBoard() {
        setIsCreatingBoard(true);
    }

    useEffect(() => {
        if (!isCreatingBoard) return;

        let didCancel = false;

        Api.board
            .createBoardForCompany(
                companyId as string,
                boardNameControl.value,
                boardDescriptionControl.value
            )
            .then((board) => {
                if (didCancel) return;
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

    const showBoardNameError =
        boardNameControl.isTouched && boardNameControl.isValid;
    const showBoardDescriptionError =
        boardDescriptionControl.isTouched && boardDescriptionControl.isValid;
    const formIsValid = controlsAreValid(
        boardNameControl,
        boardDescriptionControl
    );

    return (
        <BoardsContainer>
            {isLoadingBoards ? (
                <div css={classes.loadingPageContainer}>
                    <CircularProgress color="primary" size={48} thickness={4} />
                </div>
            ) : (
                <div css={classes.contentContainer}>
                    {boards!.map((board) => {
                        return (
                            <Card key={board.id}>
                                <CardContent>
                                    <div css={classes.titleContainer}>
                                        <Typography variant="h5">
                                            {board.name}
                                        </Typography>
                                    </div>
                                    <Typography>{board.description}</Typography>
                                </CardContent>
                                <CardActions>
                                    <div css={classes.actionButtonContainer}>
                                        <Button
                                            onClick={openBoard(board.id)}
                                            color="primary"
                                        >
                                            Open Board
                                        </Button>
                                    </div>
                                </CardActions>
                            </Card>
                        );
                    })}
                </div>
            )}
            <Dialog
                open={createBoardDialogIsOpen}
                onClose={closeCreateBoardDialog}
                disableBackdropClick={isCreatingBoard}
            >
                <DialogTitle>Create Board</DialogTitle>
                <DialogContent>
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
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <WrappedButton
                        onClick={closeCreateBoardDialog}
                        disabled={isCreatingBoard}
                    >
                        Close
                    </WrappedButton>
                    <WrappedButton
                        variant="contained"
                        onClick={createBoard}
                        color="primary"
                        disabled={!formIsValid || isCreatingBoard}
                        showSpinner={isCreatingBoard}
                    >
                        Create
                    </WrappedButton>
                </DialogActions>
            </Dialog>
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

    const actionButtonContainer = css`
        width: 100%;
        display: flex;
        justify-content: flex-end;
    `;

    const titleContainer = css`
        margin-bottom: ${theme.spacing() * 2}px;
    `;

    const addBoardContainer = css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        flex-direction: column;
    `;

    const columnInputContainer = css`
        width: 300px;
    `;

    return {
        loadingPageContainer,
        contentContainer,
        actionButtonContainer,
        titleContainer,
        addBoardContainer,
        columnInputContainer,
    };
};
