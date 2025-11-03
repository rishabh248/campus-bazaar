import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { FaStore, FaSearch, FaUserCircle, FaSignOutAlt, FaListAlt, FaShieldAlt, FaComments } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4">
            <div className="navbar-start">
                <Link to="/" className="btn btn-ghost text-xl font-bold normal-case items-center gap-2">
                    <img src="/favicon.svg" alt="Campus Bazaar Logo" className="w-8 h-8" />
                    Campus Bazaar
                </Link>
            </div>

            <div className="navbar-center hidden md:flex">
                <div className="form-control w-full max-w-xs">
                    <div className="relative">
                        <input type="text" placeholder="Search for products..." className="input input-bordered w-full pr-10" />
                        <button className="btn btn-ghost btn-circle absolute top-0 right-0" aria-label="Search">
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>

            <div className="navbar-end">
                <ThemeToggle />
                {user ? (
                    <>
                        <Link to="/sell" className="btn btn-primary ml-2 hidden sm:inline-flex">Sell Item</Link>
                        <div className="dropdown dropdown-end ml-2">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar" aria-label="User menu">
                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <FaUserCircle className="w-full h-full text-gray-400"/>
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[51] p-2 shadow bg-base-100 rounded-box w-52">
                                <li className="menu-title"><span>{user.name}</span></li>
                                <li><Link to="/dashboard"><FaListAlt className="mr-2"/> My Listings</Link></li>
                                <li><Link to="/chat"><FaComments className="mr-2"/> Messages</Link></li>
                                {user.role === 'admin' && <li><Link to="/admin"><FaShieldAlt className="mr-2"/> Admin Panel</Link></li>}
                                <li><button onClick={handleLogout} className="flex items-center w-full text-left"><FaSignOutAlt className="mr-2"/> Logout</button></li>
                            </ul>
                        </div>
                    </>
                ) : (
                    
                    <div className="hidden sm:flex items-center">
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;