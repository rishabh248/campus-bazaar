import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const { _id, title, price, images, seller, isFeatured, status } = product;
    const imageUrl = images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <div className="card card-compact w-full bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105 overflow-hidden">
            <figure className="relative h-56 bg-gray-200">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                {isFeatured && <div className="badge badge-secondary absolute top-2 right-2 font-semibold">FEATURED</div>}
                {status === 'sold' && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold uppercase tracking-wider">Sold</span>
                    </div>
                )}
            </figure>
            <div className="card-body">
                <h2 className="card-title truncate text-lg" title={title}>{title}</h2>
                <p className="text-xl font-semibold text-primary">&#8377;{price?.toLocaleString('en-IN') ?? 'N/A'}</p>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                    <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
                    <span className="truncate">{seller?.name || 'Unknown Seller'}</span>
                </div>
                <div className="card-actions justify-end mt-2">
                    <Link to={`/product/${_id}`} className="btn btn-primary btn-sm">View Details</Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;