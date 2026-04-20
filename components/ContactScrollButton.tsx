'use client';

export default function ContactScrollButton({ label }: { label: string }) {
  const scrollToFooter = () => {
    const footer = document.getElementById('contact-footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToFooter}
      className="items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
    >
      <span>{label}</span>
    </button>
  );
}