import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import SearchBar from '@/components/SearchBar';

export default function Hero() {
  const locale = useLocale();
  const t = useTranslations('Hero');

  return (
    <section className="relative isolate flex min-h-[360px] w-full items-center justify-center overflow-hidden px-4 py-16 text-center text-white md:min-h-[430px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/shop_banner.png')"
        }}
      />
      <div className="absolute inset-0 bg-[#2b57a7]/45" />

      <div className="relative z-10 mx-auto w-full max-w-5xl space-y-6 md:space-y-8">
        <h1 className="text-4xl font-black leading-tight drop-shadow-xl md:text-6xl">
        {t('title')}
        </h1>

        <div className="mx-auto mt-3 w-full max-w-3xl md:mt-4">
          <SearchBar
            key={`hero-search-${locale}`}
            placeholder={t('searchPlaceholder')}
            targetPath={`/${locale}/products`}
            initialQuery=""
          />
        </div>
      </div>
    </section>
  )
}