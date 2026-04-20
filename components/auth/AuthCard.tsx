import type { ReactNode } from 'react';

type AuthCardProps = {
  title: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-center text-3xl font-bold font-heebo">{title}</h1>
      {children}
      <div className="mt-4 text-center text-slate-600">{footer}</div>
    </div>
  );
}