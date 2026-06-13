import { ImageResponse } from "next/og";
import { getModelBySlug } from "@/server/actions/models";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { slug: string } }) {
  const model = await getModelBySlug(params.slug);

  if (!model) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#0a0a0a",
            color: "#fafafa",
          }}
        >
          <p style={{ fontSize: 48, fontWeight: 700 }}>Model Not Found</p>
        </div>
      ),
      { ...size },
    );
  }

  const cheapest = model.pricing[0];
  const cheapestPrice = cheapest
    ? `$${cheapest.inputPricePerMillion}/M input`
    : "Compare pricing";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          padding: 80,
          fontFamily: "Geist Sans",
        }}
      >
        {/* Top section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: 20, color: "#a1a1aa", margin: 0 }}>
            {model.developer.name}
            {model.modelFamily ? ` · ${model.modelFamily}` : ""}
          </p>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {model.name}
          </h1>
          {model.description && (
            <p
              style={{
                fontSize: 24,
                color: "#a1a1aa",
                margin: 0,
                marginTop: 8,
                maxWidth: 900,
                lineHeight: 1.4,
              }}
            >
              {model.description.length > 160
                ? model.description.slice(0, 157) + "..."
                : model.description}
            </p>
          )}
        </div>

        {/* Bottom section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272a",
            paddingTop: 32,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <p style={{ fontSize: 28, margin: 0 }}>{cheapestPrice}</p>
            {model.contextWindow && (
              <p
                style={{
                  fontSize: 20,
                  color: "#a1a1aa",
                  margin: 0,
                  padding: "4px 12px",
                  backgroundColor: "#18181b",
                  borderRadius: 8,
                }}
              >
                {model.contextWindow >= 1_000_000
                  ? `${model.contextWindow / 1_000_000}M ctx`
                  : `${(model.contextWindow / 1_000).toFixed(0)}K ctx`}
              </p>
            )}
          </div>
          <p style={{ fontSize: 24, color: "#a1a1aa", margin: 0 }}>
            AI Model Price Checker
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
