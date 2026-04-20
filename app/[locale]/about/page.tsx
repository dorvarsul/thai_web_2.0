export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-center">
      <h1 className="text-4xl font-black text-slate-900 mb-8 font-heebo">קצת עלינו</h1>
      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        ברוכים הבאים ל-Thai Market! אנחנו מביאים לכם את הטעמים האותנטיים של תאילנד ישירות למטבח הביתי. 
        מרוטבי דגים איכותיים ועד אטריות אורז מסורתיות, כל המוצרים שלנו נבחרו בקפידה.
      </p>
      <div className="h-[400px] bg-slate-200 rounded-3xl flex items-center justify-center text-slate-400">
        [תמונה של החנות או אוכל תאילנדי]
      </div>
    </div>
  );
}