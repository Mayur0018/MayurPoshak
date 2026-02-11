# Mayur Poshak - Complete Setup Guide

## 🚀 Website Features

This is a fully functional e-commerce website for sarees with the following features:

### ✅ Core Features Implemented

1. **Product Management**
   - Display products from MongoDB database
   - Search functionality across all products
   - Category-based filtering (Ladies, Beauty, Kids, Men)
   - Product details page with specifications

2. **Shopping Experience**
   - Add products to cart (Redux state management)
   - Cart management (increment, decrement, remove)
   - Real-time cart count in header
   - Cart calculations (subtotal, shipping, tax)

3. **Checkout & Payment**
   - Stripe payment integration (INR currency)
   - Secure payment processing
   - Order success/cancel pages
   - Error handling and validation

4. **Authentication**
   - Supabase authentication system
   - User sign-up with email/password
   - User sign-in with validation
   - User profile page
   - Session persistence
   - Logout functionality

5. **Navigation & Browsing**
   - Category pages with detailed product listings
   - Home page with sliders and featured products
   - About page with company information
   - Blogs page with saree guides
   - Contact page with inquiry form
   - Responsive navigation header

6. **Customer Support**
   - AI-powered chatbot with FAQ
   - Real-time chat support
   - Contact information integrated
   - Email and phone support details

7. **User Interface**
   - Fully responsive design (mobile, tablet, desktop)
   - Smooth animations and transitions
   - Loading states and skeletons
   - Error handling with user-friendly messages
   - Toast notifications

---

## 📋 Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MongoDB Database
MONGODB_URI=your_mongodb_connection_string

# Stripe Payment (INR Currency)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Cloudinary Image Upload
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change for production
NEXT_PUBLIC_API_URL=http://localhost:3000  # API base URL

# Contact Information (displayed in chatbot and contact page)
CONTACT_PHONE=9106481092
CONTACT_EMAIL=mayurnish18@gmail.com
```

---

## 🔧 Installation & Setup

### 1. Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- MongoDB account and database
- Supabase account
- Stripe account (for payments)
- Cloudinary account (for image uploads)

### 2. Clone & Install
```bash
# Clone the repository
git clone <repository-url>
cd Mayur_Poshak

