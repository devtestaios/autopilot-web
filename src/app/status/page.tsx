'use client';
import { useEffect, useState } from 'react';

type PingResult =
  | { ok: true; status?: number; url?: string; extra?: Record<string, unknown> }
  | { ok: false; error: string; status?: number };

const api = process.env.NEXT_PUBLIC_API_URL ?? '';
export default function StatusPage() {
  const [health, setHealth] = useState<PingResult | null>(null);
  const [version, setVersion] = useState<PingResult | null>(null);
  const [env, setEnv] = useState<PingResult | null>(null);

  useEffect(() => {
    if (!api) {
      const err: PingResult = { ok: false, error: 'NEXT_PUBLIC_API_URL is missing' };
      setHealth(err);
      setVersion(err);
      setEnv(err);
      return;
    }

    const fetchJson = async (path: string) => {
      try {
        const res = await fetch(`${api}${path}`, { cache: 'no-store' });
        const json = (await res.json()) as unknown as Record<string, unknown>;
        return { ok: res.ok, status: res.status, extra: json } as PingResult;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return { ok: false, error: msg } as PingResult;
      }
    };

    (async () => {
      const [h, v, e] = await Promise.all([
        fetchJson('/health'),
        fetchJson('/version'),
        fetchJson('/env-check'),
      ]);
      setHealth(h);
      setVersion(v);
      setEnv(e);
    })();
  }, []);

  const Tile = ({ title, data }: { title: string; data: PingResult | null }) => (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="mb-2 text-sm text-gray-500">{title}</div>
      {!data ? (
        <div>Checking…</div>
      ) : data.ok ? (
        <div className="font-medium">✅ OK {data.status ? `(HTTP ${data.status})` : ''}</div>
      ) : (
        <div className="font-medium text-red-600">
          ❌ {data.error} {data.status ? `(HTTP ${data.status})` : ''}
        </div>
      )}
      {data?.ok && data.extra ? (
        <pre className="mt-2 overflow-auto rounded-md bg-gray-50 p-3 text-xs">
          {JSON.stringify(data.extra, null, 2)}
        </pre>
      ) : null}
      {!data?.ok && (data as any)?.extra ? (
        <pre className="mt-2 overflow-auto rounded-md bg-gray-50 p-3 text-xs">
          {JSON.stringify((data as any).extra, null, 2)}
        </pre>
      ) : null}
    </div>
  );

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">System Status</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Tile title={`Health (${api || 'API URL not set'})`} data={health} />
        <Tile title="Version" data={version} />
        <Tile title="Env Check (server)" data={env} />
      </div>
      <p className="text-sm text-gray-500">
        Tip: set <code>NEXT_PUBLIC_API_URL</code> in Vercel → Project → Settings → Environment
        Variables (Production &amp; Preview).
      </p>
    </main>
  );
}
