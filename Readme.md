# Campus Bazaar - IIITDM Jabalpur Marketplace 🛒

A full-stack web application built for students of IIITDM Jabalpur to easily buy and sell used items within the campus community. It aims to replace scattered WhatsApp groups with a dedicated, trusted platform.

## Purpose

The primary goal of Campus Bazaar is to provide a secure and user-friendly marketplace exclusive to IIITDMJ students. It facilitates direct connections between buyers and sellers for items like books, electronics, furniture, cycles, and other campus necessities.

## Key Features

* **Student-Only Access:** Registration requires a valid IIITDMJ email matching the format `<year><branch><rollno>@iiitdmj.ac.in`.
* **Product Listings:** Sellers can easily create listings with titles, descriptions, prices, categories, conditions, and upload up to 5 images per item via Cloudinary.
* **Browsing & Filtering:** Users can browse all available items, search using keywords, filter by category (Electronics, Books, Furniture, Vehicles, Other), and sort by date or price.
* **Interest & Contact:** Buyers can express interest in a product, notifying the seller and then revealing the seller's contact details (name, email, phone) to facilitate offline transactions.
* **In-App Chat:** A real-time chat feature allows interested buyers and sellers to communicate directly within the platform using Socket.IO.
* **User Dashboard:**
    * **Sellers:** View and manage their own listings (edit details, mark as sold, delete). See who has shown interest.
    * **Buyers:** Keep track of items they have shown interest in.
* **Notifications:** Sellers receive notifications when a buyer shows interest in their product.
* **Admin Panel:** Designated admins (based on email in environment variables) have access to a panel to view all users and products, delete any user or product, and mark products as "featured."
* **Featured Listings:** Featured products are highlighted on the homepage for better visibility.
* **Dark Mode:** Users can toggle between light and dark themes, with the preference saved locally.
* **Responsive Design:** The interface adapts smoothly to various screen sizes (desktop, tablet, mobile).

## Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, DaisyUI, React Router, Axios, Socket.IO Client, Tanstack Query (React Query)
* **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT (for authentication), Bcryptjs (for password hashing), Cloudinary (for image storage), Multer (for file uploads), Express Rate Limit.
* **Deployment:** Frontend hosted on Vercel, Backend hosted on Render.





**Prerequisites:**

* Node.js (v18+)
* npm or yarn
* MongoDB Atlas account or local MongoDB
* Cloudinary account

**Backend Setup:**

1.  Clone the repository.
2.  Navigate to the `backend` directory: `cd backend`
3.  Install dependencies: `npm install`
4.  Create a `.env` file by copying `.env.example`.
5.  Fill in your `MONGODB_URI`, `JWT_SECRET`, `REFRESH_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `ADMIN_EMAILS`.
6.  Set `CORS_ORIGIN=http://localhost:5173` for local development.
7.  Start the server: `npm run dev` (runs on port 5000 by default).

**Frontend Setup:**

1.  Navigate to the `frontend` directory: `cd ../frontend`
2.  Install dependencies: `npm install`
3.  (Optional) Create a `.env` file if you need to override the default backend URL for local development: `VITE_API_BASE_URL=http://localhost:5000/api`
4.  Start the development server: `npm run dev` (runs on port 5173 by default).

## Live Demo



Check out the live application: [https://campus-bazaar-fr.vercel.app]

## Future Ideas

* Implement Seller Ratings & Reviews.
* Add more advanced filtering options (e.g., price range).
* Display real-time notifications directly in the UI.
* Implement a password reset feature.

