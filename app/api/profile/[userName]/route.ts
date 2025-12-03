import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/user.model";
import { UpdateUserSchema } from "@/lib/auth/zodSchemas";

const isDev = process.env.NODE_ENV === "development";

type API_Props = {
  params: Promise<{ userName: string }>;
};

// GET single user
export async function GET(_: NextRequest, context: API_Props) {
  try {
    await connectDB();

    const { userName } = await context.params;
    isDev && console.log("Fetching user with userName:", userName);

    const user = await User.findOne({ userName }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    isDev && console.error("[GET API] user fetch error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT (Update single user)
export async function PUT(req: NextRequest, context: API_Props) {
  try {
    await connectDB();

    const { userName } = await context.params;
    if (!userName) {
      return NextResponse.json(
        { message: "Missing userName in URL" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validating body using Zod schema
    const parsed = UpdateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    // Preventing updating email even if provided
    const { email, ...updateData } = parsed.data;

    // Updating user
    const updatedUser = await User.findOneAndUpdate(
      { userName },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    isDev && console.error("[PUT API] user update error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
