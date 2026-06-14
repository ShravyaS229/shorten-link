"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function CreatePage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");

  const [goLiveDate, setGoLiveDate] = useState("");
  const [goLiveTime, setGoLiveTime] = useState("");

  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function createLink() {
    if (!originalUrl) {
      setMessage("Original URL is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl,
          customAlias,

          goLiveAt:
            goLiveDate && goLiveTime
              ? `${goLiveDate}T${goLiveTime}`
              : "",

          expiresAt:
            expiryDate && expiryTime
              ? `${expiryDate}T${expiryTime}`
              : "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          `Created Successfully: ${window.location.origin}/${data.shortCode}`
        );
      } else {
        setMessage(
          data.message || "Failed to create link"
        );
      }
    } catch {
      setMessage("Server Error");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Create Smart Link
          </h1>

          <p className="mt-3 text-slate-400">
            Create, schedule, track and manage
            intelligent short links.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* LEFT PANEL */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <h2 className="mb-6 text-2xl font-bold">
              Link Configuration
            </h2>

            <div className="space-y-6">

              <div>
                <label className="mb-2 block font-medium">
                  Original URL
                </label>

                <input
                  type="url"
                  placeholder="https://github.com"
                  value={originalUrl}
                  onChange={(e) =>
                    setOriginalUrl(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Custom Alias
                </label>

                <input
                  type="text"
                  placeholder="github-demo"
                  value={customAlias}
                  onChange={(e) =>
                    setCustomAlias(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4"
                />
              </div>

              <div className="rounded-2xl border border-blue-800 p-5">

                <h3 className="text-lg font-bold text-blue-400">
                  Go Live Schedule (Optional)
                </h3>

                <p className="mt-1 mb-4 text-sm text-slate-400">
                  Choose when the link becomes active.
                </p>

                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block">
                      Date
                    </label>

                    <input
                      type="date"
                      value={goLiveDate}
                      onChange={(e) =>
                        setGoLiveDate(e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block">
                      Time
                    </label>

                    <input
                      type="time"
                      value={goLiveTime}
                      onChange={(e) =>
                        setGoLiveTime(e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
                    />
                  </div>

                </div>
              </div>

              <div className="rounded-2xl border border-red-800 p-5">

                <h3 className="text-lg font-bold text-red-400">
                  Expiry Schedule (Optional)
                </h3>

                <p className="mt-1 mb-4 text-sm text-slate-400">
                  Disable the link automatically.
                </p>

                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block">
                      Date
                    </label>

                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) =>
                        setExpiryDate(e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block">
                      Time
                    </label>

                    <input
                      type="time"
                      value={expiryTime}
                      onChange={(e) =>
                        setExpiryTime(e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
                    />
                  </div>

                </div>
              </div>

              <button
                onClick={createLink}
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 p-4 text-lg font-semibold hover:bg-blue-700"
              >
                {loading
                  ? "Creating..."
                  : "Create Link"}
              </button>

              {message && (
                <div className="rounded-xl border border-green-700 bg-green-900/30 p-4">
                  {message}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT PANEL */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <h2 className="mb-6 text-2xl font-bold">
              Live Preview
            </h2>

            <div className="space-y-5">

              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Short URL
                </p>

                <p className="mt-2 text-lg font-semibold text-blue-400">
                  {customAlias
                    ? `flcut.vercel.app/${customAlias}`
                    : "flcut.vercel.app/your-link"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Destination
                </p>

                <p className="mt-2 break-all">
                  {originalUrl || "No URL selected"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Go Live
                </p>

                <p className="mt-2">
                  {goLiveDate
                    ? `${goLiveDate} ${goLiveTime}`
                    : "Immediately"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Expiry
                </p>

                <p className="mt-2">
                  {expiryDate
                    ? `${expiryDate} ${expiryTime}`
                    : "Never"}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}