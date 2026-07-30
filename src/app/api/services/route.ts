import { NextResponse } from "next/server";
import { services, projects } from "@/data/content";

export async function GET() {
  const enriched = services.map((s) => ({
    tag: s.tag,
    title: s.title,
    description: s.description,
    projectCount: projects.filter((p) => p.service === s.tag).length,
    featuredCount: projects.filter((p) => p.service === s.tag && p.featured)
      .length,
    completedCount: projects.filter(
      (p) => p.service === s.tag && p.status === "Completed"
    ).length,
  }));

  return NextResponse.json(
    {
      services: enriched,
      totalProjects: projects.length,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
