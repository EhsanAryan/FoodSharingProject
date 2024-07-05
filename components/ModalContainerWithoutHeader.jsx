import { Modal, Box, Fade } from '@mui/material';
import React from 'react';

const ModalContainerWithoutHeader = ({
    isOpen,
    setIsOpen,
    fullscreen,
    className,
    children,
    keepMounted,
    blur
}) => {

    return (
        <Modal
            open={isOpen}
            sx={{
                zIndex: 2000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: {
                    xs: "0.75rem",
                    sm: "1.75rem",
                    xl: "2.75rem"
                },
                py: "1.5rem",
                backdropFilter: blur ? "blur(5px)" : "",
            }}
            keepMounted={keepMounted}
            onClick={() => setIsOpen(false)}
        >
            <Fade in={isOpen}>
                <Box className={`overflow-auto relative outline-none
                ${fullscreen ? "w-full h-full" : ""}
                ${className || ""}`}
                    onClick={(ev) => ev.stopPropagation()}
                >
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
}

export default ModalContainerWithoutHeader;
