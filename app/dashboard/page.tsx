import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

        <div className="mb-6 p-4 bg-slate-900 border border-slate-800 rounded-lg">
          Total Clicks: <span className="text-blue-400 font-bold">{totalClicks}</span>
        </div>

        <div className="space-y-4">
          {links.map((l) => (
            <div key={l.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <p className="text-blue-400">/{l.shortCode}</p>
              <p>{l.originalUrl}</p>
              <p className="text-slate-400">Clicks: {l.clicks}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}