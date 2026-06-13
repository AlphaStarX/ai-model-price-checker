// ─── Cron: Update Pricing ───────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Dynamically import the update job to avoid bundling it into client code
    const { updateAllPricing } = await import(
      "@/server/jobs/update-all-pricing"
    );
    const result = await updateAllPricing();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Pricing update failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
