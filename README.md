# ⚖️ LexAIConsillium — Türk Hukuk Danışmanı

**LexAIConsillium**, Türk hukuk sistemine yönelik hazırlanmış **RAG (Retrieval-Augmented Generation)** tabanlı yapay zekâ destekli hukuk danışmanlık sistemidir.

Bu proje, kullanıcıların Türk yasaları hakkında doğal dilde sordukları sorulara, ilgili yasa metinlerinden ve hukuk kaynaklarından alınan bilgilerle yanıt verir.

---

## 📋 Genel Bakış

LexAIConsillium, modern web teknolojileri ve yapay zeka modellerini birleştirerek kullanıcılara interaktif bir hukuk danışmanlığı deneyimi sunar:

- **Backend**: FastAPI tabanlı WebSocket sunucusu ile gerçek zamanlı iletişim
- **Frontend**: Next.js 15.5 ve React 19 ile modern, erişilebilir kullanıcı arayüzü
- **RAG Pipeline**: LangChain + Chroma vektör veritabanı ile akıllı bilgi çekimi
- **AI Modelleri**: Google Gemini (ana) + OpenAI GPT (fallback) ile güvenilir yanıt üretimi
- **Türkçe Desteği**: Yerli Türkçe embedding modeli ile optimize edilmiş arama

---

## 🛠️ Teknoloji Stack'i

### Backend Teknolojileri

| Bileşen | Görev |
|---------|-------|
| **FastAPI** | WebSocket tabanlı backend API servisi |
| **LangChain-Chroma** | Kalıcı vektör veritabanı (RAG Storage) |
| **LangChain-HuggingFace** | Embedding işlemleri için Türkçe model entegrasyonu |
| **Sentence Transformers** | `trmteb/turkish-embedding-model` ile vektör oluşturma |
| **Google Gemini API** | Ana yanıt üretim modeli (gemini-2.5-pro) |
| **OpenAI GPT** | Gemini başarısız olduğunda devreye giren yedek model (gpt-4o-mini) |
| **Python dotenv** | Ortam değişkenleri (.env) yönetimi |
| **Hugging Face Datasets** | `AIStudioGPT/hukuk_qa` veri seti entegrasyonu |

### Frontend Teknolojileri

| Bileşen | Görev |
|---------|-------|
| **Next.js 15.5.6** | Modern React framework ve app router |
| **React 19.1.0** | UI kütüphanesi |
| **TypeScript 5** | Type-safe geliştirme |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Lucide React** | Modern icon seti |
| **Turbopack** | Hızlı build ve development |
| **WebSocket API** | Backend ile gerçek zamanlı iletişim |

---

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler

