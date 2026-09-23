import { NextResponse } from "next/server";

// Security Hardening: Deprecated unauthenticated prototype route
export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      deprecated: true,
      error: "This prototype endpoint has been deprecated. Use authenticated portal routes (/api/admin/users).",
    },
    { status: 410 }
  );
}
