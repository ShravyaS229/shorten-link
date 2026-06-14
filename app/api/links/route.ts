import { prisma } from "@/lib/prisma";

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { originalUrl, customAlias, goLiveAt, expiresAt } = body;

  if (!customAlias) {
    return Response.json({ error: "Alias is required" }, { status: 400 });
  }

  const shortCode = customAlias;

  const exists = await prisma.link.findUnique({
    where: { shortCode },
  });

  if (exists) {
    return Response.json({ error: "Alias already exists" }, { status: 400 });
  }

  const link = await prisma.link.create({
    data: {
      originalUrl,
      shortCode,
      goLiveAt: goLiveAt ? new Date(goLiveAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return Response.json({
    shortUrl: `http://localhost:3000/${link.shortCode}`,
  });
}