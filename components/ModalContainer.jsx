import { Modal, Box, IconButton, Fade, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';



const ModalContainer = ({
    alwaysOpen,
    isOpen,
    setIsOpen,
    fullscreen,
    title,
    className,
    sx,
    children,
    onClose
}) => {
    const navigate = useNavigate();

    return (
        <Modal
            open={alwaysOpen || isOpen}
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
                py: "1.5rem"
            }}
            keepMounted
            onClick={onClose ? () => onClose() : alwaysOpen ? () => { } : () => setIsOpen(false)}
        >
            <Fade in={alwaysOpen || isOpen}>
                <Box className={`bg-white
                border-2 border-black
                rounded-lg max-h-full overflow-auto
                dir-ltr relative
                ${fullscreen ? "w-full h-full" : "container mx-auto max-w-screen-md"}
                ${className || ""}`}
                    onClick={(ev) => ev.stopPropagation()}
                >
                    <Box
                        className="sticky top-0 right-0
                        flex justify-between items-center
                        w-full h-10 ps-4 pe-2 py-8 overflow-hidden
                        border-b border-black bg-gray-200"
                        sx={{
                            zIndex: 2000
                        }}
                    >
                        <Typography variant="h6"
                            sx={{
                                wordBreak: "break-all"
                            }}
                        >
                            {title}
                        </Typography>
                        <IconButton
                            onClick={onClose ? () => onClose() : alwaysOpen ? () => navigate(-1) : () => setIsOpen(false)}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            px: {
                                xs: "1.75rem",
                                sm: "2.75rem",
                                md: "3rem"
                            },
                            pt: "2rem",
                            pb: "1.75rem",
                            ...sx
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
}

export default ModalContainer;
