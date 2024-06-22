import React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ShowError = ({ children }) => {
    return (
        <small className="bg-red-500 text-white px-1 py-0.5 rounded-md 
        mb-3 mt-2 whitespace-pre-line flex gap-1 items-center max-w-[300px]">
            <ErrorOutlineIcon sx={{ fontSize: "1rem" }}  />
            {children}
        </small>
    );
}

export default ShowError;
