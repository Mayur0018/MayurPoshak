import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { cartItems } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return Response.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            images: [item.image],
            description: (item.size || item.selectedSize) ? `Size: ${item.size || item.selectedSize}` : "Saree",
          },
          unit_amount: Math.round(item.price * 100), // Convert to paise
        },
        quantity: item.quantity || 1,
      })),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cancel`,
    });

    return Response.json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    return Response.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
