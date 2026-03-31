// API route for chatbot responses
export async function POST(request) {
  const { message } = await request.json();

  if (!message) {
    return Response.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  const botResponse = getBotResponse(message.toLowerCase());

  return Response.json({
    reply: botResponse,
    timestamp: new Date(),
  });
}

// Chatbot knowledge base with FAQ responses
function getBotResponse(userMessage) {
  // Product & Catalog Questions
  if (
    userMessage.includes("saree") ||
    userMessage.includes("product") ||
    userMessage.includes("category")
  ) {
    if (
      userMessage.includes("price") ||
      userMessage.includes("cost") ||
      userMessage.includes("how much")
    ) {
      return "Our saree prices vary based on material and design, typically ranging from ₹500 to ₹5,000+. Visit our collections to see specific pricing. Would you like me to recommend a category? 🛍️";
    }
    if (
      userMessage.includes("silk") ||
      userMessage.includes("cotton") ||
      userMessage.includes("material")
    ) {
      return "We offer various collections including:\n- Silk Sarees (premium)\n- Cotton Sarees (comfortable)\n- Party Wear Sarees\n- Wedding Collection\n- Printed Sarees\n\nEach has unique characteristics. What interests you? 👗";
    }
    if (
      userMessage.includes("wedding") ||
      userMessage.includes("party") ||
      userMessage.includes("occasion")
    ) {
      return "Perfect! We have dedicated collections for:\n✨ Wedding Sarees - elegant & traditional\n🎉 Party Wear Sarees - stylish & trendy\n\nCheck out our 'Wedding' and 'Party Wear' collections! Would you like more details? 💃";
    }
    return "We have a beautiful collection of traditional and modern sarees. Browse our categories: Ladies, Beauty, Kids, Men, or explore specific collections like Wedding, Party Wear, and Silk. What type interests you? 👗";
  }

  // Sizing & Fit Questions
  if (
    userMessage.includes("size") ||
    userMessage.includes("fit") ||
    userMessage.includes("measurement")
  ) {
    return "Great question! Standard saree sizes are fixed, but we offer:\n📏 One-size fit for most body types\n✂️ Custom tailoring available\n🔄 Free adjustments on certain items\n\nNeed specific measurements? Our team can help! Contact: 9106481092 📞";
  }

  // Shipping & Delivery
  if (
    userMessage.includes("shipping") ||
    userMessage.includes("delivery") ||
    userMessage.includes("how long") ||
    userMessage.includes("when")
  ) {
    return "📦 Shipping Information:\n⏱️ Delivery Time: 3-7 business days\n📍 Pan-India shipping available\n💳 Free shipping on orders ₹2000+\n🚚 Tracked delivery\n\nNeed urgent delivery? Contact us at mayurnish18@gmail.com 🚚";
  }

  // Return & Refund
  if (
    userMessage.includes("return") ||
    userMessage.includes("refund") ||
    userMessage.includes("exchange") ||
    userMessage.includes("policy")
  ) {
    return "🔄 Return & Exchange Policy:\n⏳ 30-day return window\n✅ Unused items with original tag\n💰 Full refund or exchange\n📮 Free return shipping on orders ₹5000+\n\nInitiate a return: Contact 9106481092 or mayurnish18@gmail.com";
  }

  // Payment & Orders
  if (
    userMessage.includes("payment") ||
    userMessage.includes("pay") ||
    userMessage.includes("card") ||
    userMessage.includes("upi")
  ) {
    return "💳 Payment Options:\n✅ Credit/Debit Cards\n✅ UPI (Google Pay, PhonePe, Paytm)\n✅ Net Banking\n✅ Wallet (PayPal, Amazon Pay)\n✅ EMI on credit cards\n\nAll payments are secure & encrypted! 🔒";
  }

  // Order Status
  if (
    userMessage.includes("order") ||
    userMessage.includes("track") ||
    userMessage.includes("status")
  ) {
    return "📦 Order Tracking:\nYou can track your order:\n1️⃣ Check your email for order confirmation\n2️⃣ Log into your profile to view orders\n3️⃣ Use the tracking link in your confirmation email\n\nNeed help? Email: mayurnish18@gmail.com 📧";
  }

  // Care & Maintenance
  if (
    userMessage.includes("care") ||
    userMessage.includes("wash") ||
    userMessage.includes("clean") ||
    userMessage.includes("maintain")
  ) {
    return "👗 Saree Care Tips:\n🧴 Hand wash in cold water\n🌿 Use mild detergent\n💨 Dry in shade\n🧊 Avoid bleach & harsh chemicals\n🔥 Iron on low heat for delicate fabrics\n\nEach saree comes with care instructions. Follow them for best results! ✨";
  }

  // Customization
  if (
    userMessage.includes("custom") ||
    userMessage.includes("design") ||
    userMessage.includes("personalize")
  ) {
    return "✨ Customization Services:\nWe offer:\n🎨 Custom designs\n👗 Tailor-made sarees\n🧵 Color customization\n📏 Personal fitting\n\nFor custom orders, contact: 9106481092 or mayurnish18@gmail.com 💌";
  }

  // Bulk Orders
  if (
    userMessage.includes("bulk") ||
    userMessage.includes("wholesale") ||
    userMessage.includes("corporate")
  ) {
    return "🏢 Bulk & Corporate Orders:\nWe provide special rates for:\n📦 Bulk purchases\n🎁 Corporate gifts\n👥 Group orders\n🤝 Wholesale partnerships\n\nFor quotes & details: mayurnish18@gmail.com or 9106481092 📞";
  }

  // Contact & Hours
  if (
    userMessage.includes("contact") ||
    userMessage.includes("call") ||
    userMessage.includes("hours") ||
    userMessage.includes("business")
  ) {
    return "📞 Contact Mayur Poshak:\n☎️ Phone: 9106481092\n📧 Email: mayurnish18@gmail.com\n📍 Address: 168 Jagriti Enclave, Delhi-110092\n⏰ Business Hours: Mon-Sat, 10:00 AM - 7:00 PM IST\n\nWe're here to help! 😊";
  }

  // General Greeting
  if (
    userMessage.includes("hello") ||
    userMessage.includes("hi") ||
    userMessage.includes("hey") ||
    userMessage.includes("thanks") ||
    userMessage.includes("thank you")
  ) {
    return "👋 Hello! Welcome to Mayur Poshak! 🌟\n\nHow can I help you today?\n💬 Ask about our saree collections\n📦 Track your order\n💳 Payment & shipping info\n👗 Styling & care tips\n📞 Contact us\n\nJust type your question! 😊";
  }

  // Default fallback
  return "😊 Thanks for your message! I'm here to help with:\n✅ Saree collections & products\n✅ Shipping & delivery\n✅ Returns & refunds\n✅ Sizing & care\n✅ Payment options\n✅ Custom orders\n\nFor anything else, contact our team:\n📞 9106481092\n📧 mayurnish18@gmail.com\n\nHow can I assist you? 🛍️";
}
