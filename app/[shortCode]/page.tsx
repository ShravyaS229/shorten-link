import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { shortCode: string };
}) {
  const link = await prisma.link.findUnique({
    where: { shortCode: params.shortCode },
  });

  if (!link) {
    return <h1>Link not found</h1>;
  }

  const now = new Date();

  // NOT ACTIVE
  if (link.goLiveAt && now < link.goLiveAt) {
    return <h1>⛔ Link not active yet</h1>;
  }

  // EXPIRED
  if (link.expiresAt && now > link.expiresAt) {
    return <h1>⛔ Link expired</h1>;
  }

  // track clicks
  await prisma.link.update({
    where: { shortCode: params.shortCode },
    data: { clicks: { increment: 1 } },
  });

  redirect(link.originalUrl);
}