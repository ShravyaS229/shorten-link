import { prisma } from "@/lib/prisma";

export async function registerClick(params: {
  linkId: string;
  req: Request;
}) {
  const { linkId, req } = params;

  const ip =
    req.headers.get("x-forwarded-for") ||
    "unknown";

  const userAgent = req.headers.get("user-agent") || null;
  const referrer = req.headers.get("referer") || "direct";


  const existing = await prisma.clickEvent.findFirst({
    where: {
      linkId,
      ip,
    },
  });

  const isUnique = !existing;


  await prisma.clickEvent.create({
    data: {
      linkId,
      ip,
      userAgent,
      referrer,
    },
  });

 
  if (isUnique) {
    await prisma.link.update({
      where: { id: linkId },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  }

  return {
    isUnique,
  };
}