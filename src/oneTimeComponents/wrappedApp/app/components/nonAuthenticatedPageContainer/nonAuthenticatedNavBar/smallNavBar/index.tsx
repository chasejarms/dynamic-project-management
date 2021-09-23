import React, { useState } from "react";
import { INavBarItem } from "../navBar";
import { Typography, Box } from "@mui/material";
import { Close, Menu } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { CompanyLogo } from "../companyLogo";
import { RouteCreator } from "../../../../utils/routeCreator";

interface ISmallNavBarProps {
    navItems: INavBarItem[];
}

export function SmallNavBar(props: ISmallNavBarProps) {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const internalNavItems = [...props.navItems].concat([
        {
            label: "Sign In",
            route: RouteCreator.signIn(),
        },
    ]);

    return (
        <Box
            sx={{
                height: "60px",
                display: "flex",
                justifyContent: "space-between",
                width: "100vw",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        paddingLeft: 3,
                        top: "8px",
                        left: "-2px",
                    }}
                >
                    <CompanyLogo />
                </Box>
            </Box>
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 0,
                    px: 2,
                    zIndex: 3,
                }}
            >
                {!open && (
                    <Box
                        sx={{
                            cursor: "pointer",
                        }}
                    >
                        <Menu
                            onClick={() => {
                                setOpen(true);
                            }}
                        />
                    </Box>
                )}
            </Box>
            {open && (
                <>
                    <Box
                        sx={{
                            height: "60px",
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100vw",
                            position: "absolute",
                            zIndex: 3,
                        }}
                    >
                        <div />
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                py: 0,
                                px: 2,
                                zIndex: 3,
                                color: "white",
                            }}
                        >
                            <Box
                                sx={{
                                    cursor: "pointer",
                                }}
                            >
                                <Close
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            height: "100vh",
                            width: "100vw",
                            display: "grid",
                            gridTemplateRows: "0 1fr",
                            bgcolor: "primary.main",
                            opacity: 0.95,
                            position: "absolute",
                            zIndex: 2,
                        }}
                    >
                        <div />
                        <Box
                            sx={{
                                display: "grid",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateRows: "min-content",
                                    gap: "20px",
                                }}
                            >
                                {internalNavItems.map(({ label, route }) => {
                                    const onClick = () => {
                                        setOpen(false);
                                        history.push(route);
                                    };
                                    return (
                                        <div onClick={onClick} key={route}>
                                            <Box
                                                sx={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <Typography
                                                    variant="h4"
                                                    key={label}
                                                    sx={{
                                                        color: "white",
                                                        zIndex: 3,
                                                    }}
                                                >
                                                    {label}
                                                </Typography>
                                            </Box>
                                        </div>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}
