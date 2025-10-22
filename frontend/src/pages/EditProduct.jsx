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

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
    });

    const updateMutation = useMutation({
        mutationFn: (updatedProduct) => api.put(`/products/${id}`, updatedProduct),
        onSuccess: () => {
            toast.success("Product updated successfully!");
            queryClient.invalidateQueries(['product', id]);
            queryClient.invalidateQueries(['products']);
            navigate(`/product/${id}`);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update product.");
        }
    });

    const onSubmit = (data) => {
        updateMutation.mutate(data);
    };

    if (isLoading) return <div className="flex justify-center mt-10"><Spinner size="lg" /></div>;
    if (error) return <div className="text-center text-error">Error: {error.message}</div>;

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
