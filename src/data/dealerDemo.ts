/**
 * Bayi Rota "Canlı demo" verisi. Tohumlu rastgele sayıyla (seed 11) üretilir; her gün için en yakın komşu
 * sıralaması 2-opt ile iyileştirilir. Ana sayfadaki kart görseli de aynı veriye dayanır.
 */

export const DAY_NAMES = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'] as const;
export const DAY_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'] as const;
export const DAY_COLORS = ['#F0B54A', '#F2F0EA', '#5CC8FF', '#FF7AB6', '#7BE38A', '#B79CFF'] as const;

export interface DemoPoint {
  x: number;
  y: number;
  day: number;
  /** Günün içindeki ziyaret sırası (1'den başlar). */
  seq: number;
  /** Gösterilen bayi numarası. */
  id: number;
}

export interface Demo {
  pts: DemoPoint[];
  /** Gün başına, ziyaret sırasına göre `pts` indeksleri. */
  days: number[][];
  depot: readonly [number, number];
}

function generateDemo(): Demo {
  let seed = 11;
  function rnd() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }
  function gauss() {
    const u = 1 - rnd();
    const v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  const depot = [80, 52] as const;
  const centers = [
    [40, 28],
    [84, 22],
    [124, 34],
    [126, 72],
    [86, 80],
    [42, 74],
  ];
  const pts: DemoPoint[] = [];
  const days: number[][] = [];
  centers.forEach((c, d) => {
    const n = 9 + (d % 2);
    const list: number[] = [];
    for (let i = 0; i < n; i++) {
      const x = Math.min(152, Math.max(8, c[0] + gauss() * 9));
      const y = Math.min(94, Math.max(6, c[1] + gauss() * 6.5));
      list.push(pts.length);
      pts.push({ x, y, day: d, seq: 0, id: 0 });
    }
    // nearest neighbour from depot, then 2-opt
    const order: number[] = [];
    const left = list.slice();
    let cur: readonly [number, number] = depot;
    while (left.length) {
      let bi = 0;
      let bd = 1e9;
      left.forEach((k, j) => {
        const dx = pts[k].x - cur[0];
        const dy = pts[k].y - cur[1];
        const dd = dx * dx + dy * dy;
        if (dd < bd) {
          bd = dd;
          bi = j;
        }
      });
      const k = left.splice(bi, 1)[0];
      order.push(k);
      cur = [pts[k].x, pts[k].y];
    }
    const P = (i: number) => (i < 0 ? { x: depot[0], y: depot[1] } : pts[order[i]]);
    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y);
    let improved = true;
    let guard = 0;
    while (improved && guard++ < 50) {
      improved = false;
      for (let i2 = 0; i2 < order.length - 1; i2++)
        for (let j2 = i2 + 1; j2 < order.length; j2++) {
          const A = P(i2 - 1);
          const B = P(i2);
          const C = P(j2);
          const D = j2 + 1 < order.length ? P(j2 + 1) : null;
          const before = dist(A, B) + (D ? dist(C, D) : 0);
          const after = dist(A, C) + (D ? dist(B, D) : 0);
          if (after < before - 1e-6) {
            const seg = order.slice(i2, j2 + 1).reverse();
            order.splice(i2, seg.length, ...seg);
            improved = true;
          }
        }
    }
    order.forEach((k, idx) => {
      pts[k].seq = idx + 1;
    });
    days.push(order);
  });
  const ids = pts.map((_, i) => i);
  for (let z = ids.length - 1; z > 0; z--) {
    const r = Math.floor(rnd() * (z + 1));
    const tmpi = ids[z];
    ids[z] = ids[r];
    ids[r] = tmpi;
  }
  pts.forEach((p, i) => {
    p.id = 101 + ids[i];
  });
  return { pts, days, depot };
}

export const DEMO: Demo = generateDemo();

/** Gün başına rota çizgisi: depodan başlayıp sıradaki duraklardan geçer (SVG `points`). */
export const ROUTE_LINES = DEMO.days.map((order, d) => ({
  color: DAY_COLORS[d],
  points: [DEMO.depot.join(',')]
    .concat(order.map((k) => DEMO.pts[k].x.toFixed(2) + ',' + DEMO.pts[k].y.toFixed(2)))
    .join(' '),
}));

/** Videodaki bölümler: başlangıç saniyesi `s`. */
export const VIDEO_CHAPTERS = [
  { t: '0:00', s: 0, label: '1.474 bayi haritada' },
  { t: '0:04', s: 4, label: 'Bölgeyi çizerek seçme' },
  { t: '0:08', s: 8, label: 'Plasiyer ve gün planı' },
  { t: '0:12', s: 12, label: 'Plan hesaplanıyor' },
  { t: '0:28', s: 28, label: 'Bölgelere atanan bayiler' },
  { t: '0:43', s: 43, label: 'Gün gün rotalar' },
] as const;

export const ALGORITHM_STEPS = [
  {
    n: '01',
    title: 'Dengeli k-means',
    text: 'Kapasite kısıtı altında, bölgeler arası yükü dengeleyen kümeleme.',
  },
  {
    n: '02',
    title: 'Çoklu açısal seed',
    text: 'Farklı açılardan başlatılan tekrarlı denemelerle en iyi başlangıç seçilir.',
  },
  {
    n: '03',
    title: 'Voronoi / Lloyd',
    text: 'Sınırdaki bayiler komşu bölgeye kaydırılarak sınırlar yumuşatılır.',
  },
  { n: '04', title: 'İzole nokta temizliği', text: 'Kümeden kopuk kalan noktalar en uygun bölgeye taşınır.' },
  { n: '05', title: 'Isı transferi', text: 'Bölgeler arası durak sayısı iteratif olarak dengelenir.' },
  { n: '06', title: '2-opt', text: 'Her bölgenin rotası kesişmeler giderilerek kısaltılır.' },
] as const;
