'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [api, setApi] = useState('Checking API…');

  useEffect(() => {
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) {
          setApi('❌ Missing NEXT_PUBLIC_API_URL');
          return;
        }
        const res = await fetch(`${base}/health`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: { ok?: boolean } = await res.json();
        setApi(json.ok ? '✅ API healthy' : '❌ API not healthy');
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : typeof e === 'string' ? e : 'Unknown error';
        setApi('❌ API error: ' + msg);
      }
    })();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">{api}</h1>
    </main>
  );
}
