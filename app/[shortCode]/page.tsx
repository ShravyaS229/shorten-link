import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;

  if (!shortCode) {
    return <h1>Invalid Link</h1>;
  }

  const link = await prisma.link.findUnique({
    where: { shortCode },
  });

  if (!link) {
    return <h1>Link Not Found</h1>;
  }

  const now = new Date();

  if (link.goLiveAt && now < link.goLiveAt) {
    return (
      <div>
        <h1>Link Not Active Yet</h1>
        <p>Will activate at: {link.goLiveAt.toString()}</p>
      </div>
    );
  }

  if (link.expiresAt && now > link.expiresAt) {
    return (
      <div>
        <h1>Link Expired</h1>
        <p>Expired at: {link.expiresAt.toString()}</p>
      </div>
    );
  }

  const h = await headers();

  await prisma.clickEvent.create({
    data: {
      linkId: link.id,
      referrer: h.get("referer"),
      userAgent: h.get("user-agent"),
      ip: h.get("x-forwarded-for"),
    },
  });

  await prisma.link.update({
    where: { shortCode },
    data: {
      clicks: { increment: 1 },
    },
  });

  redirect(link.originalUrl);
}