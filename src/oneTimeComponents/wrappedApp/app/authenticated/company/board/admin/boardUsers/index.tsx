import {
    Box,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../components/centerLoadingSpinner";
import { useAppRouterParams } from "../../../../../hooks/useAppRouterParams";
import { IUser } from "../../../../../../../../models/user";
import { cloneDeep } from "lodash";
import { BoardRightsAction } from "../../../../../../../../models/boardRightsAction";
import { BoardAdminContainer } from "../components/boardAdminContainer";
import { useCompanyUser } from "../../../hooks/useCompanyUser";

export function BoardUsers() {
    const { companyId, boardId } = useAppRouterParams();
    const [users, setUsers] = useState<IUser[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const currentSignedInUser = useCompanyUser();

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

    function onChangeIsBoardAdmin(user: IUser) {
        return () => {
            const updatedBoardRights = cloneDeep(user.boardRights);
            const wasAdmin = updatedBoardRights[boardId].isAdmin;
            if (wasAdmin) {
                updatedBoardRights[boardId] = {
                    isAdmin: false,
                };
            } else {
                updatedBoardRights[boardId] = {
                    isAdmin: true,
                };
            }

            setUsers((previousUsers) => {
                return previousUsers.map((compareUser) => {
                    if (compareUser.shortenedItemId === user.shortenedItemId) {
                        return {
                            ...compareUser,
                            boardRights: updatedBoardRights,
                        };
                    } else {
                        return compareUser;
                    }
                });
            });

            Api.users
                .updateUserBoardRights(
                    companyId,
                    boardId,
                    user.shortenedItemId,
                    wasAdmin ? BoardRightsAction.User : BoardRightsAction.Admin
                )
                .then(() => null);
        };
    }

    return (
        <BoardAdminContainer>
            {!isLoadingUsers ? (
                <Box
                    sx={{
                        padding: 32,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Board Admin</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => {
                                    const isBoardUser = !!user.boardRights[
                                        boardId
                                    ];
                                    const isBoardAdmin =
                                        isBoardUser &&
                                        user.boardRights[boardId].isAdmin;
                                    const isCurrentSignedInUser =
                                        currentSignedInUser?.shortenedItemId ===
                                        user.shortenedItemId;
                                    return (
                                        <TableRow key={user.itemId}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        position: "relative",
                                                        height: "100%",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            left: -11,
                                                            height: "100%",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                isBoardAdmin
                                                            }
                                                            disabled={
                                                                !isBoardUser ||
                                                                isCurrentSignedInUser
                                                            }
                                                            onChange={onChangeIsBoardAdmin(
                                                                user
                                                            )}
                                                        />
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            ) : (
                <CenterLoadingSpinner size="large" />
            )}
        </BoardAdminContainer>
    );
}
