/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography, Button, useTheme, Theme } from "@material-ui/core";
import { NonAuthenticatedPageContainer } from "../../../../components/nonAuthenticatedPageContainer";
import { useHistory } from "react-router-dom";

export function Home() {
    const theme = useTheme();
    const classes = createClasses(theme);
    const history = useHistory();

    function navigateToSignUpPage() {
        history.push("/sign-up");
    }

    return (
        <NonAuthenticatedPageContainer>
            <div css={classes.pageContent}>
                <div>
                    <div css={classes.bottomMargin24}>
                        <Typography variant="h4">
                            Flexible Project Management for Software Teams
                        </Typography>
                    </div>
                    <div css={classes.bottomMargin24}>
                        <Typography>
                            Elastic Agile is a new type of project management
                            that ensures development teams focus on the highest
                            priority defects and features.
                        </Typography>
                    </div>
                    <div css={classes.bottomMargin24}>
                        <Typography>
                            Unlike traditional project management tools, Elastic
                            Agile focuses on relative prioritization making it
                            easier for product and development to execute
                            enterprise level software projects.
                        </Typography>
                    </div>
                    <div css={classes.buttonContainer}>
                        <div css={classes.signUpContainer}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={navigateToSignUpPage}
                            >
                                Sign Up
                            </Button>
                        </div>
                        <div>
                            <Button variant="outlined" color="primary">
                                What is relative prioritization?
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <Typography>Screenshot of course here</Typography>
                </div>
            </div>
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
