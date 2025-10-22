import React from 'react';
import { FaStore } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
            <aside>
                <FaStore className="text-4xl text-primary mb-2"/>
                <p className="font-bold">
                    Campus Bazaar <br />Your one-stop marketplace at IIITDM Jabalpur
                </p>
                <p>Copyright © {currentYear} - All right reserved</p>
            </aside>
        </footer>
    );
};

export default Footer;
