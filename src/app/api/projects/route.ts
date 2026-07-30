import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/data/content";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service");
  const featured = searchParams.get("featured");
  const status = searchParams.get("status");

  let result = [...projects];

  if (service && service !== "all") {
    result = result.filter((p) => p.service === service);
  }
  if (featured === "true") {
    result = result.filter((p) => p.featured);
  }
  if (status) {
    result = result.filter(
      (p) => p.status.toLowerCase() === status.toLowerCase()
    );
  }

  return NextResponse.json(
    {
      projects: result,
      total: result.length,
      totalAll: projects.length,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
