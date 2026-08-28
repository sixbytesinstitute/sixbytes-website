import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { withAuth } from "@/lib/middleware-auth";

// ─── POST: Create a new user (student or faculty) ──────
export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();

      const body = await req.json();
      const { name, email, phone, role, class: userClass, stream, subjects, assignedClasses } = body;

      // Validate required fields
      if (!name || !email || !phone || !role) {
        return NextResponse.json(
          { success: false, error: "Name, email, phone, and role are required" },
          { status: 400 }
        );
      }

      if (!["student", "faculty"].includes(role)) {
        return NextResponse.json(
          { success: false, error: "Role must be 'student' or 'faculty'" },
          { status: 400 }
        );
      }

      // Validate student-specific fields
      if (role === "student" && !userClass) {
        return NextResponse.json(
          { success: false, error: "Class is required for students" },
          { status: 400 }
        );
      }

      // Check for existing user
      const existing = await User.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "A user with this email already exists" },
          { status: 409 }
        );
      }

      // Auto-generate password: SixBytes@ + last 4 digits of phone
      const phoneLast4 = phone.replace(/\D/g, "").slice(-4);
      const defaultPassword = `SixBytes@${phoneLast4}`;
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create user
      const newUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: hashedPassword,
        role,
        class: role === "student" ? userClass : "",
        stream: stream || "N/A",
        subjects: role === "faculty" ? (subjects || []) : [],
        assignedClasses: role === "faculty" ? (assignedClasses || []) : [],
        mustChangePassword: true,
        isActive: true,
      });

      return NextResponse.json(
        {
          success: true,
          message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            class: newUser.class,
          },
          defaultPassword, // Show ONCE to admin
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("CREATE USER ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create user" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);

// ─── GET: List all users ────────────────────────────────
export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();

      const { searchParams } = new URL(req.url);
      const role = searchParams.get("role");
      const userClass = searchParams.get("class");
      const search = searchParams.get("search");

      // Build filter
      const filter: Record<string, unknown> = {};

      if (role) filter.role = role;
      if (userClass) filter.class = userClass;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      const users = await User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        count: users.length,
        users,
      });
    } catch (error) {
      console.error("LIST USERS ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch users" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);
