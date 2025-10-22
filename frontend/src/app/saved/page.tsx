export default function SavedRoute() {
  return (
    <div className="flex-1 bg-[#F9F8F6] p-6 sm:p-10">
      <div className="w-full mb-6">
        <div className="flex items-center justify-center bg-[#FFF7E0] border border-[#F2DC8B] text-[#7A6000] text-sm sm:text-base font-medium py-3 px-4 rounded-xl shadow-sm">
          Bu sayfa şu anda yapım aşamasındadır.
        </div>
      </div>

      <h1 className="text-3xl font-playfair font-bold text-[#0A1F44] mb-4">
        Kaydedilen Cevaplar
      </h1>
      <p className="text-gray-600">
        Hukuki sorularınıza verilen cevapları burada kaydedebilir ve daha sonra kolayca erişebilirsiniz.
      </p>
    </div>
  );
}
