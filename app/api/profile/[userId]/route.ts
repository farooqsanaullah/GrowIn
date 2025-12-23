import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/user.model";
import Startup from "@/lib/models/startup.model";
import Investment from "@/lib/models/investment.model";
import { UpdateUserSchema } from "@/lib/auth/zodSchemas";
import { success } from "zod";

const isDev = process.env.NODE_ENV === "development";

type API_Props = {
  params: Promise<{ userId: string }>;
};


export async function GET(_: NextRequest, context: API_Props) {
  try {
    await connectDB();

    const { userId } = await context.params;

    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let portfolioData: any[] = [];
    let portfolioStats: any = {};

    if (user.role === "founder") {

      const startups = await Startup.find({ founders: user._id })
        .select("title description profilePic status createdAt ratingCount avgRating")
        .sort({ createdAt: -1 });

      portfolioData = startups.map(startup => ({
        id: startup._id,
        startupName: startup.title,
        logo: startup.profilePic || "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=60&h=60&fit=crop",
        investedDate: getRelativeTime(startup.createdAt),
        status: startup.status || "active",
        role: "Founder & CEO",
        description: startup.description
      }));

      portfolioStats = {
        stat1: { value: portfolioData.length, label: "Active Companies" },
        stat2: { value: user.experiences?.length || 0, label: "Experiences" },
        stat3: { value: `${new Date().getFullYear() - new Date(user.createdAt).getFullYear()}+`, label: "Years on Platform" },
        stat4: { value: user.skills?.length || 0, label: "Skills" }
      };
    } else if (user.role === "investor") {

      const investments = await Investment.find({ investorId: user._id })
        .populate({
          path: "startupId",
          select: "title description profilePic status"
        })
        .sort({ createdAt: -1 });

      portfolioData = investments.map(investment => ({
        id: investment.startupId._id,
        startupName: investment.startupId.title,
        logo: investment.startupId.profilePic || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=60&h=60&fit=crop",
        investedDate: getRelativeTime(investment.createdAt),
        status: investment.startupId.status || "active",
        investmentAmount: `$${investment.amount.toLocaleString()}`,
        currentValue: `$${Math.round(investment.amount * (1.2 + Math.random() * 0.8)).toLocaleString()}`,
        description: investment.startupId.description
      }));

      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const avgReturn = investments.length > 0 ? 1.4 : 0; // Mock average return

      portfolioStats = {
        stat1: { value: portfolioData.length, label: "Active Investments" },
        stat2: { value: `${new Date().getFullYear() - new Date(user.createdAt).getFullYear()}+`, label: "Years Experience" },
        stat3: { value: `$${(totalInvested / 1000).toFixed(0)}K`, label: "Total Invested" },
        stat4: { value: `${avgReturn.toFixed(1)}x`, label: "Avg Return" }
      };
    }

    return NextResponse.json({ 
      success : true,
      data: {
        user: {
          ...user.toObject(),
          joinedDate: new Date(user.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          })
        },
        portfolioData,
        portfolioStats
      }
    }, { status: 200 });
  } catch (error) {
    isDev && console.error("[GET API] user fetch error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMonths = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  if (diffInMonths === 0) {
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays === 0 ? "Today" : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  } else {
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }
}


export async function PUT(req: NextRequest, context: API_Props) {
  try {
    await connectDB();

    const { userId } = await context.params;
    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId in URL" },
        { status: 400 }
      );
    }

    const body = await req.json();


    const parsed = UpdateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.issues },
        { status: 400 }
      );
    }


    const { email, ...updateData } = parsed.data;


    const updatedUser = await User.findByIdAndUpdate(
      userId,
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
