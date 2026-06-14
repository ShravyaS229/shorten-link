"use client";

import { useState } from "react";

export default function Create() {
  const [form, setForm] = useState({
    originalUrl: "",
    customAlias: "",
    goLiveDate: "",
    goLiveTime: "",
    expiryDate: "",
    expiryTime: "",
  });

  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    const goLive =
      form.goLiveDate && form.goLiveTime
        ? new Date(`${form.goLiveDate}T${form.goLiveTime}:00`)
        : null;

    const expiry =
      form.expiryDate && form.expiryTime
        ? new Date(`${form.expiryDate}T${form.expiryTime}:00`)
        : null;

    const res = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({
        originalUrl: form.originalUrl,
        customAlias: form.customAlias,
        goLiveAt: goLive,
        expiresAt: expiry,
      }),
    });

    const data = await res.json();
    setResult(data.shortUrl || data.error);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Smart Link</h2>

      <input
        placeholder="Original URL"
        onChange={(e) =>
          setForm({ ...form, originalUrl: e.target.value })
        }
      />

      <input
        placeholder="Alias"
        onChange={(e) =>
          setForm({ ...form, customAlias: e.target.value })
        }
      />

      <h4>Go Live</h4>
      <input
        type="date"
        onChange={(e) =>
          setForm({ ...form, goLiveDate: e.target.value })
        }
      />
      <input
        type="time"
        onChange={(e) =>
          setForm({ ...form, goLiveTime: e.target.value })
        }
      />

      <h4>Expiry</h4>
      <input
        type="date"
        onChange={(e) =>
          setForm({ ...form, expiryDate: e.target.value })
        }
      />
      <input
        type="time"
        onChange={(e) =>
          setForm({ ...form, expiryTime: e.target.value })
        }
      />

      <button onClick={handleSubmit}>
        Create Link
      </button>

      <p>{result}</p>
    </div>
  );
}