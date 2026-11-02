import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { addToCart } from '@/redux/slices/cartSlice';
import API from '@/lib/api-client';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            API.get(`/products/${id}`).then(({ data }) => setProduct(data.data.product));
        }
    }, [id]);

    const handleAddToCart = () => {
        const variant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
        if (!variant) return toast.error('Please select size and color');
        if (variant.stock < quantity) return toast.error('Insufficient stock');

        dispatch(addToCart({
            product: product._id,
            name: product.name,
            image: product.images[0]?.url,
            price: product.price,
            variant,
            quantity
        }));
        toast.success('Added to cart!');
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <img src={product.images[0]?.url} alt={product.name} className="w-full rounded-xl shadow-lg" />
                </div>
                <div className="md:w-1/2 space-y-6">
                    <h1 className="text-4xl font-bold font-playfair">{product.name}</h1>
                    <p className="text-2xl text-indigo-600 font-semibold">₹{product.price}</p>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>

                    <div className="space-y-4">
                        <div>
                            <span className="font-semibold">Size:</span>
                            <div className="flex gap-2 mt-2">
                                {[...new Set(product.variants.map(v => v.size))].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-md ${selectedSize === size ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold">Color:</span>
                            <div className="flex gap-2 mt-2">
                                {[...new Set(product.variants.map(v => v.color))].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 border rounded-md ${selectedColor === color ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={handleAddToCart}
                            className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 transition-all"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