- **Python 3.8+** (Backend için)
- **Node.js 18+** (Frontend için)
- **Google API Key** ([Google AI Studio](https://aistudio.google.com/))
- **OpenAI API Key** (opsiyonel, fallback için)
- **Hugging Face Token** ([Hugging Face Settings](https://huggingface.co/settings/tokens))

### 1️⃣ Projeyi İndirin

```bash
git clone <repository-url>
cd LawChatbot/frontend/frontend
```

### 2️⃣ Ortam Değişkenlerini Ayarlayın

Proje kök dizininde `api/.env` dosyası oluşturun:

```ini
# API Keys
GOOGLE_API_KEY=your_google_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
HF_TOKEN=your_huggingface_token_here

# Model Configuration
GEMINI_MODEL=gemini-2.5-pro
GPT_MODEL=gpt-4o-mini
MAX_OUTPUT_TOKENS=1000
CONTEXT_LIMIT=1200

# System Configuration
LOG_LEVEL=INFO
IDLE_TIMEOUT=90
MAX_RETRIES=3
```
### 🔧 Hızlı başlangıç
```bash
# Virtual environment oluşturun
python -m venv lawrag-env

# Virtual environment'ı aktifleştirin
source lawrag-env/bin/activate  # macOS/Linux
# lawrag-env\Scripts\activate   # Windows

# main.py dosyasını çalıştırın.
python main.py
# Bu dosya sizin için bağımlılıkları yükleyecek ve projeyi ayağa kaldıracaktır.
```
### 3️⃣ Backend Kurulumu

```bash
# Virtual environment oluşturun
python -m venv lawrag-env

# Virtual environment'ı aktifleştirin
source lawrag-env/bin/activate  # macOS/Linux
# lawrag-env\Scripts\activate   # Windows

# Backend bağımlılıklarını yükleyin
cd api
pip install -r requirements.txt
```

### 4️⃣ Vektör Veritabanını Oluşturun

```bash
# api/ dizininde çalıştırın
python build_vector_db.py
```

> **Not**: İlk çalıştırmada Hugging Face'ten `AIStudioGPT/hukuk_qa` veri seti indirilir ve Chroma vektör veritabanı oluşturulur. Bu işlem 10-30 dakika sürebilir.

### 5️⃣ Frontend Kurulumu

```bash
# Proje kök dizinine dönün
cd ..

# Frontend dizinine geçin
cd frontend

# Bağımlılıkları yükleyin
npm install
```

### 6️⃣ Uygulamayı Başlatın

#### Seçenek A: Tek Komutla Başlatma (Önerilen)

Proje kök dizininden:

```bash
python main.py
```

Bu komut hem backend'i (port 8080) hem de frontend'i (port 3000) aynı anda başlatır.

#### Seçenek B: Manuel Başlatma

**Terminal 1 - Backend:**
```bash
cd api
uvicorn api_ws:app --host 0.0.0.0 --port 8080 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7️⃣ Uygulamaya Erişim

Tarayıcınızda şu adresi açın:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)

---

## 🏗️ Proje Yapısı

```
LawChatbot/frontend/frontend/
│
├── main.py                          # Ana başlatıcı (API + Frontend)
│
├── api/                             # Backend (FastAPI)
│   ├── api_ws.py                    # WebSocket API servisi
│   ├── build_vector_db.py           # Vektör veritabanı oluşturucu
│   ├── requirements.txt             # Python bağımlılıkları
│   ├── .env                         # Ortam değişkenleri (oluşturulacak)
│   └── rag_data/                    # Chroma vektör veritabanı
│       └── e4331fd3-...             # Vektör indeksleri
│
├── frontend/                        # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                     # Next.js app router
│   │   │   ├── page.tsx            # Ana sayfa
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── globals.css         # Global stiller
│   │   │   └── saved/              # Kaydedilen yanıtlar sayfası
│   │   │       ├── page.tsx
│   │   │       └── layout.tsx
│   │   ├── components/              # React bileşenleri
│   │   │   ├── ChatWindow.tsx      # Ana sohbet arayüzü
│   │   │   ├── Sidebar.tsx         # Navigasyon sidebar
│   │   │   ├── SourcesPanel.tsx    # Hukuk kaynakları paneli
│   │   │   ├── SavedPage.tsx       # Kaydedilen yanıtlar sayfası
│   │   │   ├── NewChatPage.tsx     # Yeni sohbet sayfası
│   │   │   └── ErrorBoundary.tsx   # Hata yakalama bileşeni
│   │   ├── lib/                     # Utility fonksiyonları
│   │   │   ├── api.ts              # API client
│   │   │   ├── config.ts           # Konfigürasyon
│   │   │   └── monitoring.ts       # İzleme ve loglama
│   │   ├── api/                     # API utilities
│   │   │   ├── socket.ts           # WebSocket manager
│   │   │   └── README.md           # API dökümanı
│   │   └── hooks/                   # Custom React hooks
│   │       └── useWebSocket.ts     # WebSocket hook
│   ├── public/                      # Statik dosyalar
│   ├── package.json                 # NPM bağımlılıkları
│   ├── tsconfig.json                # TypeScript konfigürasyonu
│   ├── tailwind.config.ts           # Tailwind CSS konfigürasyonu
│   ├── next.config.ts               # Next.js konfigürasyonu
│   └── .env.local                   # Frontend ortam değişkenleri (opsiyonel)
│
└── README.md                        # Bu dosya
```

---

## ⚙️ Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                    Kullanıcı (Browser)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ WebSocket Connection
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Frontend (Next.js + React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ ChatWindow   │  │  Sidebar     │  │  SourcesPanel   │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│         │                                      ↑             │
│         │          WebSocket API               │             │
│         ↓                                      │             │
└────────────────────────┬──────────────────────┼─────────────┘
                         │                      │
                         ↓                      │
┌─────────────────────────────────────────────────────────────┐
│           Backend (FastAPI WebSocket - api_ws.py)           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              RAG Pipeline (LangChain)                 │  │
│  │                                                        │  │
│  │  1. Kullanıcı sorusu → Embedding                     │  │
│  │                ↓                                      │  │
│  │  2. Chroma Vector Store → Similarity Search          │  │
│  │                ↓                                      │  │
│  │  3. İlgili belgeler retrieve edilir                  │  │
│  │                ↓                                      │  │
│  │  4. Context + Soru → LLM'e gönderilir                │  │
│  │                ↓                                      │  │
│  │  5. Google Gemini (primary) / OpenAI GPT (fallback)  │  │
│  │                ↓                                      │  │
│  │  6. Yanıt + Kaynaklar → Kullanıcıya                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Chroma Vector Database (rag_data/)               │  │
│  │                                                        │  │
│  │  - Türkçe hukuk Q&A vektörleri                        │  │
│  │  - turkish-embedding-model ile indekslenmiş           │  │
│  │  - Hugging Face: AIStudioGPT/hukuk_qa                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 💬 Örnek Kullanım Senaryoları

### Hukuki Sorular

```
👤 Kullanıcı: "Tazminat miktarı neye göre belirlenir?"
🤖 LexAI: [Türk Borçlar Kanunu'ndan ilgili maddeleri getirerek detaylı açıklama]

👤 Kullanıcı: "İş kazası durumunda işverenin sorumluluğu nedir?"
🤖 LexAI: [İş Kanunu ve Sosyal Sigortalar Kanunu'ndan ilgili bilgiler]

👤 Kullanıcı: "TCK'ya göre bilişim sistemine izinsiz girmek hangi suça girer?"
🤖 LexAI: [Türk Ceza Kanunu ilgili maddelerini referans göstererek açıklama]

👤 Kullanıcı: "Kıdem tazminatı hangi şartlarda alınır?"
🤖 LexAI: [İş Kanunu'ndan kıdem tazminatı şartlarını detaylı açıklama]
```

---

## 🎨 Frontend Özellikleri

### Modern Kullanıcı Arayüzü

- **Clean Design**: Profesyonel ve modern Tailwind CSS tasarımı
- **Responsive**: Mobil, tablet ve masaüstü uyumlu
- **Dark Theme Ready**: Koyu tema desteği hazır
- **Custom Color Palette**:
  - Primary Navy: `#0A1F44`
  - Accent Gold: `#D4AF37`
  - Background Beige: `#F9F8F6`

### Erişilebilirlik (Accessibility)

- WCAG uyumlu ARIA etiketleri
- Klavye navigasyon desteği
- Ekran okuyucu uyumlu
- Semantik HTML yapısı
- Focus yönetimi

### Teknik Özellikler

- **Type Safety**: Full TypeScript desteği
- **Error Handling**: Global error boundary
- **Monitoring**: Built-in logging ve performance tracking
- **Loading States**: Kullanıcı dostu yükleme göstergeleri
- **WebSocket Management**: Otomatik yeniden bağlanma

### Bileşen Yapısı

```typescript
// Ana bileşenler
ChatWindow.tsx      // WebSocket üzerinden mesajlaşma arayüzü
Sidebar.tsx         // Sohbet geçmişi ve navigasyon
SourcesPanel.tsx    // Hukuk kaynaklarını görüntüleme
SavedPage.tsx       // Kaydedilen yanıtları yönetme
ErrorBoundary.tsx   // Hata yakalama ve kullanıcı bildirimleri

// Utility modülleri
lib/api.ts          // REST API client (opsiyonel)
lib/config.ts       // Uygulama konfigürasyonu
lib/monitoring.ts   // Performance ve error monitoring
hooks/useWebSocket.ts // WebSocket bağlantı yönetimi
```

### Monitoring ve Debugging

Development modunda tarayıcı konsolunda:

```javascript
// Log'ları görüntüle
window.lexaiMonitor.getLogs()

// Performans metriklerini görüntüle
window.lexaiMonitor.getMetrics()
```

---

## ⚠️ Önemli Notlar

### Backend

- İlk embedding işlemi **10-30 dakika** sürebilir
- `rag_data/` dizinini silerseniz embedding'ler yeniden oluşturulur
- Gemini bazen boş yanıt döndürebilir → sistem otomatik olarak GPT'ye geçer
- `.env` içindeki `CONTEXT_LIMIT` değeri, yanıtların bağlam uzunluğunu belirler
- GPU kullanımı embedding işlemini hızlandırır (opsiyonel)

### Frontend

- WebSocket bağlantısı için backend'in çalışıyor olması gerekir
- Development modda hot-reload aktiftir (Turbopack)
- Production build için `npm run build && npm start` kullanın
- Type checking: `npx tsc --noEmit`

### Veri Seti Erişimi

- `AIStudioGPT/hukuk_qa` veri setine erişim için [Hugging Face sayfasından](https://huggingface.co/datasets/AIStudioGPT/hukuk_qa) izin almanız gerekebilir
- HF_TOKEN'ın `.env` dosyasında doğru tanımlanmış olması gerekir

---

## 🔧 Geliştirici Araçları

### Backend Development

```bash
# Development mode (auto-reload)
cd api
uvicorn api_ws:app --host 0.0.0.0 --port 8080 --reload

# Production mode
uvicorn api_ws:app --host 0.0.0.0 --port 8080

# Vektör veritabanını yeniden oluştur
python build_vector_db.py
```

### Frontend Development

```bash
cd frontend

# Development server (Turbopack ile hızlı)
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 🚢 Production Deployment

### Backend Deployment

```bash
# Docker ile deployment (örnek)
cd api
docker build -t lexai-backend .
docker run -p 8080:8080 --env-file .env lexai-backend
```

### Frontend Deployment

Frontend şu platformlarda deploy edilebilir:

- **Vercel** (önerilen - Next.js için optimize)
- **Netlify**
- **AWS Amplify**
- **Docker** (containerized deployment)

```bash
# Vercel deployment
cd frontend
vercel deploy

# Manuel production build
npm run build
npm start
```

---

## 🐛 Sorun Giderme

### Backend Sorunları

#### `ModuleNotFoundError` hatası

```bash
cd api
pip install -r requirements.txt
```

#### Veri seti yüklenmiyor (gated dataset hatası)

1. [Hugging Face](https://huggingface.co) hesabınızla giriş yapın
2. [AIStudioGPT/hukuk_qa](https://huggingface.co/datasets/AIStudioGPT/hukuk_qa) veri setine erişim izni isteyin
3. `.env` dosyasına `HF_TOKEN` ekleyin ve doğru olduğundan emin olun

#### Embedding işlemi çok yavaş

1. **Veri setini sınırlayın**: `build_vector_db.py` içinde test için ilk 100-500 kaydı kullanın
2. **GPU kullanın**: Colab, Kaggle veya AWS GPU instance kullanın
3. **Model boyutunu küçültün**: Daha küçük bir embedding modeli deneyin

#### Gemini/GPT API hataları

- API key'lerinizi kontrol edin
- API quota limitlerini kontrol edin
- `.env` dosyasındaki model isimlerinin doğru olduğundan emin olun

### Frontend Sorunları

#### WebSocket bağlantı hatası

```bash
# Backend'in çalıştığından emin olun
cd api
uvicorn api_ws:app --host 0.0.0.0 --port 8080
```

#### Build hataları

```bash
# Node_modules'u temizle ve yeniden yükle
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Type errors

```bash
# TypeScript type checking
npx tsc --noEmit

# ESLint kontrolü
npm run lint
```

---

## 📚 İleri Düzey Özellikler

### Gelecek Geliştirmeler

- [ ] **Kullanıcı Kimlik Doğrulama**: JWT tabanlı authentication
- [ ] **Sohbet Geçmişi**: Database ile kalıcı sohbet kayıtları
- [ ] **PDF Export**: Yanıtları PDF olarak indirme
- [ ] **Çoklu Dil Desteği**: İngilizce arayüz ekleme
- [ ] **Voice Input**: Sesli soru sorma özelliği
- [ ] **Advanced Search**: Gelişmiş hukuk metni arama
- [ ] **Citation Management**: Kaynak yönetimi sistemi
- [ ] **Admin Panel**: Sistem yönetimi ve kullanıcı analitiği

### Özelleştirme

#### Farklı Embedding Modeli Kullanma

`api/build_vector_db.py` dosyasında:

```python
embeddings = HuggingFaceEmbeddings(
    model_name="your-model-name",  # Farklı bir model
    model_kwargs={"device": "cuda"},  # GPU için
    encode_kwargs={"normalize_embeddings": True},
)
```

#### LLM Modelini Değiştirme

`.env` dosyasında:

```ini
GEMINI_MODEL=gemini-1.5-flash  # Daha hızlı, daha ekonomik
# veya
GEMINI_MODEL=gemini-2.0-ultra  # Daha güçlü (eğer erişiminiz varsa)
```

---

## 📝 Lisans

Bu proje yalnızca **araştırma ve eğitim amaçlıdır**.

**⚠️ YASAL UYARI**: LexAIConsillium hiçbir şekilde resmi hukuki tavsiye veya profesyonel danışmanlık amacı taşımaz. Hukuki konularda mutlaka lisanslı bir avukata danışmalısınız.

---

## 👨‍💻 Geliştirici

**Ertan M.**
Türk Hukuku için AI Chatbot Geliştiricisi

---

## 🤝 Katkıda Bulunma

Sorularınız, önerileriniz veya hata raporlarınız için:

1. Issue açın
2. Pull request gönderin
3. Geliştirici ile iletişime geçin

---

## 🙏 Teşekkürler

- **Hugging Face**: Veri seti ve embedding model hosting
- **Google**: Gemini API
- **OpenAI**: GPT API
- **LangChain**: RAG framework
- **Chroma**: Vector database
- **Vercel**: Next.js framework

---

**⚖️ LexAIConsillium** - Türk hukuk sistemi için modern yapay zeka asistanı
