import { Button, CircularProgress } from '@mui/material';
import React from 'react';

const SubmitButton = ({ formik, text, disabledButton, variant, color, sx }) => {
    return (
        <Button
            type="submit"
            variant={variant || "contained"}
            color={color || "inherit"}
            disabled={disabledButton ? !formik.isValid : false}
            sx={{
                pointerEvents: formik.isSubmitting ? "none" : "auto",
                ...sx
            }}
        >
            {formik.isSubmitting ? (
                <CircularProgress
                    color="inherit"
                    size={30}
                />
            ) : text}
        </Button>
    );
}

export default SubmitButton;
