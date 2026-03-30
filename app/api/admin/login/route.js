import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  // 🔒 Change these to your own values
  const ADMIN_EMAIL = "admin@sixbytes.com";
  const ADMIN_PASSWORD = "123456";

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, error: "Invalid admin credentials" },
      { status: 401 }
    );
  }

  // simple token (for demo)
  return NextResponse.json({
    success: true,
    token: "admin-token-123",
  });
}