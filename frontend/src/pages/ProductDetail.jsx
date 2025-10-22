import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { FaUserCircle, FaEnvelope, FaPhone } from 'react-icons/fa';

const fetchProduct = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

const fetchSellerContact = async (id) => {
    const { data } = await api.get(`/interests/${id}/seller-contact`);
    return data;
};

const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showContact, setShowContact] = useState(false);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
    });
    
    const { data: sellerContact, isLoading: isLoadingContact } = useQuery({
        queryKey: ['sellerContact', id],
        queryFn: () => fetchSellerContact(id),
        enabled: showContact, // Only fetch when showContact is true
    });

    const interestMutation = useMutation({
        mutationFn: () => api.post(`/interests/${id}/show`),
        onSuccess: () => {
            toast.success('Interest shown! You can now see the seller`s contact info.');
            queryClient.invalidateQueries(['product', id]);
            setShowContact(true);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Could not show interest.');
        }
    });

    const handleShowInterest = () => {
        if (!user) {
            toast.error("Please login to show interest.");
            return;
        }
        interestMutation.mutate();
    };
    
    const isInterested = product?.interestedBuyers?.includes(user?._id);
    const isSeller = product?.seller?._id === user?._id;

    if (isLoading) return <div className="flex justify-center mt-10"><Spinner size="lg" /></div>;
    if (error) return <div className="text-center text-error">Error: {error.message}</div>;

    return (
        <div className="card lg:card-side bg-base-100 shadow-xl">
            <div className="lg:w-1/2">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                >
                    {product.images.map(img => (
                        <SwiperSlide key={img.public_id}>
                            <img src={img.url} alt={product.title} className="w-full h-96 object-cover" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="card-body lg:w-1/2">
                {product.status === 'sold' && <div className="badge badge-error">SOLD</div>}
                <h1 className="card-title text-3xl">{product.title}</h1>
                <p className="text-2xl font-bold text-primary">?{product.price.toLocaleString('en-IN')}</p>
                <div className="flex gap-2 my-2">
                    <div className="badge badge-outline">{product.category}</div>
                    <div className="badge badge-outline">{product.condition}</div>
                </div>
                <p className="py-4">{product.description}</p>
                
                <div className="divider">Seller Information</div>
                <div className="p-4 bg-base-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <FaUserCircle className="text-2xl" />
                        <div>
                            <div className="font-bold">{product.seller.name}</div>
                            <div className="text-sm opacity-50">{product.seller.batch} Batch, {product.seller.department}</div>
                        </div>
                    </div>
                     { (isInterested || isSeller || showContact) && (
                        <div className="mt-4 space-y-2">
                            {isLoadingContact && <Spinner size="sm" />}
                            {sellerContact && (
                                <>
                                    <p className="flex items-center"><FaEnvelope className="mr-2" /> {sellerContact.email}</p>
                                    <p className="flex items-center"><FaPhone className="mr-2" /> {sellerContact.phone}</p>
                                </>
                            )}
                        </div>
                     )}
                </div>

                <div className="card-actions justify-end mt-4">
                    { isSeller ? (
                        <Link to={`/product/${id}/edit`} className="btn btn-secondary">Edit Your Listing</Link>
                    ) : (
                        isInterested ? (
                            <button className="btn btn-success" disabled>Already Interested</button>
                        ) : (
                             <button onClick={handleShowInterest} className="btn btn-primary" disabled={interestMutation.isPending || product.status === 'sold'}>
                                {interestMutation.isPending ? <Spinner size="sm"/> : "Show Interest"}
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
