import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="text-center py-20 flex flex-col items-center">
             <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
             <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
             <p className="mb-6 text-lg text-base-content/70">Oops! The page you are looking for does not exist.</p>
             <Link to="/" className="btn btn-primary">Go Back Home</Link>
        </div>
    );
};

export default NotFound;
