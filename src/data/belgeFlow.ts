import type { FlowContent } from './projectPages';

/** Belge Doldurma sayfası: "Belge nasıl doluyor" bölümü (indeksleme → arama → doldurma → kontrol). */
export const BELGE_DOLDURMA_FLOW: FlowContent = {
  eyebrow: '04 / RAG hattı',
  title: { lead: 'Belge nasıl', italic: 'doluyor' },
  lead: 'Önce eski belgeler okunup Qdrant’a kaydediliyor; yeni form gelince her soru kendi konusuna uygun belgeden dolduruluyor.',
  caption: 'örnek belge hattı',
  steps: [
    {
      n: '01',
      role: 'VLM ile okuma',
      does: 'Daha önce doldurulmuş belgeler VLM ile okunur ve başlık başlık ayrıştırılır. Okuma işi Google Cloud’daki güçlü sanal makinelerde çalışır.',
      exits: [{ when: 'Başlıklar', to: 'Qdrant' }],
    },
    {
      n: '02',
      role: 'Qdrant’a kayıt',
      does: 'Başlıklar, bağlı oldukları başlığa göre vektör veritabanına kaydedilir; böylece her konu kendi belge parçalarıyla bulunabilir.',
      exits: [{ when: 'Yeni form', to: 'Kategori seçimi' }],
    },
    {
      n: '03',
      role: 'Kategori ve format',
      does: 'Yüklenen formda kategoriye göre ilgili belgeler seçilir, istenen format belirlenir ve proje bilgi kutusu doldurulur.',
      exits: [{ when: 'Sorular', to: 'Soru soru doldurma' }],
    },
    {
      n: '04',
      role: 'Soru soru doldurma',
      does: 'Her soru için konuyla ilgili, önceden doldurulmuş belge parçası getirilir ve yanıt o belgeye dayanarak yazılır.',
      exits: [{ when: 'Tüm sorular', to: 'Kontrol' }],
    },
    {
      n: '05',
      role: 'Kontrol ve düzeltme',
      does: 'Sayfalar tek tek geçilerek kontrol edilir. Sayfanın altındaki metin kutulu ajan, komutları soru bazında uygular.',
      says: 'Bu metnin şu kısmını düzelt, bunu ekle.',
      exits: [],
    },
  ],
  notes: [
    {
      label: 'Vektör veritabanı',
      text: 'Belgeler başlıklarına bağlı olarak Qdrant’ta saklanıyor; her soru kendi konusuna en yakın belge parçasını bulup oradan doluyor.',
    },
    {
      label: 'Altyapı',
      text: 'VLM ile okuma, yüzlerce sayfa için güçlü makine gerektirdiğinden Google Cloud sanal makinelerinde yürütüldü.',
    },
    {
      label: 'Soru bazlı ilerleme',
      text: 'Her şey soru başına ilerliyor: önce doldurma, sonra sayfa sayfa kontrol, sonra metin kutusundan düzeltme.',
    },
  ],
};
