/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { INavBarItem } from "../navBar";
import { makeStyles, Theme, Typography, useTheme } from "@material-ui/core";
import { Close, Menu } from "@material-ui/icons";
import { composeCSS } from "../../../../../../../styles/composeCSS";
import { useHistory } from "react-router-dom";
import { CompanyLogo } from "../companyLogo";
import { RouteCreator } from "../../../../utils/routeCreator";

interface ISmallNavBarProps {
    navItems: INavBarItem[];
}

const useStyles = makeStyles({
    typography: {
        color: "white",
        zIndex: 2,
    },
});

export function SmallNavBar(props: ISmallNavBarProps) {
    const history = useHistory();
    const theme = useTheme();
    const classes = createClasses(theme);
    const materialClasses = useStyles();
    const [open, setOpen] = useState(false);
    const internalNavItems = [...props.navItems].concat([
        {
            label: "Sign In",
            route: RouteCreator.signIn(),
        },
    ]);

    return (
        <div css={classes.persistentNavBar}>
            <div css={classes.logoContainer}>
                <div css={classes.innerLogoContainer}>
                    <CompanyLogo />
                </div>
            </div>
            <div css={classes.openCloseIconContainer}>
                {!open && (
                    <div css={classes.iconWrapper}>
                        <Menu
                            css={classes.icon}
                            onClick={() => {
                                setOpen(true);
                            }}
                        />
                    </div>
                )}
            </div>
            {open && (
                <>
                    <div
                        css={composeCSS(
                            classes.persistentNavBar,
                            classes.absolutePositionedPersistentNavBar
                        )}
                    >
                        <div />
                        <div
                            css={composeCSS(
                                classes.openCloseIconContainer,
                                classes.whiteText
                            )}
                        >
                            <div css={classes.iconWrapper}>
                                <Close
                                    css={classes.icon}
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div css={classes.fullPageNavContainer}>
                        <div />
                        <div css={classes.gridCenterContent}>
                            <div css={classes.linkGrid}>
                                {internalNavItems.map(({ label, route }) => {
                                    const onClick = () => {
                                        setOpen(false);
                                        history.push(route);
                                    };
                                    return (
                                        <div onClick={onClick} key={route}>
                                            <div css={classes.linkContainer}>
                                                <Typography
                                                    variant="h4"
                                                    key={label}
                                                    className={
                                                        materialClasses.typography
                                                    }
                                                >
                                                    {label}
                                                </Typography>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function createClasses(theme: Theme) {
    const linkGrid = css`
        display: grid;
        grid-template-rows: min-content;
        grid-gap: 20px;
    `;

    const persistentNavBar = css`
        height: 60px;
        display: flex;
        justify-content: space-between;
        width: 100vw;
    `;

    const fullPageNavContainer = css`
        height: 100vh;
        width: 100vw;
        display: grid;
        grid-template-rows: 0 1fr;
        background-color: ${theme.palette.primary.main};
        opacity: 0.95;
        position: absolute;
        z-index: 1;
    `;

    const absolutePositionedPersistentNavBar = css`
        position: absolute;
        z-index: 2;
    `;

    const navTextSmallNav = css`
        color: white;
    `;

    const gridCenterContent = css`
        display: grid;
        justify-content: center;
        align-items: center;
    `;

    const openCloseIconContainer = css`
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0px 16px;
        z-index: 2;
    `;

    const whiteText = css`
        color: white;
    `;

    const iconWrapper = css`
        cursor: pointer;
    `;

    const linkContainer = css`
        cursor: pointer;
    `;

    const icon = css`
        /* font-size: 2rem; */
    `;

    const logoContainer = css`
        position: relative;
    `;

    const innerLogoContainer = css`
        position: absolute;
        padding-left: 24px;
        top: 8px;
        left: -2px;
    `;

    return {
        logoContainer,
        innerLogoContainer,
        persistentNavBar,
        fullPageNavContainer,
        navTextSmallNav,
        linkGrid,
        gridCenterContent,
        openCloseIconContainer,
        whiteText,
        iconWrapper,
        linkContainer,
        icon,
        absolutePositionedPersistentNavBar,
    };
}
