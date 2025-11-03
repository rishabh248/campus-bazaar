import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        const authError = searchParams.get('error');
        if (authError) {
            toast.error('Google Auth Failed. Please use your @iiitdmj.ac.in email.');
        }
    }, [searchParams]);
    
    const googleLoginUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/google`;

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <div className="card-body">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Welcome to Campus Bazaar</h1>
                        <p className="text-base-content/70 mt-1">Please sign in with your IIITDMJ Google account to continue.</p>
                    </div>
                    
                    <a href={googleLoginUrl} className="btn btn-primary">
                        <FaGoogle className="mr-2" />
                        Sign in with Google
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;