# Install dependencies
npm install
```

### 3. Configure Environment Variables
```bash
# Create .env.local file and add all required variables (see above)
cp .env.example .env.local
# Edit .env.local with your actual credentials
```

### 4. Run Development Server
```bash
npm run dev
# Server running at http://localhost:3000
```

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📱 How to Use the Website

### For Customers:

#### 1. **Browse Products**
- Visit homepage and explore featured products
- Click on category cards (Silk Sarees, Cotton, Banarasi, etc.)
- Search products using the search bar

#### 2. **View Product Details**
- Click on any product image to view full details
- Select size before adding to cart
- View price, description, and product specifications

#### 3. **Shopping Cart**
- Add items to cart with desired size
- Manage quantity (increase/decrease)
- Remove items as needed
- View total with shipping and tax

#### 4. **Checkout**
- Click "Buy Now" button in cart
- Complete payment via Stripe (credit/debit cards)
- Receive order confirmation
- View success page with order details

#### 5. **User Account**
- Sign up with email and password
- Access profile page after login
- View user information
- Logout when done

#### 6. **Customer Support**
- Use chatbot for instant FAQ responses
- Chat about products, shipping, returns, sizing
- Call: +91 91064 81092
- Email: mayurnish18@gmail.com
- Visit: 168 Jagriti Enclave, Delhi-110092

### For Administrators:

#### 1. **Add Products to Database**
```bash
# Use MongoDB to insert products with this schema:
{
  _id: ObjectId,
  name: "Product Name",
  image: "product-image-url",
  price: 2999,  # in INR
  description: "Product description",
  category: "SILK SAREES"
}
```

#### 2. **Upload Product Images**
- Use Cloudinary for image hosting
- Get direct image URLs for product data

#### 3. **Monitor Orders**
- Check Stripe dashboard for completed transactions
- Verify order details from checkout route

---

## 🔗 Important Website Links

### Public Pages
- **Home**: `/` - Homepage with featured products
- **Ladies**: `/ladies` - Women's saree collection
- **Beauty**: `/beauty` - Beauty products
- **Men**: `/men` - Men's wear
- **Kids**: `/kids` - Kids' collection
- **Categories**: `/categories/[name]` - Browsable category pages
- **About**: `/About` - Company information
- **Blogs**: `/blogs` - Fashion guides and tips
- **Contact**: `/Contact` - Get in touch form

### User Pages
- **Sign In**: `/Signin` - Login page
- **Sign Up**: `/register` - Create account
- **Profile**: `/profile` - User profile (requires login)
- **Cart**: `/cart` - Shopping cart
- **Success**: `/success` - Order confirmation
- **Cancel**: `/cancel` - Payment cancelled

### API Routes (Backend)
- `POST /api/products` - Add product
- `GET /api/products` - Fetch all products
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `POST /api/checkout` - Create Stripe session
- `POST /api/chatbot` - Chatbot responses
- `POST /api/upload` - Upload image to Cloudinary

---

## ✅ Quality Assurance Checklist

### Before Going Live:

- [ ] All environment variables are set correctly
- [ ] MongoDB database is populated with products
- [ ] Stripe account is in production mode
- [ ] Supabase auth is configured
- [ ] Cloudinary account is active
- [ ] Contact information is updated in chatbot routes
- [ ] Site URL is configured in .env
- [ ] Test complete checkout flow
- [ ] Test user registration and login
- [ ] Verify email addresses for support
- [ ] Test product search functionality
- [ ] Verify mobile responsiveness
- [ ] Check all navigation links work
- [ ] Test chatbot responses
- [ ] Verify error messages display correctly
- [ ] Test cart operations (add, remove, update)
- [ ] Verify pages load with proper styling
- [ ] Check image loading from CDN

---

## 🐛 Troubleshooting

### Problem: Products not showing
**Solution**: 
- Check MongoDB connection string in .env
- Verify products exist in database
- Check browser console for API errors

### Problem: Payment fails
**Solution**:
- Verify Stripe keys are correct
- Check Stripe account is in test/production mode correctly
- Ensure INR currency is enabled in Stripe
- Use Stripe test cards for testing

### Problem: User login fails
**Solution**:
- Verify Supabase URL and keys
- Check email/password are correct
- Ensure user account exists in Supabase

### Problem: Images not loading
**Solution**:
- Verify image URLs exist
- Check Cloudinary credentials
- Ensure domains are added to next.config.js

### Problem: Chatbot not responding
**Solution**:
- Check `/api/chatbot` route exists
- Verify API endpoint is correct
- Check browser console for error messages

---

## 📊 Database Schemas

### Products Collection (MongoDB)
```javascript
{
  _id: ObjectId,
  name: String,        // Product name
  image: String,       // Image URL
  price: Number,       // Price in INR
  description: String, // Optional description
  category: String,    // Category name
  createdAt: Date,     // Creation timestamp
  updatedAt: Date      // Last update timestamp
}
```

### Orders (via Stripe)
- All orders are managed through Stripe checkout sessions
- Order info stored in Stripe dashboard
- Email receipts sent automatically

---

## 🚀 Performance Tips

1. **Image Optimization**
   - Use Cloudinary for image hosting
   - Images are automatically optimized
   - Use WebP format when possible

2. **Caching**
   - Products are cached in component state
   - Search results cached in Header
   - Stripe sessions cached temporarily

3. **Database**
   - Ensure MongoDB indexes exist
   - Use pagination for large product lists
   - Monitor connection pool

---

## 📞 Support & Contact

- **Phone**: +91 91064 81092
- **Email**: mayurnish18@gmail.com
- **Address**: 168 Jagriti Enclave, Delhi-110092, India
- **Hours**: Mon-Sat, 10:00 AM - 7:00 PM IST

---

## 📄 License

This project is proprietary to Mayur Poshak. All rights reserved.

---

## 🎯 Next Steps

1. Configure all environment variables
2. Set up MongoDB database
3. Add products to database
4. Test complete user flow
5. Deploy to production
6. Monitor customer orders
7. Update contact information as needed

Happy selling! 🎉
