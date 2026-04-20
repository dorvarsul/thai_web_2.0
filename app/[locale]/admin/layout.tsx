import Link from 'next/link';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 font-bold text-xl border-b border-slate-800">
          Thai Web 2 <span className="text-blue-400 text-sm">Admin</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link href={`/${locale}/admin`} className="block px-4 py-2 hover:bg-slate-800 rounded">Dashboard</Link>
          <Link href={`/${locale}/admin/products`} className="block px-4 py-2 hover:bg-slate-800 rounded">Products</Link>
          <Link href={`/${locale}/`} className="block px-4 py-2 mt-10 bg-slate-800 text-sm text-gray-400 rounded">← Back to Store</Link>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="h-16 bg-white border-b flex items-center justify-end px-8">
          <span className="text-sm font-bold text-gray-400 uppercase">{locale}</span>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}