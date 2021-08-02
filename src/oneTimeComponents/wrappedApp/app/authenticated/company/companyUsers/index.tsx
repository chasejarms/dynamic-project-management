/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { Api } from "../../../../../../api";
import { BoardsContainer } from "../../../../../../components/boardsContainer";
import { CenterLoadingSpinner } from "../../../../../../components/centerLoadingSpinner";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { IUser } from "../../../../../../models/user";

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
            setUserToUpdate(user);
        };
    }

    useEffect(() => {
        if (!userToUpdate) return;

        let didCancel = false;

        Api.users
            .updateCanManageCompanyUsers(
                companyId,
                userToUpdate.shortenedItemId
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

    return {
        tablePaperContainer,
        relativePositionedTableCell,
        absolutePositionedTableCell,
    };
};
