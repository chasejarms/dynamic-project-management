/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { NonAuthenticatedPageContainer } from "../../../../components/nonAuthenticatedPageContainer";
import { LandingPageCommonSection } from "./components/landingPageCommonSection";
import { IWrappedButtonProps } from "../components/wrappedButton";
import { useHistory } from "react-router-dom";
import { PrioritizationIsToughSvg } from "./components/landingPageSvgs/prioritizationIsTough";
import { TeamVelocitySuffers } from "./components/landingPageSvgs/teamVelocitySuffers";
import { ExistingSolutionsAreLimiting } from "./components/landingPageSvgs/existingSolutionsAreLimiting";
import { RelativePrioritization } from "./components/landingPageSvgs/relativePrioritization";
import { useBreakpoint } from "../../../../hooks/useBreakpoint";

export function Home() {
    const history = useHistory();
    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            onClick: () => {
                history.push("/contact");
            },
            children: "Schedule A Demo",
            color: "primary",
            variant: "outlined",
        },
    ];

    const breakpoints = useBreakpoint();
    const size = breakpoints.max768 ? 200 : 300;

    return (
        <NonAuthenticatedPageContainer>
            <LandingPageCommonSection
                title={"Prioritization is Tough"}
                textSections={[
                    "Prioritizing large projects is incredibly challenging. Between the backlog and the in progress board, there can be hundreds of individual tickets that the team needs to prioritize.",
                    "And as if that weren’t enough, stakeholders are often tweaking the direction of the project forcing the team to reorganize the board again and again. The more stakeholders that are involved, the more cumbersome this process becomes.",
                ]}
                placeContent="left"
                wrappedButtonProps={wrappedButtonProps}
                svgContent={<PrioritizationIsToughSvg size={size} />}
            />
            <LandingPageCommonSection
                title={"Team Velocity Suffers"}
                textSections={[
                    "Most of this work ends up falling on the project manager or the team lead. Instead of working on the product or spending time with customers, their time is consumed by administrative tasks.",
                    "And in spite of their best efforts, prioritization and backlog grooming often take a back seat to other responsibilities and team members unknowingly work on low priority tasks.",
                ]}
                placeContent="right"
                wrappedButtonProps={wrappedButtonProps}
                svgContent={<TeamVelocitySuffers size={size} />}
            />
            <LandingPageCommonSection
                title={"Existing Solutions Are Limiting"}
                textSections={[
                    "Existing software solutions fall into one of two categories: Brute Force Prioritization and Fixed List Prioritization.",
                    "In brute force solutions, every ticket is managed individually and needs to be dragged up or down in the column to communicate priority. Not only is this time consuming but it's nearly impossible to maintain a perfectly prioritized board.",
                    "In fixed list solutions, the software provides a fixed list of tags like 'Low', 'Medium', and 'High'. When a project is small, this works great. But as the project grows, team members realize that 'Low' and 'Medium' tasks never get worked on so they begin adding the 'High' priority to every task",
                    "Unfortunately when everything is a high priority nothing is.",
                ]}
                placeContent="left"
                wrappedButtonProps={wrappedButtonProps}
                svgContent={<ExistingSolutionsAreLimiting size={size} />}
            />
            <LandingPageCommonSection
                title={"Dynamic Prioritization"}
                textSections={[
                    "Instead of prioritizing each task individually or utilizing a fixed list tagging system, Butter utilizes dynamic functions and automatically prioritizes your entire board.",
                    "Using simple Excel-like functions, Butter calculates a priority score for every ticket and organizes tickets in each column. The prioritization function is completely customizable and can fit any workflow.",
                ]}
                placeContent="right"
                wrappedButtonProps={wrappedButtonProps}
                svgContent={<RelativePrioritization size={size} />}
            />
        </NonAuthenticatedPageContainer>
    );
}
