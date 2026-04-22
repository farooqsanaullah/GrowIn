import OpenAI from "openai";

export type Vector = number[];


export function cosineSim(a: Vector, b: Vector): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}


export function jaccardSim(a: string, b: string): number {
  const toksA = new Set(tokenize(a));
  const toksB = new Set(tokenize(b));
  let inter = 0;
  toksA.forEach((t) => {
    if (toksB.has(t)) inter++;
  });
  const union = toksA.size + toksB.size - inter;
  return union === 0 ? 0 : inter / union;
}


function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2)
    .slice(0, 512);
}


export async function getEmbeddings(
  texts: string[]
): Promise<Vector[] | undefined> {
  if (!process.env.OPENAI_API_KEY) return undefined;
  
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });
    return res.data.map((d) => d.embedding as Vector);
  } catch (error) {
    console.error("Embeddings error:", error);
    return undefined;
  }
}
