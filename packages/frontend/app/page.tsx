async function getData(): Promise<{ health: unknown; company: unknown }> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3000';
  const [health, company] = await Promise.all([
    fetch(`${base}/api/health`, { cache: 'no-store' }).then((r) => r.json()),
    fetch(`${base}/api/invoices/_meta/company`, { cache: 'no-store' }).then((r) =>
      r.json(),
    ),
  ]);
  return { health, company };
}

export default async function Page() {
  let data: { health: unknown; company: unknown } | null = null;
  let err: string | null = null;
  try {
    data = await getData();
  } catch (e) {
    err = e instanceof Error ? e.message : 'unknown error';
  }

  return (
    <main style={{ maxWidth: 820, margin: '48px auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, margin: 0 }}>invoice-saas</h1>
      <p style={{ opacity: 0.7, marginTop: 8 }}>
        ACE Distribute-as-SaaS end-to-end test harness. Minimal NestJS + Next.js.
      </p>
      {err && (
        <pre style={{ color: '#ff7070', background: '#1a1020', padding: 12 }}>
          backend unreachable: {err}
        </pre>
      )}
      {data && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18 }}>Runtime</h2>
          <pre
            style={{
              background: '#111118',
              padding: 16,
              borderRadius: 8,
              overflow: 'auto',
            }}
          >
{JSON.stringify(data, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}
