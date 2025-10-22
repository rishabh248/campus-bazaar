import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // Mocking batch and department as they are not in the new UI form
        const fullData = { ...data, batch: '2025', department: 'CSE' };
        try {
            await registerUser(fullData);
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="card w-full max-w-lg shadow-2xl bg-base-100">
                 <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Join Campus Bazaar</h1>
                        <p className="text-base-content/70">Create your account to start buying and selling</p>
                    </div>
                    
                    <div className="form-control">
                        <label className="label"><span className="label-text">Full Name</span></label>
                        <input type="text" placeholder="John Doe" {...register("name", { required: "Name is required" })} className={`input input-bordered ${errors.name ? 'input-error' : ''}`} />
                        {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" placeholder="rollnumber@iiitdmj.ac.in" {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@iiitdmj\.ac\.in$/, message: "Must be a valid @iiitdmj.ac.in email" }})} className={`input input-bordered ${errors.email ? 'input-error' : ''}`} />
                        <label className="label"><span className="label-text-alt">{errors.email ? errors.email.message : "Must be a valid @iiitdmj.ac.in email"}</span></label>
                    </div>
                     <div className="form-control">
                        <label className="label"><span className="label-text">Phone Number</span></label>
                        <input type="tel" placeholder="9876543210" {...register("phone", { required: "Phone is required" })} className={`input input-bordered ${errors.phone ? 'input-error' : ''}`} />
                         {errors.phone && <span className="text-error text-xs mt-1">{errors.phone.message}</span>}
                    </div>
                     <div className="form-control">
                        <label className="label"><span className="label-text">Password</span></label>
                        <input type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" }})} className={`input input-bordered ${errors.password ? 'input-error' : ''}`} />
                        <label className="label"><span className="label-text-alt">{errors.password ? errors.password.message : "Minimum 6 characters"}</span></label>
                    </div>
                     
                    <div className="form-control mt-6">
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <span className="loading loading-spinner"></span> : "Create Account"}
                        </button>
                    </div>
                     <div className="text-center mt-4 text-sm">
                        <p>Already have an account? <Link to="/login" className="link link-primary">Login here</Link></p>
                    </div>
                 </form>
            </div>
        </div>
    );
};

export default Register;
