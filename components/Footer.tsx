import { Phone, MapPin, Navigation } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('Footer');

  // Replace with your actual data
  const phone = "050-232-2229";
  const address = "ישראל פולק 3";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;

  return (
    <footer id="contact-footer" className="bg-slate-50 border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column 1: Brand/About */}
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-4">{t('brandName')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Column 2: Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 mb-2">{t('contactUs')}</h3>
            
            <a href={`tel:${phone}`} className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition">
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <Phone size={18} />
              </div>
              <span dir="ltr">{phone}</span>
            </a>

            <div className="flex items-start gap-3 text-gray-600">
              <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                <MapPin size={18} />
              </div>
              <span>{address}</span>
            </div>
          </div>

          {/* Column 3: Map Widget / Navigation */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('findUs')}</h3>
            <div className="flex flex-col gap-3">
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition shadow-sm"
              >
                <Navigation size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Google Maps</span>
              </a>
              
              <a 
                href={wazeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#33f1ff] text-black py-2 px-4 rounded-lg hover:brightness-95 transition shadow-sm"
              >
                <div className="font-black italic text-xs">WAZE</div>
                <span className="text-sm font-medium">{t('openInWaze')}</span>
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} {t('brandName')}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}