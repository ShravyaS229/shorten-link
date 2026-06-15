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

  if (link.goLiveAt && now < link.goLiveAt) {
    return new Response("Link not live yet", { status: 403 });
  }

  if (link.expiresAt && now > link.expiresAt) {
    return new Response("Link expired", { status: 410 });
  }

  const ip =
    req.headers.get("x-forwarded-for") || "unknown";

  const userAgent =
    req.headers.get("user-agent") || "unknown";

  const referrer =
    req.headers.get("referer") || "direct";

  let country = "Unknown";
  let city = "Unknown";

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}`
    );

    const data = await res.json();

    country = data.country || "Unknown";
    city = data.city || "Unknown";
  } catch {}

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
      clicks: {
        increment: 1,
      },
    },
  });

  return Response.redirect(link.originalUrl, 302);
}