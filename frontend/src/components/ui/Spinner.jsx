import React from 'react';

const Spinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'loading-sm',
        md: 'loading-md',
        lg: 'loading-lg'
    };
    return (
        <span
            className={`loading loading-spinner text-primary ${sizeClasses[size]}`}
            role="status"
            aria-live="polite"
        >
            <span className="sr-only">Loading...</span>
        </span>
    );
};

export default Spinner;
