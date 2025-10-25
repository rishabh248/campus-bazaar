import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaComments, FaBoxes, FaCheckCircle } from 'react-icons/fa';

const Hero = () => (
    <div className="hero min-h-[60vh] bg-hero-pattern bg-cover bg-center rounded-box">
        <div className="hero-overlay bg-opacity-60 rounded-box"></div>
        <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold">Campus Bazaar</h1>
                <p className="mb-5 text-lg">Buy & Sell Within IIITDM Jabalpur. A trusted student-only marketplace for books, electronics, furniture, and more.</p>
                <Link to="/sell" className="btn btn-primary">Sell an Item</Link>
                <Link to="/products" className="btn btn-ghost ml-2">Browse Products</Link>
            </div>
        </div>
    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="card bg-base-100 shadow-md h-full"> {/* Ensure cards have same height */}
        <div className="card-body items-center text-center">
            <div className="p-4 bg-primary/20 rounded-full mb-3">
                {icon}
            </div>
            <h2 className="card-title">{title}</h2>
            <p className="text-sm text-base-content/80">{description}</p>
        </div>
    </div>
);


const Home = () => {
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'], // Use a more specific key if filters were applied here
        queryFn: () => api.get('/products?status=available').then(res => res.data),
    });

    const featuredProducts = products?.filter(p => p.isFeatured) || [];

    return (
        <div className="space-y-16">
            <Hero />

            <section>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">Why Choose Campus Bazaar?</h2>
                    <p className="text-lg mt-2 text-base-content/70">The trusted platform for IIITDM Jabalpur students to buy and sell used items</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard icon={<FaCheckCircle className="text-4xl text-primary" />} title="Student Verified" description="Only verified IIITDM Jabalpur students can buy and sell" />
                    <FeatureCard icon={<FaShieldAlt className="text-4xl text-primary" />} title="Secure Transactions" description="Direct contact between students ensures safe exchanges" />
                    <FeatureCard icon={<FaComments className="text-4xl text-primary" />} title="Direct Contact" description="Connect directly with sellers after showing interest" />
                    <FeatureCard icon={<FaBoxes className="text-4xl text-primary" />} title="Wide Variety" description="From textbooks to electronics, find everything you need" />
                </div>
            </section>

            <section id="listings-section">
                 <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold">Featured Listings</h2>
                        <p className="text-lg mt-1 text-base-content/70">Popular items from your campus community</p>
                    </div>
                     <Link to="/products" className="btn btn-outline btn-sm">View All Products</Link>
                </div>
                {isLoading && <div className="flex justify-center py-10"><Spinner size="lg"/></div>}
                {error && <div className="text-center text-error py-10">Could not fetch products.</div>}
                {!isLoading && !error && (
                    featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {featuredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-base-200 rounded-box">
                            <p className="text-lg text-base-content/70">No featured products yet. An admin can feature items from the Admin Panel!</p>
                        </div>
                    )
                )}
            </section>
        </div>
    );
};

export default Home;
