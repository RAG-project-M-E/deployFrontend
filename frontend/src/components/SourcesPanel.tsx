"use client";

const sources = [
  {
    title: "Türk Ceza Kanunu Madde 141",
    tag: "TCK",
    content:
      "Zilyetliğinde bulunan veya elinde bulundurduğu malvarlığı değerlerini, haksız olarak bir başkasının zilyetliğine geçiren kimseye bir yıldan üç yıla kadar hapis cezası verilir.",
  },
  {
    title: "Yargıtay Kararı - 2019/12345",
    tag: "Yargıtay",
    content:
      "Hırsızlık suçunun nitelikli halinin kabulü için, suçun işleniş şekli ve kullanılan yöntemlerin incelenmesi gerekir.",
  },
  {
    title: "İlgili Mevzuat",
    tag: "Mevzuat",
    content:
      "Hırsızlık suçunun işlenmesi halinde, mağdurun şikayet hakkı ve suçun zamanaşımı süresi hakkında bilgilendirme.",
  },
];

const SourcesPanel = () => {
  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-5 flex flex-col">
      <h2 className="text-[#0A1F44] font-playfair font-semibold text-lg mb-3">
        Kaynaklar
      </h2>
      <div className="space-y-4 overflow-y-auto">
        {sources.map((src, i) => (
          <div
            key={i}
            className="bg-[#F9F8F6] p-3 rounded-xl shadow-sm border-l-4 border-[#D4AF37]"
          >
            <h3 className="font-semibold text-[#0A1F44]">{src.title}</h3>
            <span className="inline-block mt-1 text-xs bg-[#D4AF37] text-white px-2 py-[2px] rounded-full">
              {src.tag}
            </span>
            <p className="text-sm mt-2 text-gray-700">{src.content}</p>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SourcesPanel;
