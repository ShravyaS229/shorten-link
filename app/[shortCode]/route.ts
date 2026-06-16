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
    return new Response("Not found", { status: 404 });
  }

  const now = new Date();

  if (link.goLiveAt && now < link.goLiveAt) {
    return new Response("Link not live yet", { status: 403 });
  }

  if (link.expiresAt && now > link.expiresAt) {
    return new Response("Link expired", { status: 410 });
  }

  const h = req.headers;

  const forwardedFor = h.get("x-forwarded-for") || "";

  const ip =
    forwardedFor.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  const userAgent = h.get("user-agent") || "unknown";
  const referrer = h.get("referer") || "direct";

 
  const country =
    h.get("x-vercel-ip-country") || "Unknown";

  const city =
    h.get("x-vercel-ip-city") || "Unknown";

  await prisma.clickEvent.create({
    data: {
      linkId: link.id,
      ip,
      userAgent,
      referrer,
      country,
      city,
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