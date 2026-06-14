import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const links = await prisma.link.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalLinks = links.length;

  const totalClicks = links.reduce(
    (sum, link) => sum + link.clicks,
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-8 text-5xl font-bold">
          Analytics Dashboard
        </h1>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Total Links
            </h2>

            <p className="mt-3 text-4xl font-bold text-blue-400">
              {totalLinks}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Total Clicks
            </h2>

            <p className="mt-3 text-4xl font-bold text-green-400">
              {totalClicks}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-6 text-2xl font-bold">
            All Links
          </h2>

          {links.length === 0 ? (
            <p className="text-slate-400">
              No links created yet.
            </p>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="rounded-xl bg-slate-800 p-4"
                >
                  <p className="font-semibold text-blue-400">
                    /{link.shortCode}
                  </p>

                  <p className="mt-2 break-all text-slate-300">
                    {link.originalUrl}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Clicks: {link.clicks}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}