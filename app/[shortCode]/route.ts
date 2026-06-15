import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await context.params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
    include: { clickEvents: true },
  });

  if (!link) {
    return Response.json(
      {
        error: "Link not found",
      },
      { status: 404 }
    );
  }

  const now = new Date();

  return Response.json({
    shortCode: link.shortCode,
    now: now.toISOString(),
    goLiveAt: link.goLiveAt
      ? link.goLiveAt.toISOString()
      : null,
    expiresAt: link.expiresAt
      ? link.expiresAt.toISOString()
      : null,
    nowTimestamp: now.getTime(),
    goLiveTimestamp: link.goLiveAt
      ? link.goLiveAt.getTime()
      : null,
    expiresTimestamp: link.expiresAt
      ? link.expiresAt.getTime()
      : null,
    isBeforeGoLive: link.goLiveAt
      ? now < link.goLiveAt
      : false,
    isExpired: link.expiresAt
      ? now > link.expiresAt
      : false,
  });
}