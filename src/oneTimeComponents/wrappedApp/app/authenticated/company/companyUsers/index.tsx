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
import { Api } from "../../../../../../api";
import { BoardsContainer } from "../../../../../../components/boardsContainer";
import { CenterLoadingSpinner } from "../../../../../../components/centerLoadingSpinner";
import { useAppRouterParams } from "../../../../../../hooks/useAppRouterParams";
import { IUser } from "../../../../../../models/user";
import { Check } from "@material-ui/icons";

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
                                                {user.isCompanyAdmin ? (
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
