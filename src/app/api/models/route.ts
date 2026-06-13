// ─── API: Models List ───────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/server/actions/models";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q") || undefined;
  const modelFamilies = searchParams.get("families")?.split(",").filter(Boolean);
  const developers = searchParams.get("developers")?.split(",").filter(Boolean);
  const capabilities = searchParams.get("capabilities")?.split(",").filter(Boolean);
  const sort = (searchParams.get("sort") as "name" | "contextWindow" | "releaseDate" | "cheapestPrice") || "name";
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;
  const contextMin = searchParams.get("contextMin");
  const contextMax = searchParams.get("contextMax");

  try {
    const result = await getModels({
      query,
      modelFamilies,
      developers,
      capabilities,
      contextWindowMin: contextMin ? parseInt(contextMin) : undefined,
      contextWindowMax: contextMax ? parseInt(contextMax) : undefined,
      sort,
      page,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 },
    );
  }
}
