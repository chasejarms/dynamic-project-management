/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../api";
import { BoardsContainer } from "../../../../../../components/boardsContainer";
import { CenterLoadingSpinner } from "../../../../../../components/centerLoadingSpinner";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { IUser } from "../../../../../../models/user";
import { Check, Edit } from "@material-ui/icons";
import { WrappedButton } from "../../../../../../components/wrappedButton";

export function CompanyUsers() {
    const { companyId } = useAppRouterParams();
    const [users, setUsers] = useState<IUser[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    useEffect(() => {
        let didCancel = false;

        Api.users
            .getAllUsersForCompany(companyId)
            .then((usersFromDatabase) => {
                if (didCancel) return;
                setUsers(usersFromDatabase);
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingUsers(false);
            });

        return () => {
            didCancel = true;
        };
    }, []);

    const [userToUpdate, setUserToUpdate] = useState<null | IUser>(null);
    const dialogIsOpen = !!userToUpdate;
    function onCloseDialog() {
        setUserToUpdate(null);
    }
    function onClickToggleUserRights(user: IUser) {
        return () => {
            setUserToUpdate(user);
        };
    }

    const classes = createClasses();
    return (
        <BoardsContainer>
            {!isLoadingUsers ? (
                <div css={classes.tablePaperContainer}>
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Company Admin</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => {
                                    return (
                                        <TableRow key={user.itemId}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={
                                                        user.isCompanyAdmin
                                                    }
                                                    onChange={onClickToggleUserRights(
                                                        user
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                    <Dialog
                        open={dialogIsOpen}
                        onClose={onCloseDialog}
                        disableBackdropClick={false}
                    >
                        <DialogTitle>
                            {userToUpdate?.isCompanyAdmin
                                ? "Remove Company Admin Rights"
                                : "Enable Company Admin Rights"}
                        </DialogTitle>
                        <DialogContent>
                            <Typography>
                                {userToUpdate?.isCompanyAdmin
                                    ? "Are you sure you want to remove company admin rights from this user?"
                                    : "Are you sure you want to give this user company admin rights? They will access to all company features including all boards, user rights, and the ability to delete the company account."}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <WrappedButton
                                onClick={onCloseDialog}
                                disabled={false}
                            >
                                Close
                            </WrappedButton>
                            <WrappedButton
                                variant="contained"
                                onClick={() => null}
                                color="primary"
                                disabled={false}
                                showSpinner={false}
                            >
                                {userToUpdate?.isCompanyAdmin
                                    ? "Remove Company Admin Rights"
                                    : "Enable Company Admin Rights"}
                            </WrappedButton>
                        </DialogActions>
                    </Dialog>
                </div>
            ) : (
                <CenterLoadingSpinner size="large" />
            )}
        </BoardsContainer>
    );
}

const createClasses = () => {
    const tablePaperContainer = css`
        padding: 32px;
        width: 100%;
        height: 100%;
    `;

    return {
        tablePaperContainer,
    };
};
