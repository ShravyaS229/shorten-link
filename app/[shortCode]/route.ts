import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await context.params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
  });

  if (!link) {
    return Response.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  const now = new Date();

  return Response.json({
    shortCode: link.shortCode,
    now: now.toISOString(),
    goLiveAt: link.goLiveAt?.toISOString(),
    expiresAt: link.expiresAt?.toISOString(),
    nowLocal: now.toString(),
    goLiveLocal: link.goLiveAt?.toString(),
    expiresLocal: link.expiresAt?.toString(),
    isBeforeGoLive: link.goLiveAt
      ? now < link.goLiveAt
      : false,
    isExpired: link.expiresAt
      ? now > link.expiresAt
      : false,
  });
}