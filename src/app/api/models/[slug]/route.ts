// ─── API: Single Model Detail ───────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getModelBySlug } from "@/server/actions/models";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const model = await getModelBySlug(slug);

    if (!model) {
      return NextResponse.json(
        { error: "Model not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(model);
  } catch (error) {
    console.error(`Error fetching model ${slug}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch model" },
      { status: 500 },
    );
  }
}
