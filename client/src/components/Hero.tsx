import { Search } from 'lucide-react'

// src/components/Hero.tsx
export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[360px] w-full items-center justify-center overflow-hidden px-4 py-16 text-center text-white md:min-h-[430px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-[#2b57a7]/85" />

      <div className="relative z-10 mx-auto w-full max-w-5xl space-y-6 md:space-y-8">
        <h1 className="text-4xl font-black leading-tight drop-shadow-sm md:text-6xl">
          אוכל תאילנדי אותנטי עד הבית
        </h1>
        <p className="text-lg font-semibold opacity-90 md:text-xl">
          משלוח חינם בקנייה מעל 500 ש&quot;ח
        </p>

        <div className="relative mx-auto mt-3 w-full max-w-3xl md:mt-4">
          <input
            type="text"
            placeholder="איזה מוצרים תרצו לקנות?..."
            className="w-full rounded-full border border-white/40 bg-white px-8 py-5 pr-14 text-right text-lg text-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.25)] outline-none transition-all placeholder:text-slate-400 focus:border-white focus:ring-4 focus:ring-white/35"
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={24} />
          </div>
        </div>
      </div>
    </section>
  )
}