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
        const email = data.email.toLowerCase();
        const year = email.substring(0, 2);
        const batch = `20${year}`;

        const match = email.match(/^\d{2}([a-zA-Z]+)\d{3}/i);
        const branchCode = match ? match[1].toUpperCase() : '';
        
        let department = 'SM';
        if (branchCode === 'BEC') department = 'ECE';
        else if (branchCode === 'BCS') department = 'CSE';
        else if (branchCode === 'BME') department = 'ME';
        else if (branchCode === 'BDS') department = 'Design';
        
        const fullData = { ...data, batch, department };
        try {
            await registerUser(fullData);
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    const validateEmailRules = (v) => {
        const email = v.toLowerCase();
        const basicRegex = /^\d{2}([a-zA-Z]+)\d{3}@iiitdmj\.ac\.in$/;
        const match = email.match(basicRegex);

        if (!match) return 'Invalid IIITDMJ email format.';

        const year = parseInt(email.substring(0, 2), 10);
        const branch = match[1];
        const roll = parseInt(email.slice(-15, -12), 10);

        if (year < 21 || year > 25) return 'Registration year must be between 21 and 25.';

        switch (branch) {
            case 'bec':
                if (roll < 0 || roll > 150) return 'BEC roll number must be between 0 and 150.';
                break;
            case 'bcs':
                if (roll < 0 || roll > 350) return 'BCS roll number must be between 0 and 350.';
                break;
            case 'bsm':
            case 'bme':
            case 'bds':
                if (roll < 0 || roll > 99) return 'Roll number for this branch must be under 100.';
                break;
            default:
                return 'Invalid branch code in email.';
        }
        return true;
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
            <div className="card w-full max-w-lg shadow-2xl bg-base-100">
                 <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Join Campus Bazaar</h1>
                        <p className="text-base-content/70 mt-1">Create your account to start buying and selling</p>
                    </div>

                    <div className="form-control">
                        <label htmlFor="name" className="label"><span className="label-text">Full Name</span></label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            {...register("name", { required: "Name is required" })}
                             className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                             aria-invalid={errors.name ? "true" : "false"}
                         />
                        {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
                    </div>
                    <div className="form-control">
                        <label htmlFor="email" className="label"><span className="label-text">IIITDMJ Email</span></label>
                        <input
                            id="email"
                            type="email"
                            placeholder="24bec103@iiitdmj.ac.in"
                            {...register("email", {
                                required: "Email is required",
                                validate: validateEmailRules
                            })}
                             className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                             aria-invalid={errors.email ? "true" : "false"}
                         />
                        <label className="label"><span className="label-text-alt text-error">{errors.email ? errors.email.message : ""}</span></label>
                    </div>
                     <div className="form-control">
                        <label htmlFor="phone" className="label"><span className="label-text">Phone Number</span></label>
                        <input
                             id="phone"
                            type="tel"
                            placeholder="9876543210"
                            {...register("phone", { required: "Phone is required", pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit number"} })}
                             className={`input input-bordered ${errors.phone ? 'input-error' : ''}`}
                             aria-invalid={errors.phone ? "true" : "false"}
                        />
                         {errors.phone && <span className="text-error text-xs mt-1">{errors.phone.message}</span>}
                    </div>
                     <div className="form-control">
                        <label htmlFor="password" className="label"><span className="label-text">Password</span></label>
                        <input
                            id="password"
                            type="password"
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" }})}
                            className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                             aria-invalid={errors.password ? "true" : "false"}
                        />
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
