import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import User from "@/lib/models/user.model";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { cosineSim, getEmbeddings, jaccardSim } from "@/lib/ai/similarity";

type Body = {
  startupId: string;
  topK?: number;
};


function describeInvestor(inv: any): string {
  const fr = inv.fundingRange;
  const frText = fr?.min || fr?.max
    ? `Funding range: ${fr.min || "0"}-${fr.max || "unlimited"}`
    : "";
  const verified = inv.isVerified ? "Verified investor." : "";
  const location = [inv.city, inv.country].filter(Boolean).join(", ");
  
  return [
    inv.name || inv.userName || "",
    inv.bio || "",
    location,
    frText,
    verified,
  ]
    .filter(Boolean)
    .join("\n");
}


function describeStartup(s: any): string {
  return [
    s.title,
    s.description,
    `Industry: ${s.industry}`,
    `Category: ${s.categoryType}`,
  ]
    .filter(Boolean)
    .join("\n");
}


function parseRange(rangeStr: string): { min: number; max: number } | null {
  const match = rangeStr.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return { min: parseInt(match[1]), max: parseInt(match[2]) };
}


function rangesOverlap(
  r1: { min?: number; max?: number },
  r2: { min: number; max: number }
): boolean {
  if (!r1.min && !r1.max) return false;
  const min1 = r1.min || 0;
  const max1 = r1.max || Infinity;
  return max1 >= r2.min && min1 <= r2.max;
}


function calculateScore(
  startup: any,
  investor: any,
  embeddingSim?: number
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];


  const industryTokens = (startup.industry || "")
    .toLowerCase()
    .split(/[\/,&\s]+/)
    .map((t: string) => t.trim())
    .filter(Boolean);
  const bioLower = (investor.bio || "").toLowerCase();
  
  let industryMatch = false;
  for (const token of industryTokens) {
    if (bioLower.includes(token)) {
      industryMatch = true;
      break;
    }
  }
  
  if (industryMatch) {
    score += 35;
    reasons.push(`Industry match: ${startup.industry}`);
  }


  if (investor.fundingRange && startup.equityRange?.length > 0) {
    const startupRanges = startup.equityRange
      .map((eq: any) => parseRange(eq.range))
      .filter(Boolean);
    
    for (const sr of startupRanges) {
      if (rangesOverlap(investor.fundingRange, sr)) {
        score += 25;
        const min = investor.fundingRange.min || "0";
        const max = investor.fundingRange.max || "unlimited";
        reasons.push(`Funding fit: ${min}-${max} range matches`);
        break;
      }
    }
  }


  if (investor.city && startup.founders?.[0]?.city) {
    if (
      investor.city.toLowerCase() ===
      startup.founders[0].city.toLowerCase()
    ) {
      score += 10;
      reasons.push(`Location: ${investor.city}`);
    }
  } else if (investor.country && startup.founders?.[0]?.country) {
    if (
      investor.country.toLowerCase() ===
      startup.founders[0].country.toLowerCase()
    ) {
      score += 6;
      reasons.push(`Country: ${investor.country}`);
    }
  } else if (investor.city || investor.country) {
    const loc = [investor.city, investor.country].filter(Boolean).join(", ");
    if (loc) reasons.push(`Based in ${loc}`);
  }


  if (investor.isVerified) {
    score += 10;
    reasons.push("Verified investor");
  }


  const bioSim = jaccardSim(startup.description || "", investor.bio || "");
  const bioScore = Math.round(bioSim * 15);
  if (bioScore > 5) {
    score += bioScore;
    if (!industryMatch) {
      reasons.push("Bio shows relevant experience");
    }
  }


  if (embeddingSim !== undefined) {
    const embedScore = Math.round(embeddingSim * 20);
    score += embedScore;
  }


  score = Math.min(score, 100);


  if (reasons.length === 0) {
    reasons.push("Profile alignment with your startup");
  }

  return { score, reasons: reasons.slice(0, 3) };
}


export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const { startupId, topK = 5 } = body || {};
    
    if (!startupId) {
      return errorResponse("startupId required", 400);
    }

    await connectDB();
    
    const startup = await Startup.findById(startupId)
      .populate("founders", "city country")
      .lean();
    
    if (!startup) {
      return errorResponse("Startup not found", 404);
    }


    const investors = await User.find({ role: "investor" })
      .select(
        "userName name email profileImage bio city country fundingRange isVerified createdAt socialLinks"
      )
      .limit(200)
      .lean();

    if (investors.length === 0) {
      return successResponse(
        { startupId, results: [] },
        "No investors found"
      );
    }

    const sText = describeStartup(startup);
    const iTexts = investors.map(describeInvestor);


    const embeds = await getEmbeddings([sText, ...iTexts]).catch(
      () => undefined
    );

    let embeddingSims: number[] | undefined;
    if (embeds && embeds.length === iTexts.length + 1) {
      const sVec = embeds[0]!;
      embeddingSims = iTexts.map((_, idx) => cosineSim(sVec, embeds[idx + 1]!));
    }


    const scored = investors.map((inv, idx) => {
      const { score, reasons } = calculateScore(
        startup,
        inv,
        embeddingSims?.[idx]
      );
      return {
        investor: inv,
        score,
        reasons,
      };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Take top K
    const top = scored.slice(0, Math.max(1, Math.min(topK, 20)));

    const results = top.map(({ investor, score, reasons }) => ({
      investorId: String(investor._id),
      userName: investor.userName,
      name: investor.name,
      bio: investor.bio,
      city: investor.city,
      country: investor.country,
      fundingRange: investor.fundingRange,
      isVerified: investor.isVerified,
      profileImage: investor.profileImage,
      similarity: Math.round(score * 100) / 100,
      reasons,
    }));

    return successResponse(
      { startupId, results },
      "Matches generated successfully"
    );
  } catch (e: any) {
    console.error("Match API error:", e);
    return errorResponse(e?.message || "Failed to generate matches", 500);
  }
}
