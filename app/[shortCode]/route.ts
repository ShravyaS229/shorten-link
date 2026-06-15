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
    return new Response("Not found", { status: 404 });
  }

  const now = new Date();

  // Not live yet
  if (link.goLiveAt && now < link.goLiveAt) {
    return new Response("Link not live yet", { status: 403 });
  }

  // expired
  if (link.expiresAt && now > link.expiresAt) {
    return new Response("Link expired", { status: 410 });
  }

  const ip =
    req.headers.get("x-forwarded-for") || "unknown";

  const userAgent = req.headers.get("user-agent") || "unknown";
  const referrer = req.headers.get("referer") || "direct";

  // unique check
  const existing = await prisma.clickEvent.findFirst({
    where: {
      linkId: link.id,
      ip,
      userAgent,
    },
  });

  const isUnique = !existing;

  await prisma.clickEvent.create({
    data: {
      linkId: link.id,
      ip,
      userAgent,
      referrer,
    },
  });

  await prisma.link.update({
    where: { id: link.id },
    data: {
      clicks: { increment: 1 },
    },
  });

  return Response.redirect(link.originalUrl, 302);
}