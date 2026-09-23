import { NextResponse } from "next/server";

// Security Hardening: Deprecated unauthenticated upload-material route
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      deprecated: true,
      error: "Direct uploads to this endpoint have been disabled. Study materials are managed via authenticated faculty portal routes.",
    },
    { status: 410 }
  );
}