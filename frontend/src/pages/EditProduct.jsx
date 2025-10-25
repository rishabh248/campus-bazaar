import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';
import ProductForm from '../components/products/ProductForm';

const fetchProduct = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: product, isLoading, error, isError } = useQuery({ // Added isError
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
        retry: 1 // Retry only once on error
    });

    const updateMutation = useMutation({
        mutationFn: (updatedProduct) => api.put(`/products/${id}`, updatedProduct),
        onSuccess: (data) => { // Access updated data if needed
            toast.success("Product updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['product', id] });
            queryClient.invalidateQueries({ queryKey: ['myProducts'] }); // Also invalidate user's product list
            queryClient.invalidateQueries({ queryKey: ['allProducts'] }); // And global product list
            navigate(`/product/${id}`);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update product.");
        }
    });

    const onSubmit = (data) => {
        updateMutation.mutate(data);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
     }

    if (isError || !product) { // Handle case where product fetch fails or returns no data
        return <div className="text-center text-error p-10">Error loading product data: {error?.message || 'Product not found'}</div>;
     }


    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Edit Your Listing</h1>
            <ProductForm
                onSubmit={onSubmit}
                defaultValues={product}
                isSubmitting={updateMutation.isPending}
                buttonText="Save Changes"
            />
        </div>
    );
};

export default EditProduct;
