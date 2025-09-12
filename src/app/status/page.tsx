'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

type EnvCheck = { SUPABASE_URL_present: boolean; SUPABASE_ANON_KEY_present: boolean };

export default function StatusPage() {
  const [health, setHealth] = useState<string>('Checking…');
  const [version, setVersion] = useState<string>('Checking…');
  const [env, setEnv] = useState<string>('Checking…');
  const [raw, setRaw] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const [h, v, e] = await Promise.all([
          fetch(`${API}/health`).then(r => r.json()),
          fetch(`${API}/version`).then(r => r.json()),
          fetch(`${API}/env-check`).then(r => r.json()),
        ]);

        setHealth(h?.ok ? '✅ /health OK' : '❌ /health FAIL');
        setVersion(v?.version ? `✅ /version ${v.version}` : '❌ /version FAIL');

        const ec = e as EnvCheck;
        setEnv(
          ec && typeof ec === 'object'
            ? `Env: URL=${ec.SUPABASE_URL_present ? '✅' : '❌'}  ANON=${ec.SUPABASE_ANON_KEY_present ? '✅' : '❌'}`
            : '❌ /env-check FAIL'
        );

        setRaw({ health: h, version: v, env: e });
      } catch (err: any) {
        setHealth(`❌ Error: ${err.message}`);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Status</h1>
      <div>{health}</div>
      <div>{version}</div>
      <div>{env}</div>
      <pre className="p-4 bg-gray-100 rounded">{JSON.stringify(raw, null, 2)}</pre>
    </main>
  );
}
