'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [api, setApi] = useState('Checking API…');
  useEffect(() => {
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(base + '/health');
        const json = await res.json();
        setApi(json.ok ? '✅ API healthy' : '❌ API not healthy');
      } catch (e: any) {
        setApi('❌ API error: ' + e.message);
      }
    })();
  }, []);
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">{api}</h1>
    </main>
  );
}
