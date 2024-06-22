import { CircularProgress } from '@mui/material';
import React from 'react';

const Loading = ({ size, color, text, className, noText }) => {
    return (
        <div className={`w-full flex flex-col gap-3 justify-center items-center ${className || ""}`}>
            <CircularProgress
                size={size || 40}
                sx={{
                    color: color || "#f16d01"
                }}
            />
            {!noText ? (
                <span className="text-primary text-lg">
                    {text || "لطفاً صبر کنید..."}
                </span>
            ) : null}
        </div>
    );
}

export default Loading;
