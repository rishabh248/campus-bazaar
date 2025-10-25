import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';
import { FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const queryClient = useQueryClient();

    const { data: users, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['allUsers'],
        queryFn: () => api.get('/admin/users').then(res => res.data)
    });

    const { data: products, isLoading: isLoadingProducts } = useQuery({
        queryKey: ['allProducts'],
        queryFn: () => api.get('/admin/products').then(res => res.data)
    });

    const deleteUserMutation = useMutation({
        mutationFn: (userId) => api.delete(`/admin/users/${userId}`),
        onSuccess: () => { toast.success('User deleted.'); queryClient.invalidateQueries({ queryKey: ['allUsers'] }); },
        onError: (err) => toast.error(err.response?.data?.message)
    });

    const deleteProductMutation = useMutation({
        mutationFn: (prodId) => api.delete(`/admin/products/${prodId}`),
        onSuccess: () => { toast.success('Product deleted.'); queryClient.invalidateQueries({ queryKey: ['allProducts'] }); },
        onError: (err) => toast.error(err.response?.data?.message)
    });

    const toggleFeatureMutation = useMutation({
        mutationFn: (prodId) => api.put(`/admin/products/${prodId}/feature`),
        onSuccess: () => { toast.success('Feature status toggled.'); queryClient.invalidateQueries({ queryKey: ['allProducts'] }); },
        onError: (err) => toast.error(err.response?.data?.message)
    });

    const renderUsers = () => (
        isLoadingUsers ? <Spinner/> :
        <div className="overflow-x-auto"><table className="table w-full">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>{users.map(u => (
                <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                <td><button onClick={() => deleteUserMutation.mutate(u._id)} className="btn btn-xs btn-error" disabled={deleteUserMutation.isPending}><FaTrash/></button></td>
                </tr>
            ))}</tbody>
        </table></div>
    );

     const renderProducts = () => (
        isLoadingProducts ? <Spinner/> :
        <div className="overflow-x-auto"><table className="table w-full">
            <thead><tr><th>Title</th><th>Seller</th><th>Price</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>{products.map(p => (
                <tr key={p._id}>
                    <td>{p.title}</td><td>{p.seller.name}</td><td>?{p.price}</td>
                    <td><button onClick={() => toggleFeatureMutation.mutate(p._id)} className="btn btn-xs btn-ghost">{p.isFeatured ? <FaToggleOn className="text-success text-lg"/> : <FaToggleOff className="text-lg"/>}</button></td>
                    <td><button onClick={() => deleteProductMutation.mutate(p._id)} className="btn btn-xs btn-error" disabled={deleteProductMutation.isPending}><FaTrash/></button></td>
                </tr>
            ))}</tbody>
        </table></div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
            <div role="tablist" className="tabs tabs-lifted">
                <a role="tab" className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`} onClick={() => setActiveTab('users')}>Manage Users ({users?.length || 0})</a>
                <a role="tab" className={`tab ${activeTab === 'products' ? 'tab-active' : ''}`} onClick={() => setActiveTab('products')}>Manage Products ({products?.length || 0})</a>
            </div>
            <div className="p-4 bg-base-200 rounded-b-box">
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'products' && renderProducts()}
            </div>
        </div>
    );
};

export default AdminPanel;
