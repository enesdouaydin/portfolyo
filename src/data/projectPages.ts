import { ROUTES } from '../routes';

export interface ProjectContent {
  /** "Vaka NN / 07" sayacındaki NN. */
  caseNo: string;
  /** Tuval için ekran okuyucu açıklaması. */
  canvasLabel: string;
  eyebrow: string;
  title: { lead: string; italic: string };
  lead: string;
  meta: ReadonlyArray<{ label: string; value: string }>;
  story: ReadonlyArray<{ label: string; text: string }>;
  next: { to: string; eyebrow: string; title: { lead: string; italic: string } };
}

/** Proje sayfasındaki "nasıl çalışıyor" bölümü: numaralı adım kartları + alttaki üç not. */
export interface FlowContent {
  eyebrow: string;
  title: { lead: string; italic: string };
  lead: string;
  /** Kartların üstündeki küçük mono yazı. */
  caption: string;
  steps: ReadonlyArray<{
    n: string;
    role: string;
    does: string;
    /** Örnek konuşma ya da komut; italik serif ile gösterilir. */
    says?: string;
    /** Kartın altındaki "koşul → hedef" hapları. */
    exits: ReadonlyArray<{ when: string; to: string }>;
  }>;
  notes: ReadonlyArray<{ label: string; text: string }>;
}

export const SESLI_ASISTAN: ProjectContent = {
  caseNo: '02',
  canvasLabel:
    '3D bir figür telefonla konuşuyor; karşısında on küçük ajanın etrafında döndüğü bir yapay zekâ çekirdeği sesli yanıt veriyor',
  eyebrow: 'Vaka çalışması 02 · AI · Multi-agent · Ses',
  title: { lead: 'Sesli Müşteri', italic: 'Asistanı' },
  lead: 'Gerçek çağrı merkezi kayıtlarından öğrenen, yaklaşık 10 ajanlı RAG tabanlı sistem. STT → agent → TTS hattı yaklaşık 2 saniyede yanıt veriyor.',
  meta: [
    { label: 'DÖNEM', value: '2024 — 2025' },
    { label: 'MİMARİ', value: '~10 ajanlı multi-agent · RAG' },
    { label: 'SES', value: 'STT · TTS · Coqui TTS · ElevenLabs' },
    { label: 'EĞİTİM', value: 'Türkçe ses modeli · 2 GPU (CUDA)' },
  ],
  story: [
    {
      label: '01 / Problem',
      text: 'Çağrı merkezine gelen soruları, belirlenmiş kalıplara uygun ve insan gibi hızlı yanıtlamak.',
    },
    {
      label: '02 / Yaklaşım',
      text: 'Gerçek kayıtlar analiz edilerek ~10 ajanlı bir sistem kuruldu. Bilgi tabanı, gelen yanıtlarla kendini genişleten bir RAG yapısına dayanıyor. ElevenLabs ile Türkçe sentetik ses verisi üretilip 2 GPU üzerinde Türkçe ses modeli eğitildi.',
    },
    {
      label: '03 / Sonuç',
      text: 'STT → agent → TTS hattı yaklaşık 2 saniye gecikmeyle yanıt veriyor. Üretimde lisanslı ses paketine geçilip yarım kalmış Coqui TTS kod tabanı projeye uyarlandı.',
    },
  ],
  next: {
    to: ROUTES.belgeDoldurma,
    eyebrow: 'Sıradaki',
    title: { lead: 'Belge Doldurma', italic: 'Otomasyonu' },
  },
};

export const BELGE_DOLDURMA: ProjectContent = {
  caseNo: '03',
  canvasLabel:
    '3D sahnede doldurulmuş bir belge VLM halkasından geçip başlıklarına ayrılıyor, başlıklar Qdrant vektör veritabanında noktalara dönüşüyor; yeni bir form soru soru doluyor, sayfalar taranıyor ve metin kutulu bir ajan düzeltme yapıyor',
  eyebrow: 'Vaka çalışması 03 · AI · RAG · VLM',
  title: { lead: 'Belge Doldurma', italic: 'Otomasyonu' },
  lead: 'Yaklaşık 150 sayfalık proje formlarını daha önce doldurulmuş belgelerden öğrenerek soru soru dolduran, sayfa sayfa kontrol eden AI hattı.',
  meta: [
    { label: 'DÖNEM', value: '2024 — 2025' },
    { label: 'MİMARİ', value: 'VLM okuma · Qdrant · RAG · ajanlar' },
    { label: 'ALTYAPI', value: 'Google Cloud sanal makineleri' },
    { label: 'BELGE', value: '~150 sayfa · soru tabanlı form' },
  ],
  story: [
    {
      label: '01 / Problem',
      text: 'Kuruma sunulan proje formları yaklaşık 150 sayfa ve sayfalarca sorudan oluşuyor. Bir kişi için doldurması 3–4 aydan önce bitmiyordu.',
    },
    {
      label: '02 / Yaklaşım',
      text: 'Daha önce doldurulmuş belgeler VLM ile okunup başlık başlık kaydedildi ve başlıklarına bağlı olarak Qdrant vektör veritabanına yazıldı. Yeni form yüklenince sistem kategoriye göre ilgili belgeleri seçip istenen formatı belirliyor; sorular tek tek ilerleyerek konuyla ilgili önceki belgelerden dolduruluyor.',
    },
    {
      label: '03 / Kontrol ve düzeltme',
      text: 'Tüm sorular dolduktan sonra sayfalar tek tek geçilerek kontrol ediliyor. Sayfanın altındaki metin kutulu ajan, “şurayı düzelt, bunu ekle” gibi komutları soru bazında uygulayıp metni düzeltiyor.',
    },
  ],
  next: { to: ROUTES.kdvIade, eyebrow: 'Sıradaki', title: { lead: 'KDV İade', italic: 'Otomasyonu' } },
};

