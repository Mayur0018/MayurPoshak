# Mayur Poshak - Production-Ready MERN E-commerce Backend

This is the backend for the Mayur Poshak e-commerce application, built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based auth with refresh token rotation in httpOnly cookies.
- **Security**: Helmet, Rate Limiting, CORS, and Data Sanitization.
- **Product Management**: Advanced filtering, sorting, pagination, and multi-image upload via Cloudinary.
- **Order Management**: Stock validation, status tracking, and RBAC for management.
- **Payment Integration**: Stripe integration with secure webhook handling.
- **Error Handling**: Centralized global error handling with Winston logging.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT, bcryptjs
- **Storage**: Cloudinary
- **Payments**: Stripe
- **Logging**: Winston

## Installation

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`.
4. Run the server:
   ```bash
   npm start (or npm run dev for development)
   ```

## API Endpoints

### Auth
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Login and receive tokens
- `GET /api/v1/auth/logout`: Logout and clear cookies
- `GET /api/v1/auth/refresh`: Refresh access token

### Products
- `GET /api/v1/products`: Get all products (with filters/sorting/pagination)
- `POST /api/v1/products`: Create a product (Admin only)
- `GET /api/v1/products/:id`: Get single product details
- `PATCH /api/v1/products/:id`: Update product (Admin only)
- `DELETE /api/v1/products/:id`: Delete product (Admin only)

### Orders
- `POST /api/v1/orders`: Create a new order (Protected)
- `GET /api/v1/orders/myorders`: Get current user's orders (Protected)
- `PATCH /api/v1/orders/:id/status`: Update order status (Admin only)

### Payments
- `GET /api/v1/payments/stripe-config`: Get Stripe publishable key
- `POST /api/v1/payments/create-payment-intent`: Create a Stripe Payment Intent
- `POST /api/v1/payments/stripe-webhook`: Stripe webhook endpoint
