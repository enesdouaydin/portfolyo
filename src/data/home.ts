import { ROUTES } from '../routes';

/** Hero'da kılıç uçlarından geçen teknoloji çiftleri: [sol uç, sağ uç, grup sırası]. */
export const PAIRS: ReadonlyArray<readonly [string, string, number]> = [
  ['Go', 'Python', 0],
  ['TypeScript', 'Java', 0],
  ['FastAPI', 'Go mikroservis', 1],
  ['PostgreSQL', 'Redis', 1],
  ['RabbitMQ', 'Qdrant', 1],
  ['Multi-agent', 'RAG', 2],
  ['MCP', 'Tool calling', 2],
  ['LLM fine-tuning', 'VLM', 2],
  ['Computer Vision', 'YOLO', 2],
  ['Deep Learning', 'PyTorch', 2],
  ['STT', 'TTS', 2],
  ['CUDA', 'MLOps', 2],
  ['Docker', 'Kubernetes', 3],
  ['Nginx', 'CI/CD', 3],
  ['Prometheus', 'Grafana', 3],
  ['React', 'Mobil', 4],
  ['UI/UX', 'Harita arayüzü', 4],
  ['k-means', '2-opt', 4],
];

export const GROUPS = ['Diller', 'Backend', 'AI', 'Altyapı', 'Frontend'] as const;

export type CategoryId = 'all' | 'ai' | 'opt' | 'backend' | 'mobile' | 'ml';

export const CATEGORIES: ReadonlyArray<{ id: CategoryId; label: string }> = [
  { id: 'all', label: 'Hepsi' },
  { id: 'ai', label: 'AI & Agent' },
  { id: 'opt', label: 'Optimizasyon' },
  { id: 'backend', label: 'Backend' },
  { id: 'mobile', label: 'Mobil' },
  { id: 'ml', label: 'ML & Veri' },
];

/** Öne çıkan kart (01 — Bayi Rota) bu kategorilerde de görünür. */
export const FEATURED_CATS: readonly CategoryId[] = ['opt', 'backend'];

export interface ProjectRow {
  n: string;
  title: string;
  line: string;
  kind: string;
  cats: readonly CategoryId[];
  hasDemo?: boolean;
  hasVideo?: boolean;
  wip?: boolean;
  to: string;
}

/** Öne çıkan karttan sonraki liste (02–07). Kendi sayfası olmayanlar iletişim bölümüne gider. */
export const PROJECTS: readonly ProjectRow[] = [
  {
    n: '02',
    title: 'Sesli Müşteri Hizmetleri Asistanı',
    line: 'Gerçek çağrı kayıtlarından öğrenen ~10 ajanlı RAG sistemi; STT → agent → TTS hattı yaklaşık 2 saniyede yanıt veriyor.',
    kind: 'AI · Multi-agent · Ses',
    cats: ['ai'],
    hasDemo: true,
    hasVideo: true,
    to: ROUTES.sesliAsistan,
  },
  {
    n: '03',
    title: 'Belge Doldurma Otomasyonu',
    line: 'Kuruma sunulan ~150 sayfalık proje formlarını, daha önce doldurulmuş belgelerden (VLM + Qdrant) soru soru dolduran ve sayfa sayfa kontrol eden hat.',
    kind: 'AI · RAG · Go + React',
    cats: ['ai', 'backend'],
    hasDemo: true,
    hasVideo: false,
    to: ROUTES.belgeDoldurma,
  },
  {
    n: '04',
    title: 'KDV İade Otomasyonu',
    line: 'Fatura ve giderleri PDF ya da fotoğraftan OCR ile okuyup KDV iade sürecini hazırlayan mobil ve web uygulaması.',
    kind: 'AI · OCR · Mobil + Web',
    cats: ['ai', 'mobile'],
    hasDemo: true,
    hasVideo: true,
    to: ROUTES.kdvIade,
  },
  {
    n: '05',
    title: 'Merchandising Platformu',
    line: 'Büyük bir mağaza zincirinin verisiyle saha merch ekibi ve yöneticiler için satışları artırmayı hedefleyen platform.',
    kind: 'Perakende · Java · Auth',
    cats: ['mobile', 'backend'],
    wip: true,
    to: ROUTES.contact,
  },
  {
    n: '06',
    title: 'Ortak Gider Takip',
    line: 'Ev arkadaşları arasında gelir ve giderleri takip eden sistemin mobil uygulaması.',
    kind: 'Mobil',
    cats: ['mobile'],
    hasVideo: true,
    to: ROUTES.contact,
  },
  {
    n: '07',
    title: 'Ev Fiyat Tahmini',
    line: 'Emlak sitelerinden toplanan veride EDA, ön işleme ve regresyon modelleriyle fiyat tahmini.',
    kind: 'ML · Scraping · Regresyon',
    cats: ['ml'],
    hasDemo: true,
    to: ROUTES.evFiyat,
  },
];
