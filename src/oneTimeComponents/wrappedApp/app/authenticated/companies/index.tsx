import { useEffect } from "react";
import { Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../redux/storeState";
import { CompaniesContainer } from "./components/companiesContainer";
import { RouteCreator } from "../../utils/routeCreator";
import { ClickableCard } from "../components/clickableCard";

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
                    gap: 2,
                }}
            >
                {companies?.map((company) => {
                    return (
                        <ClickableCard
                            title={company.name}
                            onClick={openBoards(company.shortenedItemId)}
                        />
                    );
                })}
            </Box>
        </CompaniesContainer>
    );
}
