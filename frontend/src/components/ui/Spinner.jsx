import React from 'react';

const Spinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'loading-sm',
        md: 'loading-md',
        lg: 'loading-lg'
    };
    return <span className={`loading loading-spinner text-primary ${sizeClasses[size]}`}></span>;
};

export default Spinner;
