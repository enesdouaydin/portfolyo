import type { FlowContent } from './projectPages';

/** Sesli Asistan sayfası: "Konuşma nasıl ilerliyor" bölümü (ajan zinciri + bilgi tabanı). */
export const SESLI_ASISAN_FLOW: FlowContent = {
  eyebrow: '04 / RAG ve ajan akışı',
  title: { lead: 'Konuşma nasıl', italic: 'ilerliyor' },
  lead: 'Her ajan tek bir işe bakıyor; müşterinin cevabı konuşmayı hangi ajanın devralacağını belirliyor. Yanıtlar RAG ile bilgi tabanından geliyor.',
  caption: 'örnek konuşma akışı',
  steps: [
    {
      n: '01',
      role: 'Karşılama ajanı',
      does: 'Müşterinin adını doğrular, kendini tanıtır ve modeller hakkında bilgi almak isteyip istemediğini sorar.',
      says: 'Merhaba, Merve Hanım’la mı görüşüyorum? Modellerimiz hakkında bilgi almak ister misiniz?',
      exits: [
        { when: 'Evet', to: 'Model ajanı' },
        { when: 'Hayır', to: 'Segment ajanı' },
      ],
    },
    {
      n: '02',
      role: 'Segment ajanı',
      does: 'Bilgi istemeyen müşteriye SUV mu, sedan mı düşündüğünü sorar.',
      says: 'SUV mu, sedan mı düşünüyorsunuz?',
      exits: [
        { when: 'SUV · sedan', to: 'Model ajanı' },
        { when: 'Hayır', to: 'Kapanış ajanı' },
      ],
    },
    {
      n: '03',
      role: 'Model ajanları',
      does: 'Müşterinin söylediği segmente ya da modele göre ilgili modelin ajanı devralır ve soruları bilgi tabanından (RAG) yanıtlar.',
      exits: [{ when: 'Görüşme sonu', to: 'Bilgi tabanı güncellenir' }],
    },
    {
      n: '04',
      role: 'Kapanış ajanı',
      does: 'İlgilenmeyen müşteriyle görüşmeyi nazikçe sonlandırır.',
      says: 'İyi günler Merve Hanım.',
      exits: [],
    },
  ],
  notes: [
    {
      label: 'Bilgi tabanı',
      text: 'Görüşme verileri bilgi tabanını besliyor: sistem konuştukça yanıtlarını güncelleyerek ilerliyor.',
    },
    {
      label: 'Birbirine bağlı ajanlar',
      text: 'Her ajanın çıkışı bir sonrakine bağlı. Müşterinin “evet”i ya da “hayır”ı hangi ajanın devralacağını seçiyor.',
    },
    {
      label: 'Dil modeli',
      text: 'Qwen ve Mistral’in Türkçe modeli denendi; sonrasında modele OpenRouter üzerinden API anahtarıyla erişildi.',
    },
  ],
};
