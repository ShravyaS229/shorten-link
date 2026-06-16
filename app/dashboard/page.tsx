import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const links = await prisma.link.findMany({
    include: {
      clickEvents: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="text-lg mb-4">
        Total Links: {links.length}
      </div>

      <div className="space-y-6">
        {links.map((link) => {
          const uniqueClicks = new Set(
            link.clickEvents.map(
              (c) => `${c.ip}-${c.userAgent}`
            )
          ).size;

          return (
            <div
              key={link.id}
              className="bg-slate-900 p-4 rounded-xl border border-slate-800"
            >
              <p className="text-blue-400 font-semibold">
                /{link.shortCode}
              </p>

              <p className="text-slate-300">
                {link.originalUrl}
              </p>

              <p className="mt-2">
                Clicks: {link.clicks}
              </p>

              <p>
                Unique Clicks: {uniqueClicks}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}