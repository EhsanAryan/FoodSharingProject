import { Drawer, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const DrawerNavbar = ({
    isMenuOpen,
    handleSetIsMenuOpen,
    navbarItems,
    anchor = "right",
    isLoading = false
}) => {
    const pathname = usePathname();

    return (
        <Drawer
            anchor={anchor}
            open={isMenuOpen}
            onClick={handleSetIsMenuOpen}
            sx={{
                display: {
                    xs: "block",
                    md: "none"
                },
                zIndex: 1000
            }}
        >
            <List
                sx={{
                    width: (anchor === "left" || anchor === "right") ? "250px" : "100%",
                    height: (anchor === "left" || anchor === "right") ? "100vh" : "auto",
                    overflow: "auto"
                }}
                onClick={(ev) => ev.stopPropagation()}
                className="bg-primary"
            >
                {!isLoading ? (
                    navbarItems.map((item, index) => (
                        <ListItem disablePadding key={`hidden_${Math.random()}_${index}`}
                            className="my-2">
                            <Link
                                href={item.href}
                                className={`w-full 
                                ${pathname === item.href ? "bg-[#00000033]" : ""}`}
                            >
                                <ListItemButton
                                    sx={{
                                        display: "flex",
                                        gap: "0.5rem",
                                        alignItems: "center",
                                        width: "100%"
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: "unset" }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <span>
                                        {item.text}
                                    </span>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))
                ) : null}
            </List>
        </Drawer>
    );
}

export default DrawerNavbar;
