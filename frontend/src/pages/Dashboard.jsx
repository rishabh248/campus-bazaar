import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Added useMutation, useQueryClient
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast'; // Added toast
import { FaEdit, FaTrash, FaEye, FaBoxOpen, FaCheckCircle, FaHeart } from 'react-icons/fa';

const StatCard = ({ icon, title, value, isLoading }) => (
    <div className="card bg-base-100 shadow">
        <div className="card-body flex-row items-center">
            <div className="p-3 bg-primary/20 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <div className="text-gray-500">{title}</div>
                {isLoading ? <span className="loading loading-xs"></span> : <div className="text-2xl font-bold">{value}</div>}
            </div>
        </div>
    </div>
);


const Dashboard = () => {
    const queryClient = useQueryClient(); // Added queryClient

    const { data: myProducts, isLoading: isLoadingMyProducts } = useQuery({
        queryKey: ['myProducts'],
        queryFn: () => api.get('/products/my').then(res => res.data),
    });

     // Delete Mutation (copied from AdminPanel.jsx logic)
    const deleteProductMutation = useMutation({
        mutationFn: (prodId) => api.delete(`/products/${prodId}`), // Use standard product delete endpoint
        onSuccess: () => {
            toast.success('Product deleted.');
            queryClient.invalidateQueries({ queryKey: ['myProducts'] }); // Invalidate myProducts query
             queryClient.invalidateQueries({ queryKey: ['allProducts'] }); // Also invalidate allProducts if needed elsewhere
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete product.')
    });

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product listing?')) {
             deleteProductMutation.mutate(productId);
        }
    };


    const totalListings = myProducts?.length || 0;
    const activeListings = myProducts?.filter(p => p.status === 'available').length || 0;
    const totalInterest = myProducts?.reduce((acc, p) => acc + (p.interestedBuyers?.length || 0), 0) || 0; // Safer reduce

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">My Listings</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<FaBoxOpen className="text-2xl text-primary" />} title="Total Listings" value={totalListings} isLoading={isLoadingMyProducts}/>
                <StatCard icon={<FaCheckCircle className="text-2xl text-primary" />} title="Active Listings" value={activeListings} isLoading={isLoadingMyProducts}/>
                <StatCard icon={<FaHeart className="text-2xl text-primary" />} title="Total Interest" value={totalInterest} isLoading={isLoadingMyProducts}/>
            </div>

            <h2 className="text-3xl font-bold mb-6">Your Products</h2>

            {isLoadingMyProducts ? <div className="flex justify-center"><Spinner /></div> :
            totalListings === 0 ? (
                <div className="text-center py-16 bg-base-200 rounded-box">
                    <div className="text-5xl text-gray-400 mb-4">
                        <FaBoxOpen className="inline-block" />
                    </div>
                    <h3 className="text-xl font-semibold">No listings yet</h3>
                    <p className="text-base-content/70 mt-2">Start selling by creating your first listing</p>
                    <Link to="/sell" className="btn btn-primary mt-6">Create Listing</Link>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-box shadow">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Interested</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myProducts.map(p => (
                                <tr key={p._id} className="hover">
                                    <td className="max-w-xs truncate">{p.title}</td>
                                    <td>?{p.price}</td>
                                    <td><span className={`badge ${p.status === 'sold' ? 'badge-ghost' : 'badge-success'}`}>{p.status}</span></td>
                                    <td>{p.interestedBuyers?.length || 0}</td>
                                    <td className="flex gap-1 md:gap-2">
                                        <Link to={`/product/${p._id}`} className="btn btn-xs btn-outline btn-info" aria-label="View Product"><FaEye /></Link>
                                        <Link to={`/product/${p._id}/edit`} className="btn btn-xs btn-outline btn-warning" aria-label="Edit Product"><FaEdit /></Link>
                                        <button onClick={() => handleDelete(p._id)} className="btn btn-xs btn-outline btn-error" disabled={deleteProductMutation.isPending} aria-label="Delete Product"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
