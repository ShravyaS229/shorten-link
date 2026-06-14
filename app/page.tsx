import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-24">
        <Hero />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">

        {/* FIX: heading added + visible */}
        <h2 className="text-3xl font-bold mb-8 text-white">
          Features
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Smart Links"
            description="Create custom short URLs with memorable aliases."
          />

          <FeatureCard
            title="Scheduling"
            description="Set go-live and expiry dates for every link."
          />

          <FeatureCard
            title="Analytics"
            description="Track clicks and monitor link performance."
          />

          <FeatureCard
            title="Fast Redirects"
            description="Instant redirection powered by Next.js and Prisma."
          />
        </div>

        <div className="mt-16 flex gap-4">
          <a
            href="/create"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
          >
            Create Link
          </a>

          <a
            href="/dashboard"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900"
          >
            Dashboard
          </a>
        </div>
      </section>
    </main>
  );
}