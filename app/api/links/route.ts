import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      originalUrl,
      customAlias,
      goLiveAt,
      expiresAt,
    } = body;

    const shortCode =
      customAlias || Math.random().toString(36).substring(2, 8);

    const exists = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (exists) {
      return Response.json(
        { error: "Alias already exists" },
        { status: 400 }
      );
    }

    const link = await prisma.link.create({
      data: {
        originalUrl,
        shortCode,
        goLiveAt: goLiveAt ? new Date(goLiveAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    return Response.json({
      success: true,
      shortUrl: `${base}/${shortCode}`,
      link,
    });
  } catch (err) {
  console.error("CREATE LINK ERROR:", err);

  return Response.json(
    {
      error: String(err),
    },
    { status: 500 }
  );
}
}