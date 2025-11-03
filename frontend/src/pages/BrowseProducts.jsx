import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/ui/Spinner';
import { FaSearch } from 'react-icons/fa';

const BrowseProductsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');

    const fetchProducts = async () => {
        const params = new URLSearchParams();
        params.append('status', 'available');
        if (searchTerm) params.append('search', searchTerm);
        if (category) params.append('category', category);
        if (sortBy) params.append('sortBy', sortBy);

        const { data } = await api.get(`/products?${params.toString()}`);
        return data;
    };

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['allProducts', searchTerm, category, sortBy],
        queryFn: fetch.p,
        refetchOnWindowFocus: false, 
    });

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Browse All Listings</h1>
                <p className="text-lg mt-2 text-base-content/70">Find what you need from your campus community.</p>
            </div>

            <div className="mb-8 p-4 bg-base-200 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="form-control md:col-span-1">
                     <div className="join w-full">
                        <input
                            type="text"
                            placeholder="Search for items..."
                            className="input input-bordered join-item w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-primary join-item"><FaSearch /></button>
                     </div>
                </div>
                <div className="form-control">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="select select-bordered w-full">
                        <option value="">All Categories</option>
                        <option>Electronics</option>
                        <option>Books</option>
                        <option>Furniture</option>
                        <option>Vehicles</option>
                        <option>Other</option>
                    </select>
                </div>
                 <div className="form-control">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select select-bordered w-full">
                        <option value="date-desc">Sort by: Newest</option>
                        <option value="price-asc">Sort by: Price (Low to High)</option>
                        <option value="price-desc">Sort by: Price (High to Low)</option>
                    </select>
                </div>
            </div>

            {isLoading && <div className="flex justify-center mt-10"><Spinner size="lg"/></div>}
            {error && <div className="text-center text-error">Error fetching products: {error.message}</div>}
            {!isLoading && !error && (
                products?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-base-300 rounded-box">
                        <h2 className="text-2xl font-semibold">No Products Found</h2>
                        <p className="mt-2">Try adjusting your search or filters.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default BrowseProductsPage;