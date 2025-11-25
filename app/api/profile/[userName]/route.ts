import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/user.model";

const isDev = process.env.NODE_ENV === "development";

export async function GET(_: NextRequest, context: { params: { userName: string } }) {
  try {
    await connectDB();

    const { userName } = await context.params;
    isDev && console.log("Fetching user with userName:", userName);

    const user = await User.findOne({ userName }).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
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
