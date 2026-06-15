import { prisma } from "@/lib/prisma";
import { isReserved } from "@/lib/reserved";
import { generateShortCode } from "@/lib/slug";

function parseLocalDateTime(dateTime: string): Date {
  const [datePart, timePart] = dateTime.split("T");

  const [year, month, day] = datePart
    .split("-")
    .map(Number);

  const [hour, minute] = timePart
    .split(":")
    .map(Number);

  const utcMillis = Date.UTC(
    year,
    month - 1,
    day,
    hour - 5,
    minute - 30
  );

  return new Date(utcMillis);
}

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

  if (shortCode) {
    if (isReserved(shortCode)) {
      return Response.json(
        { error: "Alias is reserved" },
        { status: 400 }
      );
    }

    const exists = await prisma.link.findUnique({
      where: {
        shortCode,
      },
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

  const goLiveDate = goLiveAt
    ? parseLocalDateTime(goLiveAt)
    : null;

  const expiryDate = expiresAt
    ? parseLocalDateTime(expiresAt)
    : null;

  if (
    goLiveDate &&
    expiryDate &&
    expiryDate <= goLiveDate
  ) {
    return Response.json(
      {
        error:
          "Expiry must be after Go Live time",
      },
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