export const KDV_IADE: ProjectContent = {
  caseNo: '04',
  canvasLabel:
    '3D bir figür elindeki telefonla bir faturayı okutuyor; fatura gelen faturalar tepsisine gidiyor, telefon ekranında KDV iade hesabı ve hazır iade dosyası görünüyor',
  eyebrow: 'Vaka çalışması 04 · AI · OCR · Mobil + Web',
  title: { lead: 'KDV İade', italic: 'Otomasyonu' },
  lead: 'Gelen ve giden faturaları PDF ya da fotoğraftan OCR ile okuyup, kesilen/kestirilen ayrımına göre KDV iade sürecini hazırlayan mobil ve web uygulaması.',
  meta: [
    { label: 'TÜR', value: 'Kişisel proje · mobil + web' },
    { label: 'GİRDİ', value: 'PDF ya da fotoğraf fatura' },
    { label: 'YÖNTEM', value: 'OCR · gelen / giden sınıflandırma' },
    { label: 'ÇIKTI', value: 'KDV iade süreci dosyası' },
  ],
  story: [
    {
      label: '01 / Problem',
      text: 'Faturaları tek tek okuyup gelen ve giden diye ayırmak, sonra KDV iade sürecini hazırlamak elle yapıldığında zaman alıyor.',
    },
    {
      label: '02 / Yaklaşım',
      text: 'Fatura PDF ya da fotoğraf olarak alınıyor ve OCR ile okunuyor. Faturanın kesilen ya da kestirilen olmasına göre KDV’si doğru tarafa yazılıyor ve iade süreci hazırlanıyor.',
    },
    {
      label: '03 / Sonuç',
      text: 'Uygulama hem mobilde hem web arayüzünde kullanılabiliyor. [Kullanım ya da zaman kazancı metriği]',
    },
  ],
  next: { to: ROUTES.evFiyat, eyebrow: 'Sıradaki', title: { lead: 'Ev Fiyat', italic: 'Tahmini' } },
};

export const EV_FIYAT: ProjectContent = {
  caseNo: '07',
  canvasLabel:
    '3D bir sokakta kamera üç evi sırayla ziyaret ediyor; her evin üzerinde ilan fiyatı ve model tahmini beliriyor, uygun fiyatlı ev bulununca kapısı açılıyor',
  eyebrow: 'Vaka çalışması 07 · ML · Veri',
  title: { lead: 'Ev Fiyat', italic: 'Tahmini' },
  lead: 'Güncel emlak ilanlarından toplanan veriyle eğitilmiş regresyon modeli; her ilan için bir tahmin üretip uygun fiyatlı evleri öne çıkarıyor.',
  meta: [
    { label: 'DÖNEM', value: '2024 — 2025' },
    { label: 'VERİ', value: 'Emlak siteleri · web scraping' },
    { label: 'YÖNTEM', value: 'EDA · ön işleme · regresyon' },
    { label: 'ÇIKTI', value: 'İlan başına fiyat tahmini' },
  ],
  story: [
    { label: '01 / Soru', text: 'Bir ilanın fiyatı, benzer evlerin piyasa değerine göre nerede duruyor?' },
    {
      label: '02 / Yaklaşım',
      text: 'Güncel emlak sitelerinden web scraping ile veri toplandı; keşifçi veri analizi ve ön işlemenin ardından regresyon modelleri eğitildi.',
    },
    {
      label: '03 / Sonuç',
      text: 'Model her ilan için bir tahmin üretiyor; fiyatı tahminin altında kalan evler uygun olarak işaretleniyor. [Model metriği — ör. R², MAE]',
    },
  ],
  next: {
    to: ROUTES.sesliAsistan,
    eyebrow: 'Sıradaki',
    title: { lead: 'Sesli Müşteri', italic: 'Asistanı' },
  },
};
