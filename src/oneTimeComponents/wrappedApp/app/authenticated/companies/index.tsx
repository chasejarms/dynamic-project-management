/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useEffect } from "react";
import {
    useTheme,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Theme,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../redux/storeState";
import { CompaniesContainer } from "./components/companiesContainer";

export function Companies() {
    const theme = useTheme();
    const classes = createClasses(theme);
    const history = useHistory();
    const companies = useSelector((state: IStoreState) => {
        return state.appBootstrapInformation.companies;
    });

    useEffect(() => {
        if (companies.length === 1) {
            openBoards(companies[0].shortenedItemId)();
        }
    }, [companies]);

    function openBoards(companyId: string) {
        return () => {
            history.push(`/app/company/${companyId}/boards`);
        };
    }

    return (
        <CompaniesContainer>
            <div css={classes.cardsContainer}>
                {companies?.map((company) => {
                    return (
                        <Card key={company.shortenedItemId}>
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
                                        onClick={openBoards(
                                            company.shortenedItemId
                                        )}
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
        </CompaniesContainer>
    );
}

const createClasses = (theme: Theme) => {
    const cardsContainer = css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-auto-rows: min-content;
        grid-gap: ${theme.spacing() * 2}px;
        padding: ${theme.spacing() * 4}px;
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
        cardsContainer,
        actionButtonContainer,
        titleContainer,
    };
};
