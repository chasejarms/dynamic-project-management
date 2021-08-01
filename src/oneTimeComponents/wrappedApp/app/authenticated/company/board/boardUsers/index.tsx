/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { Check } from "@material-ui/icons";
import { Api } from "../../../../../../../api";
import { CenterLoadingSpinner } from "../../../../../../../components/centerLoadingSpinner";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { IUser } from "../../../../../../../models/user";
import { BoardContainer } from "../../../../../../../components/boardContainer";

export function BoardUsers() {
    const { companyId, boardId } = useAppRouterParams();
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

    const classes = createClasses();
    return (
        <BoardContainer>
            {!isLoadingUsers ? (
                <div css={classes.tablePaperContainer}>
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Board User</TableCell>
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
                                    return (
                                        <TableRow key={user.itemId}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>
                                                {isBoardUser ? <Check /> : null}
                                            </TableCell>
                                            <TableCell>
                                                {isBoardAdmin ? (
                                                    <Check />
                                                ) : null}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            ) : (
                <CenterLoadingSpinner size="large" />
            )}
        </BoardContainer>
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
