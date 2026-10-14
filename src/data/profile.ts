export const EXPERIENCE = [
  {
    period: '2025 — bugün',
    title: 'Software Developer',
    org: 'ABH',
    text: 'Bayi rota optimizasyonu (VRP) ve perakende merchandising platformu. Backend, frontend, UI/UX ve DevOps uçtan uca.',
  },
  {
    period: '2024 — 2025',
    title: 'AI Engineer & Data Science',
    org: 'Twinup',
    text: 'RAG tabanlı sesli müşteri asistanı, VLM + LLM ile belge doldurma otomasyonu, multi-agent mimariler ve Go mikroservisleri.',
  },
  {
    period: '2021 — 2026',
    title: 'Bilgisayar Mühendisliği',
    org: 'Konya Gıda ve Tarım Üniversitesi',
    text: '%100 İngilizce, %100 burslu.',
  },
  {
    period: '2025 — 2026',
    title: 'Topluluk Başkanı',
    org: 'Yapay Zeka Araştırma ve Geliştirme Topluluğu',
    text: 'Okulda kodlama dersleri ve datathon gibi yarışmalar düzenledik.',
  },
] as const;

export interface CapabilityCard {
  title: string;
  desc?: string;
  tags: readonly string[];
}
export interface CapabilityGroup {
  label: string;
  count: string;
  /** Kart başlığı punto (px): 1. grup 22, 2. grup 20. */
  titleSize: number;
  cards: readonly CapabilityCard[];
}

export const CAPABILITY_GROUPS: readonly CapabilityGroup[] = [
  {
    label: '01 / YAPAY ZEKÂ & MAKİNE ÖĞRENMESİ',
    count: '7 alan',
    titleSize: 22,
    cards: [
      {
        title: 'AI agent’lar',
        desc: 'Sesli asistanlar, belge ve iş süreci otomasyonu.',
        tags: [
          'Multi-agent mimari',
          'MCP',
          'Tool calling',
          'RAG',
          'Agent belleği',
          'Web search agent’ları',
          'Embeddings',
          'Prompt Engineering',
          'LLM Evaluation',
        ],
      },
      {
        title: 'LLM & VLM',
        desc: 'Modelleri kendi verisiyle ince ayarlama ve üretime alma.',
        tags: [
          'LLM',
          'VLM',
          'LLM fine-tuning',
          'NLP',
          'Qwen',
          'Mistral',
          'Llama',
          'LangChain',
          'LangGraph',
          'LlamaIndex',
          'OpenAI API',
          'Hugging Face Transformers',
        ],
      },
      {
        title: 'Görüntü işleme',
        desc: 'Nesne tespiti, OCR ve görüntüden veri çıkarma.',
        tags: ['Computer Vision', 'YOLO', 'OpenCV', 'Tesseract OCR'],
      },
      {
        title: 'Makine & derin öğrenme',
        tags: ['Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Keras', 'Regresyon modelleri'],
      },
      {
        title: 'Ses teknolojileri',
        desc: 'Türkçe ses modeli eğitimi dahil.',
        tags: ['Speech-to-Text', 'Text-to-Speech', 'Coqui TTS', 'ElevenLabs'],
      },
      {
        title: 'Model eğitimi & MLOps',
        desc: '2 GPU üzerinde Türkçe ses modeli eğitildi.',
        tags: ['CUDA ile GPU eğitimi', 'Çoklu GPU', 'MLOps'],
      },
      {
        title: 'Veri bilimi & Big Data',
        tags: ['Web scraping', 'Keşifçi veri analizi (EDA)', 'Veri ön işleme', 'Big Data'],
      },
    ],
  },
  {
    label: '02 / YAZILIM GELİŞTİRME',
    count: '7 alan',
    titleSize: 20,
    cards: [
      {
        title: 'Backend',
        tags: [
          'Go mikroservisleri',
          'Python',
          'FastAPI',
          'Django',
          'SQLAlchemy',
          'REST API',
          'Clean Architecture',
          'RabbitMQ',
          'Kafka',
        ],
      },
      { title: 'Veri tabanları', tags: ['PostgreSQL', 'MSSQL', 'Qdrant (vektör)', 'Redis'] },
      {
        title: 'Altyapı & DevOps',
        tags: [
          'Docker',
          'Kubernetes',
          'Nginx',
          'CI/CD',
          'Prometheus',
          'Grafana',
          'Loki',
          'Linux',
          'Git',
          'GitHub Actions',
          'AWS',
          'GCP',
          'Azure',
          'Mikroservis mimarisi',
          'Design Patterns',
        ],
      },
      {
        title: 'Frontend & mobil',
        desc: 'Kullanıcının gördüğü taraf: web arayüzleri ve mobil uygulamalar.',
        tags: [
          'React',
          'TypeScript',
          'JavaScript',
          'Java (mobil + web)',
          'Mobil uygulama',
          'UI/UX',
          'Harita arayüzleri',
        ],
      },
      { title: 'Optimizasyon', tags: ['Araç rotalama (VRP)', 'Dengeli k-means', 'Voronoi / Lloyd', '2-opt'] },
      { title: 'Diller', tags: ['Go', 'Python', 'Java', 'JavaScript', 'TypeScript', 'SQL'] },
      { title: 'Test & süreç', tags: ['Unit Testing', 'Pytest', 'Agile / Scrum'] },
    ],
  },
];
