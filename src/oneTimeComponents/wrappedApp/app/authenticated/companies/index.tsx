/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import {
    useTheme,
    CircularProgress,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Theme,
} from "@material-ui/core";
import { AxiosError } from "axios";
import { ICompany } from "../../../../../models/company";
import { Api } from "../../../../../api";
import { useHistory } from "react-router-dom";

export function Companies() {
    const theme = useTheme();
    const classes = createClasses(theme);
    const history = useHistory();

    const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
    const [companies, setCompanies] = useState<null | ICompany[]>(null);

    useEffect(() => {
        let didCancel = false;

        Api.company
            .getCompanies()
            .then((companies) => {
                if (didCancel) return;
                if (companies.length === 1) {
                    openBoards(companies[0].companyId)();
                } else {
                    setCompanies(companies);
                }
            })
            .catch((error: Error | AxiosError) => {
                if (didCancel) return;
                // show an unexpected error
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingCompanies(false);
            });

        return () => {
            didCancel = true;
        };
    }, []);

    function openBoards(companyId: string) {
        return () => {
            history.push(`/app/company/${companyId}/boards`);
        };
    }

    return isLoadingCompanies ? (
        <div css={classes.loadingPageContainer}>
            <CircularProgress color="primary" size={48} thickness={4} />
        </div>
    ) : (
        <div css={classes.cardsContainer}>
            {companies?.map((company) => {
                return (
                    <Card key={company.companyId}>
                        <CardContent>
                            <div css={classes.titleContainer}>
                                <Typography variant="h5">
                                    {company.name}
                                </Typography>
                            </div>
                        </CardContent>
                        <CardActions>
                            <div css={classes.actionButtonContainer}>
                                <Button
                                    onClick={openBoards(company.companyId)}
                                    color="primary"
                                >
                                    Go To Boards
                                </Button>
                            </div>
                        </CardActions>
                    </Card>
                );
            })}
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const loadingPageContainer = css`
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const cardsContainer = css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: ${theme.spacing() * 2}px;
        margin-top: ${theme.spacing() * 4}px;
    `;

    const actionButtonContainer = css`
        width: 100%;
        display: flex;
        justify-content: flex-end;
    `;

    const titleContainer = css`
        margin-bottom: ${theme.spacing() * 2}px;
    `;

    return {
        loadingPageContainer,
        cardsContainer,
        actionButtonContainer,
        titleContainer,
    };
};
