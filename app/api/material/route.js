import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Material from "@/models/Material";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const material = await Material.create({
      title: body.title,
      fileUrl: body.fileUrl,
      class: body.class,
    });

    return NextResponse.json({
      success: true,
      material,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });

  }
}

export async function GET() {
  await connectDB();

  const materials = await Material.find();

  return NextResponse.json({ materials });
}