import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import User from "@/lib/models/user.model";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import OpenAI from "openai";

type Body = {
  startupId: string;
  investorId: string;
  tone?: "formal" | "friendly" | "concise";
};


function generateTemplateOutreach(
  startup: any,
  investor: any,
  reasons: string[],
  tone: string
): { subject: string; body: string } {
  const startupName = startup.title;
  const founderName = startup.founders?.[0]?.name || startup.founders?.[0]?.userName || "the founder";
  const investorName = investor.name || investor.userName;
  const industry = startup.industry;

  const subject = `Introduction: ${startupName} - ${industry}`;

  let greeting = "";
  let intro = "";
  let fit = "";
  let traction = "";
  let ask = "";

  if (tone === "formal") {
    greeting = `Dear ${investorName},`;
    intro = `I am ${founderName}, founder of ${startupName}. We are building ${startup.description?.slice(0, 120)}...`;
    fit = `I believe we align well with your investment thesis:\n${reasons.map((r) => `• ${r}`).join("\n")}`;
    traction = startup.ratingCount > 0
      ? `We've gained ${startup.followers?.length || 0} followers and maintain a ${startup.avgRating?.toFixed(1)} rating from ${startup.ratingCount} reviews.`
      : `We're building momentum with ${startup.followers?.length || 0} followers on the platform.`;
    ask = `I would appreciate the opportunity to discuss how ${startupName} might fit your portfolio. Would you be available for a brief 20-minute call next week?`;
  } else if (tone === "friendly") {
    greeting = `Hi ${investorName},`;
    intro = `I'm ${founderName}, building ${startupName}. Quick intro: ${startup.description?.slice(0, 100)}...`;
    fit = `I think we'd be a great fit because:\n${reasons.map((r) => `• ${r}`).join("\n")}`;
    traction = startup.ratingCount > 0
      ? `We've got ${startup.followers?.length || 0} followers and a solid ${startup.avgRating?.toFixed(1)}/5 rating.`
      : `Early traction: ${startup.followers?.length || 0} followers and growing.`;
    ask = `Would love to chat for 15-20 mins and see if there's a fit. Let me know if you're interested!`;
  } else {
    // concise
    greeting = `Hi ${investorName},`;
    intro = `${founderName} here, founder of ${startupName} (${industry}).`;
    fit = `Why we match:\n${reasons.map((r) => `• ${r}`).join("\n")}`;
    traction = startup.ratingCount > 0
      ? `${startup.followers?.length || 0} followers, ${startup.avgRating?.toFixed(1)}/5 rating.`
      : `${startup.followers?.length || 0} followers.`;
    ask = `Open for a 15-min intro call?`;
  }

  const body = `${greeting}\n\n${intro}\n\n${fit}\n\n${traction}\n\n${ask}\n\nBest regards,\n${founderName}`;

  return { subject, body };
}


async function generateAIOutreach(
  startup: any,
  investor: any,
  reasons: string[],
  tone: string
): Promise<{ subject: string; body: string } | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const founderName = startup.founders?.[0]?.name || startup.founders?.[0]?.userName || "the founder";
    const investorName = investor.name || investor.userName;
    
    const systemPrompt = `You are an expert at writing concise, professional investor outreach emails for startups. 
Be specific, respectful, and human. Avoid overclaiming or generic statements.
Keep it 120-180 words total. Use a ${tone} tone.`;

    const userPrompt = `Write an outreach email from ${founderName} (founder of ${startup.title}) to ${investorName} (investor).

Startup details:
- Name: ${startup.title}
- Industry: ${startup.industry}
- Description: ${startup.description?.slice(0, 300)}
- Traction: ${startup.followers?.length || 0} followers, ${startup.ratingCount || 0} reviews, ${startup.avgRating?.toFixed(1) || "N/A"}/5 rating

Why this investor is a fit:
${reasons.map((r) => `- ${r}`).join("\n")}

Investor details:
- Name: ${investorName}
- Bio: ${investor.bio?.slice(0, 200) || "Professional investor"}
- Location: ${[investor.city, investor.country].filter(Boolean).join(", ") || "N/A"}

Generate a subject line and email body. The ask should be for a brief intro call (15-20 mins).

Return as JSON: { "subject": "...", "body": "..." }`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    return {
      subject: parsed.subject || "Introduction",
      body: parsed.body || "",
    };
  } catch (error) {
    console.error("AI outreach generation error:", error);
    return null;
  }
}


function getMatchReasons(startup: any, investor: any): string[] {
  const reasons: string[] = [];


  const industryTokens = (startup.industry || "")
    .toLowerCase()
    .split(/[\/,&\s]+/)
    .map((t: string) => t.trim())
    .filter(Boolean);
  const bioLower = (investor.bio || "").toLowerCase();
  
  for (const token of industryTokens) {
    if (bioLower.includes(token)) {
      reasons.push(`Industry match: ${startup.industry}`);
      break;
    }
  }


  if (investor.fundingRange) {
    const min = investor.fundingRange.min || "0";
    const max = investor.fundingRange.max || "unlimited";
    reasons.push(`Funding range: ${min}-${max}`);
  }


  const loc = [investor.city, investor.country].filter(Boolean).join(", ");
  if (loc) {
    reasons.push(`Location: ${loc}`);
  }


  if (investor.isVerified) {
    reasons.push("Verified investor");
  }

  return reasons.slice(0, 3);
}


export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const { startupId, investorId, tone = "friendly" } = body || {};

    if (!startupId || !investorId) {
      return errorResponse("startupId and investorId required", 400);
    }

    await connectDB();

    const [startup, investor] = await Promise.all([
      Startup.findById(startupId)
        .populate("founders", "name userName")
        .lean(),
      User.findById(investorId)
        .select(
          "userName name bio city country fundingRange isVerified profileImage"
        )
        .lean(),
    ]);

    if (!startup) {
      return errorResponse("Startup not found", 404);
    }

    if (!investor) {
      return errorResponse("Investor not found", 404);
    }


    const reasons = getMatchReasons(startup, investor);


    let result = await generateAIOutreach(startup, investor, reasons, tone);

    if (!result) {
      result = generateTemplateOutreach(startup, investor, reasons, tone);
    }

    return successResponse(result, "Outreach generated successfully");
  } catch (e: any) {
    console.error("Outreach API error:", e);
    return errorResponse(e?.message || "Failed to generate outreach", 500);
  }
}
