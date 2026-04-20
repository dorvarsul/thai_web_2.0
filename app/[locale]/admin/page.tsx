import { createClient } from '@/lib/supabase-server';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  await params; // Satisfy the async requirement
  const supabase = await createClient();

  const [products, categories] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true })
  ]);

  const stats = [
    { label: 'Total Products', value: products.count || 0 },
    { label: 'Categories', value: categories.count || 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500 uppercase font-bold">{stat.label}</p>
            <p className="text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}