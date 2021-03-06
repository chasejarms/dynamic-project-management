import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    Box,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { Api } from "../../../../../../api";
import { BoardsContainer } from "../components/boardsContainer";
import { CenterLoadingSpinner } from "../../components/centerLoadingSpinner";
import { WrappedButton } from "../../../components/wrappedButton";
import { WrappedTextField } from "../../../components/wrappedTextField";
import { useAppRouterParams } from "../../../hooks/useAppRouterParams";
import { useControl } from "../../../hooks/useControl";
import { useEmailControl } from "../../../hooks/useEmailControl";
import { useNameControl } from "../../../hooks/useNameControl";
import { IUser } from "../../../../../../models/user";
import { controlsAreValid } from "../../../utils/controlsAreValid";
import { Delete } from "@mui/icons-material";
import { ConfirmDialog } from "../components/confirmDialog";
import { sortBy } from "lodash";
import { useIsCheckingForManageCompanyUserAccess } from "./hooks/useIsCheckingForManageCompanyUserAccess";
import { useCompanyUser } from "../hooks/useCompanyUser";

export function CompanyUsers() {
    const { companyId } = useAppRouterParams();
    const [users, setUsers] = useState<IUser[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const isCheckingForManageCompanyUserAccess = useIsCheckingForManageCompanyUserAccess();

    useEffect(() => {
        let didCancel = false;

        if (isCheckingForManageCompanyUserAccess) return;

        Api.users
            .getAllUsersForCompany(companyId)
            .then((usersFromDatabase) => {
                if (didCancel) return;
                const sortedDatabaseUsers = sortBy(usersFromDatabase, "name");
                setUsers(sortedDatabaseUsers);
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
    }, [isCheckingForManageCompanyUserAccess]);

    const [userToUpdate, setUserToUpdate] = useState<null | IUser>(null);
    function onClickToggleManageCompanyUserRights(user: IUser) {
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
            setUserToUpdate({
                ...user,
                canManageCompanyUsers: !user.canManageCompanyUsers,
            });
        };
    }

    const currentSignedInUser = useCompanyUser();

    useEffect(() => {
        if (!userToUpdate) return;

        let didCancel = false;

        Api.users
            .updateCompanyUserRights(
                companyId,
                userToUpdate.shortenedItemId,
                userToUpdate.canManageCompanyUsers
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
    function onExitedAddUserDialog() {
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
            .then((user) => {
                if (didCancel) return;
                setUsers((users) => {
                    return sortBy([...users, user], "name");
                });
                onCloseAddUserDialog();
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
    }, [isAddingUser]);

    const [
        { userToDelete, deleteDialogIsOpen },
        setUserDeleteMetadata,
    ] = useState<{
        userToDelete: null | IUser;
        deleteDialogIsOpen: boolean;
    }>({
        userToDelete: null,
        deleteDialogIsOpen: false,
    });
    function onClickDeleteTableIcon(user: IUser) {
        return () => {
            setUserDeleteMetadata({
                userToDelete: user,
                deleteDialogIsOpen: true,
            });
        };
    }
    function onCloseDeleteUserDialog() {
        setUserDeleteMetadata((previous) => {
            return {
                ...previous,
                deleteDialogIsOpen: false,
            };
        });
    }

    const [isDeletingUser, setIsDeletingUser] = useState(false);
    function onConfirmDeleteUser() {
        setIsDeletingUser(true);
    }
    useEffect(() => {
        if (!isDeletingUser || !userToDelete) return;

        let didCancel = false;

        Api.users
            .removeUserFromCompany(companyId, userToDelete.email)
            .then(() => {
                if (didCancel) return;
                setUsers((users) => {
                    return users.filter((compareUser) => {
                        return (
                            compareUser.shortenedItemId !==
                            userToDelete.shortenedItemId
                        );
                    });
                });
                onCloseDeleteUserDialog();
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsDeletingUser(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isDeletingUser, userToDelete]);
    function onExitedUserDeleteDialog() {
        setUserDeleteMetadata((previous) => {
            return {
                ...previous,
                userToDelete: null,
            };
        });
    }

    return (
        <BoardsContainer>
            {!isLoadingUsers ? (
                <Box
                    sx={{
                        padding: 4,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Paper>
                        <Toolbar
                            sx={{
                                paddingLeft: 2,
                                paddingRight: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="h6">
                                    Company Users
                                </Typography>
                                <div>
                                    <WrappedButton
                                        onClick={onClickAddUser}
                                        color="primary"
                                    >
                                        Add User
                                    </WrappedButton>
                                </div>
                            </Box>
                        </Toolbar>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Manage Users</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => {
                                    const isCurrentSignedInUser =
                                        user.shortenedItemId ===
                                        currentSignedInUser?.shortenedItemId;
                                    return (
                                        <TableRow key={user.itemId}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        position: "relative",
                                                        height: "100%",
                                                        width: "48px",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            left: "-11px",
                                                            height: "100%",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                user.canManageCompanyUsers
                                                            }
                                                            onChange={onClickToggleManageCompanyUserRights(
                                                                user
                                                            )}
                                                            disabled={
                                                                isCurrentSignedInUser
                                                            }
                                                        />
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        position: "relative",
                                                        height: "100%",
                                                        width: "48px",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            left: "-11px",
                                                            height: "100%",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        {!isCurrentSignedInUser && (
                                                            <IconButton
                                                                onClick={onClickDeleteTableIcon(
                                                                    user
                                                                )}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                </Box>
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
                        onBackdropClick={() => {
                            if (isAddingUser) return;

                            onCloseAddUserDialog();
                        }}
                        TransitionProps={{
                            onExited: onExitedAddUserDialog,
                        }}
                    >
                        <DialogTitle>Add User</DialogTitle>
                        <DialogContent>
                            <Box
                                sx={{
                                    width: "300px",
                                }}
                            >
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
                            </Box>
                            <Box
                                sx={{
                                    width: "300px",
                                }}
                            >
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
                            </Box>
                            <Box
                                sx={{
                                    width: "300px",
                                }}
                            >
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
                            </Box>
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
                    <ConfirmDialog
                        isPerformingAction={isDeletingUser}
                        open={deleteDialogIsOpen}
                        onConfirm={onConfirmDeleteUser}
                        onClose={onCloseDeleteUserDialog}
                        title="Delete User"
                        content="Are you sure you want to delete this user?"
                        confirmButtonText="Delete User"
                        TransitionProps={{
                            onExited: onExitedUserDeleteDialog,
                        }}
                    />
                </Box>
            ) : (
                <CenterLoadingSpinner size="large" />
            )}
        </BoardsContainer>
    );
}
