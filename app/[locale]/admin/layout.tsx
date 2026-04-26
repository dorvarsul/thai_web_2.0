import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar: Hidden on mobile, fixed width on desktop */}
      <AdminSidebar locale={locale} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header: Fixed height, contains Mobile Toggle and Locale indicator */}
        <AdminHeader locale={locale} />
        
        {/* Main Content: Adjust padding for mobile (p-4) vs desktop (p-8) */}
        <main className="p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}