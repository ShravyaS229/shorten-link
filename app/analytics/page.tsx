import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  const events = await prisma.clickEvent.findMany({
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="space-y-4">
        {events.map((e) => (
          <div key={e.id} className="bg-slate-900 p-4 rounded-xl">
            <p>{new Date(e.timestamp).toString()}</p>
            <p className="text-slate-400">{e.referrer}</p>
            <p className="text-slate-500">{e.userAgent}</p>
          </div>
        ))}
      </div>
    </div>
  );
}