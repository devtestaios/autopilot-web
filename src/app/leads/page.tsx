"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  created_at: string;
};

export default function LeadsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL as string; // must be set in Vercel
  const [leads, setLeads] = useState<Lead[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [source, setSource] = useState("web");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const r = await fetch(`${API}/leads`, { cache: "no-store" });
      if (!r.ok) throw new Error(`GET /leads -> ${r.status}`);
      const data = await r.json();
      setLeads(data);
    } catch (e: any) {
      setErr(e.message || "Failed to load leads");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const r = await fetch(`${API}/leads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || null,
          source: source || "web",
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.detail || `POST /leads -> ${r.status}`);
      setMsg("Lead saved!");
      setEmail("");
      setName("");
      setSource("web");
      await load();
    } catch (e: any) {
      setErr(e.message || "Failed to save lead");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "1rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Leads</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="email"
          required
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ padding: "0.5rem" }}
        />
        <button disabled={loading} type="submit" style={{ padding: "0.6rem 1rem" }}>
          {loading ? "Saving..." : "Add Lead"}
        </button>
      </form>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {leads.length === 0 && <p>No leads yet.</p>}
        {leads.map((l) => (
          <div key={l.id} style={{ border: "1px solid #ddd", padding: "0.75rem", borderRadius: 8 }}>
            <div><strong>{l.email}</strong></div>
            <div>{l.name || "—"}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              source: {l.source || "—"} • {new Date(l.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

