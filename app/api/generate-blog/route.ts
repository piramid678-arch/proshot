import { NextRequest } from "next/server";
import { POST as handleGenerateContent } from "../generate-content/route";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  return handleGenerateContent(req);
}
