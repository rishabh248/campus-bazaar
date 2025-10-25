import React from 'react';
import { useForm } from 'react-hook-form';

const ProductForm = ({ onSubmit, defaultValues, isSubmitting, buttonText = "Submit" }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="title" className="label"><span className="label-text">Title</span></label>
                <input
                    id="title"
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                    aria-invalid={errors.title ? "true" : "false"}
                />
                {errors.title && <span className="text-error text-sm mt-1">{errors.title.message}</span>}
            </div>
            <div>
                <label htmlFor="description" className="label"><span className="label-text">Description</span></label>
                <textarea
                    id="description"
                    {...register('description', { required: 'Description is required' })}
                    className={`textarea textarea-bordered w-full h-32 ${errors.description ? 'textarea-error' : ''}`}
                    aria-invalid={errors.description ? "true" : "false"}
                ></textarea>
                {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
            </div>
            <div>
                <label htmlFor="price" className="label"><span className="label-text">Price (?)</span></label>
                <input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price', {
                        required: 'Price is required',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Price cannot be negative' }
                    })}
                    className={`input input-bordered w-full ${errors.price ? 'input-error' : ''}`}
                    aria-invalid={errors.price ? "true" : "false"}
                />
                {errors.price && <span className="text-error text-sm mt-1">{errors.price.message}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="label"><span className="label-text">Category</span></label>
                    <select
                        id="category"
                        {...register('category', { required: 'Category is required' })}
                        className={`select select-bordered w-full ${errors.category ? 'select-error' : ''}`}
                        aria-invalid={errors.category ? "true" : "false"}
                    >
                        <option value="">Select Category</option>
                        <option>Electronics</option>
                        <option>Books</option>
                        <option>Furniture</option>
                        <option>Vehicles</option>
                        <option>Other</option>
                    </select>
                    {errors.category && <span className="text-error text-sm mt-1">{errors.category.message}</span>}
                </div>
                 <div>
                    <label htmlFor="condition" className="label"><span className="label-text">Condition</span></label>
                    <select
                        id="condition"
                        {...register('condition', { required: 'Condition is required' })}
                        className={`select select-bordered w-full ${errors.condition ? 'select-error' : ''}`}
                        aria-invalid={errors.condition ? "true" : "false"}
                    >
                        <option value="">Select Condition</option>
                        <option>New</option>
                        <option>Used - Like New</option>
                        <option>Used - Good</option>
                        <option>Used - Fair</option>
                    </select>
                    {errors.condition && <span className="text-error text-sm mt-1">{errors.condition.message}</span>}
                </div>
            </div>
            {defaultValues && (
                <div>
                    <label htmlFor="status" className="label"><span className="label-text">Status</span></label>
                    <select
                        id="status"
                        {...register('status')}
                        className="select select-bordered w-full"
                    >
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                    </select>
                </div>
            )}
            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting && <span className="loading loading-spinner mr-2"></span>}
                {isSubmitting ? 'Submitting...' : buttonText}
            </button>
        </form>
    );
};

export default ProductForm;
