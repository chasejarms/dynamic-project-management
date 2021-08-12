/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography, Button, useTheme, Theme } from "@material-ui/core";
import { NonAuthenticatedPageContainer } from "../../../../components/nonAuthenticatedPageContainer";
import { useHistory } from "react-router-dom";
import { LandingPageCommonSection } from "../../../../components/landingPageCommonSection";

export function Home() {
    const theme = useTheme();
    const classes = createClasses(theme);
    const history = useHistory();

    function navigateToSignUpPage() {
        history.push("/sign-up");
    }

    return (
        <NonAuthenticatedPageContainer>
            <LandingPageCommonSection
                title={"Prioritization is Tough"}
                textSections={[
                    "Prioritizing large projects is incredibly challenging. Between the backlog and the in progress board, there can be hundreds of individual tickets that the team needs to prioritize.",
                    "And if that weren’t enough, stakeholders are often tweaking the direction of the project forcing them team to reorganize the board again and again. The more stakeholders that are involved, the more cumbersome this process becomes.",
                ]}
                placeContent="left"
            />
            <LandingPageCommonSection
                title={"Team Velocity Suffers"}
                textSections={[
                    "Most of this work ends up falling on the project manager or the team lead. Instead of working with customers or on the product, they spend countless hours on administrative tasks to ensure other team members are productive.",
                    "Even with all this effort, the complexity of taking in stakeholder input and applying it across hundreds of tasks leads to an imperfect board and team members unknowingly work on low priority tasks.",
                ]}
                placeContent="right"
            />
            <LandingPageCommonSection
                title={"Existing Solutions Are Limiting"}
                textSections={[
                    "The current solutions in the market can be put into two buckets: Brute Force Prioritization and Fixed Prioritization.",
                    "In brute force solutions, each and every ticket needs to be dragged up or down in a column to be prioritized. Not only is this time consuming but it's nearly impossible to maintain a perfectly prioritized board across many columns, especially when priorties shift.",
                    "In fixed solutions, the software provides a fixed list of tags like 'Low', 'Medium', and 'High'. When a project is small, this works great. But as the project grows, team members realize that 'Low' and 'Medium' tasks never get worked on so they add the 'High' priority to every task",
                    "And when everything is everything is high priority, nothing is.",
                ]}
                placeContent="left"
            />
            <LandingPageCommonSection
                title={"Introducing Relative Prioritization"}
                textSections={[
                    "Instead of having fixed lists or prioritizing each task individually, tasks can be prioritized in large groups with ticket tags.",
                    "Custom tags are applied to each task and when the tags are prioritized, the backlog and all in progress tickets are adjusted to reflect the new priorities.",
                ]}
                placeContent="right"
            />
            {/* show an example board with priorities right next to it here */}
            {/* invite them to schedule a demo and send them to the contact page */}
        </NonAuthenticatedPageContainer>
    );
}

const createClasses = (theme: Theme) => {
    const signUpContainer = css`
        margin-right: ${theme.spacing() * 2}px;
    `;

    const buttonContainer = css`
        display: flex;
    `;

    const bottomMargin24 = css`
        margin-bottom: ${theme.spacing() * 3}px;
    `;

    const pageContent = css`
        padding-top: ${theme.spacing() * 10}px;
        padding-bottom: ${theme.spacing() * 6}px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: ${theme.spacing() * 3}px;
    `;

    return {
        signUpContainer,
        buttonContainer,
        bottomMargin24,
        pageContent,
    };
};
