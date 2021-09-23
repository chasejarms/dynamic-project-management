import { useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Box,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../redux/storeState";
import { CompaniesContainer } from "./components/companiesContainer";
import { RouteCreator } from "../../utils/routeCreator";

export function Companies() {
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
            const route = RouteCreator.boards(companyId);
            history.push(route);
        };
    }

    return (
        <CompaniesContainer>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gridAutoRows: "min-content",
                    padding: 4,
                    gridGap: 16,
                }}
            >
                {companies?.map((company) => {
                    return (
                        <Card key={company.shortenedItemId}>
                            <CardContent>
                                <Box
                                    sx={{
                                        marginBottom: 16,
                                    }}
                                >
                                    <Typography variant="h5">
                                        {company.name}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        width: "100%",
                                    }}
                                >
                                    <Button
                                        onClick={openBoards(
                                            company.shortenedItemId
                                        )}
                                        color="primary"
                                    >
                                        Go To Boards
                                    </Button>
                                </Box>
                            </CardActions>
                        </Card>
                    );
                })}
            </Box>
        </CompaniesContainer>
    );
}
