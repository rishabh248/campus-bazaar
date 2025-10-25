import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard'; // Redirect to dashboard on successful login

    const onSubmit = async (formData) => {
        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Login to Campus Bazaar</h1>
                        <p className="text-base-content/70 mt-1">Use your IIITDM Jabalpur email</p>
                    </div>
                    <div className="form-control">
                        <label htmlFor="email" className="label"><span className="label-text">Email</span></label>
                        <input
                            id="email"
                            type="email"
                            placeholder="rollnumber@iiitdmj.ac.in"
                            {...register("email", { required: "Email is required" })}
                            className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                            aria-invalid={errors.email ? "true" : "false"}
                         />
                        {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
                    </div>
                    <div className="form-control">
                        <label htmlFor="password"className="label"><span className="label-text">Password</span></label>
                        <input
                            id="password"
                            type="password"
                            placeholder="password"
                            {...register("password", { required: "Password is required" })}
                             className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                             aria-invalid={errors.password ? "true" : "false"}
                        />
                         {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <span className="loading loading-spinner"></span> : "Login"}
                        </button>
                    </div>
                     <div className="text-center mt-4 text-sm">
                        <p>Don't have an account? <Link to="/register" className="link link-primary">Register here</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
