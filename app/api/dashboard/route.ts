import { prisma } from "@/lib/prisma";

export async function GET() {
  const links = await prisma.link.findMany({
    include: {
      clickEvents: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalClicks = links.reduce(
    (sum, l) => sum + l.clicks,
    0
  );

  const enriched = links.map((l) => ({
    id: l.id,
    shortCode: l.shortCode,
    originalUrl: l.originalUrl,
    clicks: l.clicks,
    uniqueClicks: l.clickEvents.length,
    createdAt: l.createdAt,
  }));

  return Response.json({
    totalClicks,
    links: enriched,
  });
}