import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function ShortCodePage({
  params,
}: PageProps) {
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: {
      shortCode,
    },
  });

  if (!link) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">
          Link Not Found
        </h1>
      </div>
    );
  }

  const now = new Date();

  if (link.goLiveAt && now < link.goLiveAt) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">
          Link not active yet
        </h1>
      </div>
    );
  }

  if (link.expiresAt && now > link.expiresAt) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">
          Link expired
        </h1>
      </div>
    );
  }

  await prisma.link.update({
    where: {
      shortCode,
    },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });

  redirect(link.originalUrl);
}