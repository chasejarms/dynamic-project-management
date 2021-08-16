/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { INavBarItem } from "../../navBar";
import { makeStyles, Theme, Typography, useTheme } from "@material-ui/core";
import { Close, Menu } from "@material-ui/icons";
import { composeCSS } from "../../../styles/composeCSS";
import { useLocation, useHistory } from "react-router-dom";

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
    const location = useLocation();

    return (
        <div css={classes.persistentNavBar}>
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
                                {props.navItems.map(({ label, route }) => {
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
        width: 100%;
        display: flex;
        justify-content: flex-end;
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

    return {
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
