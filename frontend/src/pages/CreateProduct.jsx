import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductForm from '../components/products/ProductForm';
import { FaUpload, FaTrash } from 'react-icons/fa';

const CreateProduct = () => {
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const createProductMutation = useMutation({
        mutationFn: (newProduct) => api.post('/products', newProduct),
        onSuccess: (data) => {
            toast.success("Product created successfully!");
            queryClient.invalidateQueries({ queryKey: ['myProducts'] }); // Invalidate myProducts as well
            queryClient.invalidateQueries({ queryKey: ['allProducts'] });
            navigate(`/product/${data.data._id}`);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create product.");
        }
    });

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        if (files.length + images.length > 5) {
            toast.error("You can only upload a maximum of 5 images.");
            return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append('images', file));

        setIsUploading(true);
        try {
            const { data } = await api.post('/upload/images', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImages(prev => [...prev, ...data]);
            toast.success(`${files.length} image(s) uploaded.`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Image upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = (data) => {
        if (images.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }
        createProductMutation.mutate({ ...data, images });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Sell Your Item</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                     <h3 className="text-xl font-semibold mb-2">Upload Images (Max 5)</h3>
                     <div className="form-control w-full">
                        <label htmlFor="imageUpload" className="label"><span className="label-text">Select Images</span></label>
                        <input id="imageUpload" type="file" multiple accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered w-full" disabled={isUploading || images.length >= 5} />
                        {isUploading && <progress className="progress w-full mt-2"></progress>}
                     </div>
                     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2 mt-4">
                        {images.map((img, index) => (
                            <div key={img.public_id || index} className="relative aspect-square">
                                <img src={img.url} alt={`Upload preview ${index + 1}`} className="w-full h-full object-cover rounded shadow" />
                                <button onClick={() => removeImage(index)} className="btn btn-xs btn-circle btn-error absolute -top-2 -right-2" aria-label={`Remove image ${index + 1}`}><FaTrash/></button>
                            </div>
                        ))}
                     </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">Item Details</h3>
                    <ProductForm onSubmit={onSubmit} isSubmitting={createProductMutation.isPending} buttonText="Create Listing" />
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
