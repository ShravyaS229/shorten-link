export default function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-500">
          FLCut
        </h1>

        <div className="flex gap-6 text-slate-300">
          <a href="/">Home</a>
          <a href="/create">Create</a>
          <a href="/dashboard">Dashboard</a>
        </div>
      </div>
    </nav>
  );
}