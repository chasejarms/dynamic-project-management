/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { ChangeEvent, useEffect, useState } from "react";
import { Api } from "../../../../../../api";
import { BoardsContainer } from "../../../../../../components/boardsContainer";
import { CenterLoadingSpinner } from "../../../../../../components/centerLoadingSpinner";
import { WrappedButton } from "../../../../../../components/wrappedButton";
import { WrappedTextField } from "../../../../../../components/wrappedTextField";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { useControl } from "../../../../../../hooks/useControl";
import { useEmailControl } from "../../../../../../hooks/useEmailControl";
import { useNameControl } from "../../../../../../hooks/useNameControl";
import { IUser } from "../../../../../../models/user";
import { controlsAreValid } from "../../../../../../utils/controlsAreValid";

const useStyles = makeStyles({
    toolbar: {
        paddingLeft: "16px",
        paddingRight: "16px",
    },
});

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
    function onClickToggleUserRights(user: IUser) {
        return () => {
            setUsers((users) => {
                return users.map((compareUser) => {
                    if (compareUser.shortenedItemId === user.shortenedItemId) {
                        return {
                            ...compareUser,
                            canManageCompanyUsers: !compareUser.canManageCompanyUsers,
                        };
                    } else {
                        return compareUser;
                    }
                });
            });
            setUserToUpdate(user);
        };
    }

    useEffect(() => {
        if (!userToUpdate) return;

        let didCancel = false;

        Api.users
            .updateCanManageCompanyUsers(
                companyId,
                userToUpdate.shortenedItemId,
                !userToUpdate.canManageCompanyUsers
            )
            .then(() => {
                if (didCancel) return;
            })
            .catch(() => {
                if (didCancel) return;
            });

        return () => {
            didCancel = true;
        };
    }, [userToUpdate]);

    const { emailControl, showEmailError } = useEmailControl();
    const { nameControl, showNameError } = useNameControl();
    const canManageCompanyUsersControl = useControl({
        value: false,
        onChange: (checked: boolean) => {
            return checked;
        },
    });
    function onCanModifyCompanyUsersChange(
        event: ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) {
        canManageCompanyUsersControl.onChange(checked);
    }

    const controlsAreInvalid = !controlsAreValid(nameControl, emailControl);

    const [addUserDialogIsOpen, setAddUserDialogIsOpen] = useState(false);
    function onClickAddUser() {
        setAddUserDialogIsOpen(true);
    }
    function onCloseAddUserDialog() {
        setAddUserDialogIsOpen(false);
    }
    function onExited() {
        emailControl.resetControlState("");
        nameControl.resetControlState("");
    }

    const [isAddingUser, setIsAddingUser] = useState(false);
    function onClickAddUserInDialog() {
        setIsAddingUser(true);
    }

    useEffect(() => {
        if (!isAddingUser) return;

        let didCancel = false;

        Api.users
            .addUserToCompany(companyId, {
                email: emailControl.value,
                name: nameControl.value,
                canManageCompanyUsers: canManageCompanyUsersControl.value,
            })
            .then(() => {
                if (didCancel) return;
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsAddingUser(false);
            });

        return () => {
            didCancel = true;
        };
    });

    const classes = createClasses();
    const materialClasses = useStyles();
    return (
        <BoardsContainer>
            {!isLoadingUsers ? (
                <div css={classes.tablePaperContainer}>
                    <Paper>
                        <Toolbar className={materialClasses.toolbar}>
                            <div css={classes.toolbarContainer}>
                                <Typography variant="h6">
                                    Company Users
                                </Typography>
                                <WrappedButton
                                    onClick={onClickAddUser}
                                    color="primary"
                                >
                                    Add User
                                </WrappedButton>
                            </div>
                        </Toolbar>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Can Manage Users</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => {
                                    return (
                                        <TableRow key={user.itemId}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>
                                                <div
                                                    css={
                                                        classes.relativePositionedTableCell
                                                    }
                                                >
                                                    <div
                                                        css={
                                                            classes.absolutePositionedTableCell
                                                        }
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                user.canManageCompanyUsers
                                                            }
                                                            onChange={onClickToggleUserRights(
                                                                user
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                    <Dialog
                        open={addUserDialogIsOpen}
                        onClose={onCloseAddUserDialog}
                        disableBackdropClick={isAddingUser}
                        TransitionProps={{
                            onExited,
                        }}
                    >
                        <DialogTitle>Add User</DialogTitle>
                        <DialogContent>
                            <div css={classes.textFieldContainer}>
                                <WrappedTextField
                                    value={emailControl.value}
                                    label="Email"
                                    onChange={emailControl.onChange}
                                    error={
                                        showEmailError
                                            ? emailControl.errorMessage
                                            : ""
                                    }
                                />
                            </div>
                            <div css={classes.textFieldContainer}>
                                <WrappedTextField
                                    value={nameControl.value}
                                    autoFocus
                                    label="Full Name"
                                    onChange={nameControl.onChange}
                                    error={
                                        showNameError
                                            ? nameControl.errorMessage
                                            : ""
                                    }
                                />
                            </div>
                            <div css={classes.textFieldContainer}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                canManageCompanyUsersControl.value
                                            }
                                            onChange={
                                                onCanModifyCompanyUsersChange
                                            }
                                        />
                                    }
                                    label="Can Modify Company Users"
                                />
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <WrappedButton
                                onClick={onCloseAddUserDialog}
                                disabled={isAddingUser}
                            >
                                Close
                            </WrappedButton>
                            <WrappedButton
                                variant="contained"
                                onClick={onClickAddUserInDialog}
                                color="primary"
                                disabled={controlsAreInvalid || isAddingUser}
                                showSpinner={isAddingUser}
                            >
                                Add User
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

    const relativePositionedTableCell = css`
        position: relative;
        height: 100%;
    `;

    const absolutePositionedTableCell = css`
        position: absolute;
        left: -11px;
        height: 100%;
        display: flex;
        align-items: center;
    `;

    const toolbarContainer = css`
        width: 100%;
        display: flex;
        justify-content: space-between;
    `;

    const textFieldContainer = css`
        width: 300px;
    `;

    return {
        tablePaperContainer,
        relativePositionedTableCell,
        absolutePositionedTableCell,
        toolbarContainer,
        textFieldContainer,
    };
};
