import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
            <p className="mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="btn btn-primary mt-6">Go Back Home</Link>
        </div>
    );
};

export default NotFound;
