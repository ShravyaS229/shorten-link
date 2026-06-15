import { prisma } from "@/lib/prisma";
import { isReserved } from "@/lib/reserved";
import { generateShortCode } from "@/lib/slug";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    originalUrl,
    customAlias,
    goLiveAt,
    expiresAt,
  } = body;

  if (!originalUrl) {
    return Response.json(
      { error: "Original URL required" },
      { status: 400 }
    );
  }

  let shortCode = customAlias?.trim();

  // RESERVED WORD CHECK
  if (shortCode) {
    if (isReserved(shortCode)) {
      return Response.json(
        { error: "Alias is reserved" },
        { status: 400 }
      );
    }

    const exists = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (exists) {
      return Response.json(
        { error: "Alias already taken" },
        { status: 400 }
      );
    }
  } else {
    shortCode = await generateShortCode();
  }

  let goLiveDate: Date | null = null;
  let expiryDate: Date | null = null;

  if (goLiveAt) {
    const localDate = new Date(goLiveAt);
    goLiveDate = new Date(localDate.getTime());
  }

  if (expiresAt) {
    const localDate = new Date(expiresAt);
    expiryDate = new Date(localDate.getTime());
  }

  // DATE VALIDATION
  if (goLiveDate && expiryDate && expiryDate <= goLiveDate) {
    return Response.json(
      { error: "Expiry must be after Go Live time" },
      { status: 400 }
    );
  }

  const link = await prisma.link.create({
    data: {
      originalUrl,
      shortCode,
      goLiveAt: goLiveDate,
      expiresAt: expiryDate,
    },
  });

  const host = req.headers.get("host");

  const protocol =
    process.env.NODE_ENV === "development"
      ? "http"
      : "https";

  return Response.json({
    shortUrl: `${protocol}://${host}/${link.shortCode}`,
  });
}