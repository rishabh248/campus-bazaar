import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const { _id, title, price, images, seller, isFeatured, status } = product;
    
    return (
        <div className="card card-compact w-full bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105">
            <figure className="relative h-56">
                <img src={images[0]?.url || 'https://via.placeholder.com/400x300'} alt={title} className="w-full h-full object-cover" />
                {isFeatured && <div className="badge badge-secondary absolute top-2 right-2">FEATURED</div>}
                {status === 'sold' && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold">SOLD</div>}
            </figure>
            <div className="card-body">
                <h2 className="card-title truncate">{title}</h2>
                <p className="text-lg font-semibold text-primary">?{price.toLocaleString('en-IN')}</p>
                 <div className="text-sm text-gray-500 flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{seller?.name || 'Unknown Seller'}</span>
                </div>
                <div className="card-actions justify-end">
                    <Link to={`/product/${_id}`} className="btn btn-primary btn-sm">View Details</Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
