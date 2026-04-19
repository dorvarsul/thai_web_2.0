import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thai Market | תאי מרקט',
  description: 'Thai e-commerce storefront',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}