import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { PackagePlus, FolderPlus, ExternalLink, ArrowRight } from 'lucide-react';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();

  // Fetching counts for the overview
  const [products, categories] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true })
  ]);

  const stats = [
    { label: 'Total Products', value: products.count || 0, href: `/${locale}/admin/products` },
    { label: 'Categories', value: categories.count || 0, href: `/${locale}/admin/categories` }, // Assuming this route exists/will exist
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* 1. Header Section */}
      <section>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          System Overview
        </h1>
        <p className="text-slate-500 mt-1">Manage your store inventory and content.</p>
      </section>

      {/* 2. Stats Grid - Mobile: 1 col, Tablet+: 2 col */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Link 
            key={stat.label} 
            href={stat.href}
            className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all active:scale-[0.98] md:hover:shadow-md md:hover:border-slate-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest mb-1">
                  {stat.label}
                </p>
                <p className="text-4xl font-black text-slate-900 leading-none">
                  {stat.value}
                </p>
              </div>
              <div className="p-2 bg-slate-50 rounded-full text-slate-300 group-hover:text-red-600 group-hover:bg-red-50 transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* 3. Mobile-First Quick Actions */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link 
            href={`/${locale}/admin/products/new`}
            className="flex items-center gap-4 p-4 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-100 font-bold active:scale-95 transition-transform"
          >
            <div className="bg-white/20 p-2 rounded-lg">
              <PackagePlus size={20} />
            </div>
            Add New Product
          </Link>
          
          <Link 
            href={`/${locale}/`}
            className="flex items-center gap-4 p-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold active:scale-95 transition-transform"
          >
            <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
              <ExternalLink size={20} />
            </div>
            View Public Store
          </Link>
        </div>
      </section>

      {/* 4. Help/Hint for Thai Content */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4 items-start">
        <div className="text-blue-500 mt-1">💡</div>
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>Tip:</strong> When adding products, the system will automatically fill missing Thai content from Hebrew fields using server-side translation.
        </p>
      </div>
    </div>
  );
}