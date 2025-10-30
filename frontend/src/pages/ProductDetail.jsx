import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { FaUserCircle, FaEnvelope, FaPhone, FaComments } from 'react-icons/fa';

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
    const navigate = useNavigate();
    const [showContact, setShowContact] = useState(false);

    const { data: product, isLoading, error, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
        retry: 1,
    });

    const { data: sellerContact, isLoading: isLoadingContact } = useQuery({
        queryKey: ['sellerContact', id],
        queryFn: () => fetchSellerContact(id),
        enabled: showContact,
        retry: 1,
    });

     const startChatMutation = useMutation({
        mutationFn: (productId) => api.post('/chat', { productId }),
        onSuccess: (data) => {
            const conversationId = data.data._id;
            navigate('/chat', { state: { selectedConversationId: conversationId } });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Could not start chat.');
        }
    });


    const interestMutation = useMutation({
        mutationFn: () => api.post(`/interests/${id}/show`),
        onSuccess: () => {
            toast.success('Interest shown! Seller notified.');
            queryClient.invalidateQueries({ queryKey: ['product', id] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Could not show interest.');
        }
    });

    const handleShowInterest = () => {
        if (!user) {
            toast.error("Please login to show interest.");
            navigate('/login', { state: { from: `/product/${id}` } });
            return;
        }
        interestMutation.mutate();
    };

    const handleStartChat = () => {
         if (!user) {
            toast.error("Please login to start chat.");
             navigate('/login', { state: { from: `/product/${id}` } });
            return;
        }
        if (product) {
             startChatMutation.mutate(product._id);
        }
    };


    const isInterested = product?.interestedBuyers?.includes(user?._id);
    const isSeller = product?.seller?._id === user?._id;

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
    if (isError || !product) return <div className="text-center text-error p-10">Error loading product: {error?.message || 'Not Found'}</div>;

    return (
        <div className="card lg:card-side bg-base-100 shadow-xl">
            <div className="lg:w-1/2">
                 {product.images && product.images.length > 0 ? (
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none w-full h-96"
                    >
                        {product.images.map(img => (
                            <SwiperSlide key={img.public_id}>
                                <img src={img.url} alt={product.title} className="w-full h-full object-contain bg-gray-100" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                 ) : (
                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
                        <span>No Image Available</span>
                    </div>
                 )}
            </div>
            <div className="card-body lg:w-1/2">
                {product.status === 'sold' && <div className="badge badge-error font-semibold">SOLD</div>}
                <h1 className="card-title text-3xl mb-2">{product.title}</h1>
                <p className="text-2xl font-bold text-primary mb-3">&#8377;{product.price.toLocaleString('en-IN')}</p>
                <div className="flex gap-2 mb-4">
                    <div className="badge badge-outline">{product.category}</div>
                    <div className="badge badge-outline">{product.condition}</div>
                </div>
                <p className="py-4 text-base-content/90 whitespace-pre-wrap">{product.description}</p>

                <div className="divider my-4">Seller Information</div>
                <div className="p-4 bg-base-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <FaUserCircle className="text-3xl text-gray-400" />
                        <div>
                            <div className="font-bold">{product.seller.name}</div>
                            <div className="text-sm opacity-50">{product.seller.batch} Batch, {product.seller.department}</div>
                        </div>
                    </div>
                     { (isInterested || isSeller) && (
                        <div className="mt-4 space-y-2">
                             {!showContact && !isSeller && (
                                <button onClick={() => setShowContact(true)} className="btn btn-sm btn-outline">Show Contact Info</button>
                             )}
                            {showContact && (
                                <>
                                    {isLoadingContact && <Spinner size="sm" />}
                                    {sellerContact && (
                                        <>
                                            <p className="flex items-center gap-2"><FaEnvelope /> {sellerContact.email}</p>
                                            <p className="flex items-center gap-2"><FaPhone /> {sellerContact.phone}</p>
                                        </>
                                    )}
                                </>
                             )}
                        </div>
                     )}
                </div>

                <div className="card-actions justify-end mt-6">
                    { isSeller ? (
                        <Link to={`/product/${id}/edit`} className="btn btn-secondary">Edit Your Listing</Link>
                    ) : (
                         <>
                            {!isInterested && (
                                 <button onClick={handleShowInterest} className="btn btn-primary" disabled={interestMutation.isPending || product.status === 'sold'}>
                                    {interestMutation.isPending ? <Spinner size="sm"/> : "Show Interest"}
                                </button>
                            )}
                            {isInterested && product.status === 'available' && (
                                <button onClick={handleStartChat} className="btn btn-accent ml-2" disabled={startChatMutation.isPending}>
                                    {startChatMutation.isPending ? <Spinner size="sm" /> : <> <FaComments className="mr-2" /> Start Chat </>}
                                </button>
                             )}
                             {isInterested && product.status === 'sold' && (
                                <button className="btn btn-disabled ml-2">Item Sold</button>
                             )}
                         </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;