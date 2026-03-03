import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear the token cookie
    cookieStore.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return Response.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error in logout" }, { status: 500 });
  }
}
