import React from 'react';
import { useForm } from 'react-hook-form';

const ProductForm = ({ onSubmit, defaultValues, isSubmitting, buttonText = "Submit" }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="label"><span className="label-text">Title</span></label>
                <input type="text" {...register('title', { required: 'Title is required' })} className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`} />
                {errors.title && <span className="text-error text-sm">{errors.title.message}</span>}
            </div>
            <div>
                <label className="label"><span className="label-text">Description</span></label>
                <textarea {...register('description', { required: 'Description is required' })} className={`textarea textarea-bordered w-full h-32 ${errors.description ? 'textarea-error' : ''}`}></textarea>
                {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
            </div>
            <div>
                <label className="label"><span className="label-text">Price (?)</span></label>
                <input type="number" {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })} className={`input input-bordered w-full ${errors.price ? 'input-error' : ''}`} />
                {errors.price && <span className="text-error text-sm">{errors.price.message}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label"><span className="label-text">Category</span></label>
                    <select {...register('category', { required: 'Category is required' })} className={`select select-bordered w-full ${errors.category ? 'select-error' : ''}`}>
                        <option value="">Select Category</option>
                        <option>Electronics</option>
                        <option>Books</option>
                        <option>Furniture</option>
                        <option>Vehicles</option>
                        <option>Other</option>
                    </select>
                    {errors.category && <span className="text-error text-sm">{errors.category.message}</span>}
                </div>
                 <div>
                    <label className="label"><span className="label-text">Condition</span></label>
                    <select {...register('condition', { required: 'Condition is required' })} className={`select select-bordered w-full ${errors.condition ? 'select-error' : ''}`}>
                        <option value="">Select Condition</option>
                        <option>New</option>
                        <option>Used - Like New</option>
                        <option>Used - Good</option>
                        <option>Used - Fair</option>
                    </select>
                    {errors.condition && <span className="text-error text-sm">{errors.condition.message}</span>}
                </div>
            </div>
             {defaultValues && ( // Only show status on edit form
                <div>
                    <label className="label"><span className="label-text">Status</span></label>
                    <select {...register('status')} className="select select-bordered w-full">
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                    </select>
                </div>
            )}
            
            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting && <span className="loading loading-spinner"></span>}
                {buttonText}
            </button>
        </form>
    );
};

export default ProductForm;
