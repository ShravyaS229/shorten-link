"use client";

import { useState } from "react";

export default function CreatePage() {
  const [form, setForm] = useState({
    originalUrl: "",
    customAlias: "",
    goLiveAt: "",
    expiresAt: "",
  });

  const [result, setResult] = useState("");

  async function createLink() {
    setResult("");

    const convertToUTC = (local: string) => {
      if (!local) return "";

      const [date, time] = local.split("T");

      const [year, month, day] = date.split("-").map(Number);
      const [hour, minute] = time.split(":").map(Number);

      const utc = new Date(
        Date.UTC(year, month - 1, day, hour - 5, minute - 30)
      );

      return utc.toISOString();
    };

    const payload = {
      ...form,
      goLiveAt: form.goLiveAt ? convertToUTC(form.goLiveAt) : "",
      expiresAt: form.expiresAt ? convertToUTC(form.expiresAt) : "",
    };

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setResult(`Success: ${data.shortUrl}`);
    } else {
      setResult(data.error || "Error occurred");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold mb-2">
          Create Smart Link
        </h1>

        <p className="text-sm text-slate-400 mb-6">
          Create a custom short URL
        </p>

        <input
          placeholder="Original URL"
          className="w-full p-3 mb-3 bg-slate-800 rounded"
          onChange={(e) =>
            setForm({ ...form, originalUrl: e.target.value })
          }
        />

        <input
          placeholder="Custom Alias"
          className="w-full p-3 mb-3 bg-slate-800 rounded"
          onChange={(e) =>
            setForm({ ...form, customAlias: e.target.value })
          }
        />

        <label className="text-xs text-slate-400">
          Go Live Date & Time
        </label>
        <input
          type="datetime-local"
          className="w-full p-3 mb-3 bg-slate-800 rounded text-white [color-scheme:dark]"
          onChange={(e) =>
            setForm({ ...form, goLiveAt: e.target.value })
          }
        />

        <label className="text-xs text-slate-400">
          Expiry Date & Time
        </label>
        <input
          type="datetime-local"
          className="w-full p-3 mb-4 bg-slate-800 rounded text-white [color-scheme:dark]"
          onChange={(e) =>
            setForm({ ...form, expiresAt: e.target.value })
          }
        />

        <button
          onClick={createLink}
          className="w-full bg-blue-600 px-6 py-3 rounded font-bold"
        >
          Create Link
        </button>

        {result && (
          <p className="mt-4 text-green-400 text-center">
            {result}
          </p>
        )}
      </div>
    </main>
  );
}