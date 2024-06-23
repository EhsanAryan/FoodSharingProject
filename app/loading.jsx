import { CircularProgress } from '@mui/material';
import React from 'react';

const Loading = () => {
    return (
        <div className="mt-12 mb-10 w-full flex flex-col gap-3 justify-center items-center">
            <CircularProgress
                size={40}
                sx={{
                    color: "#f16d01"
                }}
            />
            <span className="text-primary text-lg">
                لطفاً صبر کنید...
            </span>
        </div>
    );
}

export default Loading;
