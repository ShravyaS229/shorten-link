import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  const events = await prisma.clickEvent.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
    include: {
      link: true,
    },
  });

  const timeSeries: Record<string, number> = {};

  events.forEach((e) => {
    const day = new Date(
      e.createdAt
    ).toLocaleDateString();

    timeSeries[day] =
      (timeSeries[day] || 0) + 1;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Analytics
      </h1>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Clicks Per Day
        </h2>

        <div className="space-y-2">
          {Object.entries(timeSeries).map(
            ([day, count]) => (
              <div
                key={day}
                className="bg-slate-900 p-3 rounded-lg border border-slate-800"
              >
                {day} → {count} clicks
              </div>
            )
          )}
        </div>
      </div>

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
              {new Date(
                e.createdAt
              ).toLocaleString()}
            </p>

            <p className="text-sm text-slate-400">
              IP: {e.ip}
            </p>

            <p className="text-sm text-slate-400">
              Referrer: {e.referrer}
            </p>

            <p className="text-sm text-slate-400">
              Country: {e.country}
            </p>

            <p className="text-sm text-slate-400">
              City: {e.city}
            </p>

            <p className="text-sm text-slate-400">
              Device:{" "}
              {e.userAgent?.slice(0, 80)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}