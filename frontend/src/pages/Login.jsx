import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';
import Spinner from '../components/ui/Spinner'; 

const Login = () => {
    const { login, user, loading } = useAuth(); 
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const from = location.state?.from?.pathname || '/dashboard';
    
    useEffect(() => {
        const authError = searchParams.get('error');
        if (authError) {
            toast.error('Google Auth Failed. Please use your @iiitdmj.ac.in email.');
        }
    }, [searchParams]);

    
    useEffect(() => {
        if (!loading && user) {
            navigate(from, { replace: true }); 
        }
    }, [user, loading, navigate, from]);
    
    const googleLoginUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/google`;

    if (loading) {
         return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
    }

    return (
        !user && (
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
        )
    );
};

export default Login;