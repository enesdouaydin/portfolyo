import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ScrollManager } from './components/ScrollManager';
import { ROUTES } from './routes';

const Home = lazy(() => import('./pages/home/Home'));
const BayiRota = lazy(() => import('./pages/bayi-rota/BayiRota'));
const SesliAsistan = lazy(() => import('./pages/sesli-asistan/SesliAsistan'));
const KdvIade = lazy(() => import('./pages/kdv-iade/KdvIade'));
const EvFiyat = lazy(() => import('./pages/ev-fiyat/EvFiyat'));
const BelgeDoldurma = lazy(() => import('./pages/belge-doldurma/BelgeDoldurma'));

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={null}>
        <Routes>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.bayiRota} element={<BayiRota />} />
          <Route path={ROUTES.sesliAsistan} element={<SesliAsistan />} />
          <Route path={ROUTES.belgeDoldurma} element={<BelgeDoldurma />} />
          <Route path={ROUTES.kdvIade} element={<KdvIade />} />
          <Route path={ROUTES.evFiyat} element={<EvFiyat />} />
        </Routes>
      </Suspense>
    </>
  );
}
