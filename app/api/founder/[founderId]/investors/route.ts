import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import Investment from "@/lib/models/investment.model";
import User from "@/lib/models/user.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ founderId: string }> }
) {
  try {
    await connectDB();
    const { founderId } = await params;

    const startups = await Startup.find({ founders: founderId })
      .populate({ path: "investors", select: "name userName email profileImage" })
      .select("title investors")
      .lean();


    const investorMap = new Map<string, any>();

    for (const s of startups) {
      const sId = (s as any)._id.toString();
      const invs = (s as any).investors || [];
      for (const inv of invs) {
        const id = inv._id.toString();
        const existing = investorMap.get(id) || {
          investor: inv,
          startups: new Set<string>(),
          totals: { amount: 0, count: 0 },
        };
        existing.startups.add(sId);
        investorMap.set(id, existing);
      }
    }


    const startupIds = startups.map((s: any) => s._id);
    if (startupIds.length > 0) {
      const investments = await Investment.find({ startupId: { $in: startupIds } })
        .select("investorId amount startupId createdAt")
        .lean();

      for (const inv of investments) {
        const id = (inv as any).investorId.toString();
        const rec = investorMap.get(id);
        if (rec) {
          rec.totals.amount += (inv as any).amount || 0;
          rec.totals.count += 1;
        } else {

          const user = await User.findById(id).select("name userName email profileImage").lean();
          if (user) {
            investorMap.set(id, {
              investor: user,
              startups: new Set<string>([(inv as any).startupId.toString()]),
              totals: { amount: (inv as any).amount || 0, count: 1 },
            });
          }
        }
      }
    }

    const results = Array.from(investorMap.values()).map((v) => ({
      investor: v.investor,
      startupsCount: v.startups.size,
      totalInvested: v.totals.amount,
      investmentsCount: v.totals.count,
    }));

    return NextResponse.json({ success: true, data: results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
