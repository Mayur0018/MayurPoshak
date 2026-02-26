import { connectDB } from "@/lib/mongodb";
import supabaseServer from "@/lib/supabaseServer";

// Note: Real WhatsApp integration typically requires a service like Twilio, Meta API, or a custom webhook.
// Since I don't have the user's API keys, I'll implement a fallback and a detailed mock.
// User can replace the fetch URL with their WhatsApp provider.

export async function POST(request) {
  try {
    const { messageType, userEmail } = await request.json(); 
    
    // In Route Handlers, we can't easily get the "current user" without cookies
    // So we'll pass the email from the frontend for notifications.
    const emailToNotify = userEmail || "New User";
    const phone = "9106481092"; // Default for admin notification

    let whatsappMsg = `Interaction on Mayur Poshak: ${messageType} by ${emailToNotify}`;
    if (messageType === 'login') {
      whatsappMsg = `Hello! A user just logged in: ${emailToNotify}. Phone: ${phone}`;
    } else if (messageType === 'register') {
      whatsappMsg = `AWESOME! A NEW USER just created an account: ${emailToNotify}. Phone: ${phone}. Welcome them!`;
    } else if (messageType === 'visit') {
      whatsappMsg = `Heads up! A user is visiting the website: ${emailToNotify}. Phone: ${phone}`;
    }

    console.log(`TRIGGERING WHATSAPP NOTIFICATION TO ${phone}:`, whatsappMsg);

    // MOCK CALL TO WHATSAPP API
    /*
    const response = await fetch("https://api.whatsapp-provider.com/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer YOUR_TOKEN" },
      body: JSON.stringify({
        to: phone, 
        message: whatsappMsg
      })
    });
    */

    return Response.json({ message: "Notification triggered successfully", preview: whatsappMsg });
  } catch (error) {
    return Response.json({ message: "Notification failed", error: error.message }, { status: 500 });
  }
}
