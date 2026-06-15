import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  const events = await prisma.clickEvent.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    include: {
      link: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Analytics
      </h1>

      {events.length === 0 ? (
        <p className="text-slate-400">
          No click data available
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((e) => (
            <div
              key={e.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4"
            >
              <p className="text-blue-400 font-semibold">
                /{e.link?.shortCode}
              </p>

              <p className="text-sm text-slate-300">
                {e.link?.originalUrl}
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Time:{" "}
                {new Date(e.createdAt).toLocaleString()}
              </p>

              <p className="text-sm text-slate-400">
                IP: {e.ip}
              </p>

              <p className="text-sm text-slate-400">
                Device:{" "}
                {e.userAgent?.slice(0, 80)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}