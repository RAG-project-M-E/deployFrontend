"use client";
import {
  Search,
  Grid,
  List,
  Eye,
  Download,
  Wrench,
  FolderOpen,
  Menu,
} from "lucide-react";
import { useState } from "react";

interface SavedPageProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function SavedPage({ toggleSidebar, isSidebarOpen }: SavedPageProps) {
  // Boş durumda "Daha Fazla Kayıt Bulunuyor" kartı görünür.
  const [records] = useState([]); // şimdilik boş, istersen örnek veri eklenebilir

  return (
    <div className="flex flex-col h-screen bg-[#F9F8F6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-[#F9F8F6] rounded-lg transition-colors"
            aria-label="Menüyü aç"
          >
            <Menu className="text-[#0A1F44]" size={20} />
          </button>
        )}
        <h2 className="text-[#0A1F44] font-playfair font-semibold text-lg">
          Kaydedilen Cevaplar
        </h2>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10">
        {/* 🚧 Yapım Aşamasında Uyarısı */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-center bg-[#FFF7E0] border border-[#F2DC8B] text-[#7A6000] text-sm sm:text-base font-medium py-3 px-4 rounded-xl shadow-sm">
            <Wrench className="w-5 h-5 mr-2 text-[#D4AF37]" />
            Bu sayfa şu anda{" "}
            <span className="font-semibold ml-1">yapım aşamasındadır.</span>
          </div>
        </div>

        {/* Başlık */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-[#0A1F44]">
              Kaydedilen Cevaplar
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Hukuki sorularınıza verilen cevapları burada kaydedebilir ve daha
              sonra kolayca erişebilirsiniz.
            </p>
          </div>
        </div>

        {/* Arama ve Filtreler */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 w-full sm:w-1/2 shadow-sm">
            <Search className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Kaydedilen cevaplarda ara..."
              className="flex-1 text-sm focus:outline-none text-gray-700 bg-transparent"
            />
          </div>
          <select className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 bg-white shadow-sm w-full sm:w-auto">
            <option>Tüm Kategoriler</option>
            <option>Ceza Hukuku</option>
            <option>Borçlar Hukuku</option>
          </select>
          <select className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 bg-white shadow-sm w-full sm:w-auto">
            <option>Tüm Tarihler</option>
            <option>Kasım 2024</option>
            <option>Ekim 2024</option>
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2.5 bg-[#D4AF37] text-white rounded-full shadow-sm hover:opacity-90">
              <Grid size={18} />
            </button>
            <button className="p-2.5 border border-gray-300 text-gray-500 rounded-full hover:bg-gray-50">
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Kayıt Kartları */}
        <div className="space-y-5">
          {/* Kayıt yoksa: Bilgilendirme kartı */}
          {records.length === 0 && (
            <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10 sm:p-16 text-center max-w-2xl mx-auto mt-8">
              <FolderOpen className="text-[#D4AF37] w-16 h-16 mb-4" />
              <h2 className="text-2xl font-playfair font-bold text-[#0A1F44] mb-2">
                Daha Fazla Kayıt Bulunuyor
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mb-6 leading-relaxed">
                Kaydedilen cevaplarınız burada görünecek. Şu anda yapım aşamasında
                olan özelliklerimizle birlikte daha fazla fonksiyon eklenecektir.
              </p>
              <button className="inline-flex items-center gap-2 border border-gray-300 text-[#0A1F44] px-5 py-2 rounded-md font-medium hover:bg-[#F9F8F6] transition-all">
                Yeni Cevap Kaydet
              </button>
            </div>
          )}

          {/* Örnek kart (ileride dinamik hale gelecek) */}
          <div className="bg-white border-t-4 border-[#D4AF37] rounded-2xl shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold text-[#0A1F44]">
                Hırsızlık Suçu ve Cezası
              </h2>
              <span className="text-xs text-gray-500">15.11.2024</span>
            </div>
            <span className="bg-[#FDF6E5] text-[#B5972D] text-xs font-medium px-3 py-1 rounded-full">
              Ceza Hukuku
            </span>
            <p className="text-sm text-gray-700 mt-3">
              Türk Ceza Kanunu Madde 141&apos;e göre hırsızlık suçu, zilyetinde bulunan
              malvarlığı değerlerini haksız olarak bir başkasının zilyetliğine
              geçirme eylemidir...
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                TCK 141
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                Malvarlığı
              </span>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button className="text-gray-500 hover:text-[#0A1F44] transition">
                <Eye size={18} />
              </button>
              <button className="text-gray-500 hover:text-[#0A1F44] transition">
                <Download size={18} />
              </button>
            </div>
          </div>

          {/* 2. Örnek kart */}
          <div className="bg-white border-t-4 border-[#D4AF37] rounded-2xl shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold text-[#0A1F44]">
                Kira Sözleşmesi ve Fesih Süreleri
              </h2>
              <span className="text-xs text-gray-500">14.11.2024</span>
            </div>
            <span className="bg-[#FDF6E5] text-[#B5972D] text-xs font-medium px-3 py-1 rounded-full">
              Borçlar Hukuku
            </span>
            <p className="text-sm text-gray-700 mt-3">
              Türk Borçlar Kanunu&apos;na göre kira sözleşmelerinin fesih süreleri,
              belirli süreli ve belirsiz süreli sözleşmeler için farklı
              düzenlemeler içerir...
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                TBK 347
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                Kira
              </span>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button className="text-gray-500 hover:text-[#0A1F44] transition">
                <Eye size={18} />
              </button>
              <button className="text-gray-500 hover:text-[#0A1F44] transition">
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
