import { Component, type ErrorInfo, type ReactNode } from 'react';
import { dbg } from '../debug';

interface Props {
  children: ReactNode;
  /** Hata olunca gösterilecek içerik. Verilmezse (undefined) "bir hata oluştu" paneli çıkar; `null` verilirse hiçbir şey çizilmez. */
  fallback?: ReactNode;
}

/**
 * React, bir bileşen çizilirken hata verirse tüm uygulamayı kaldırır ve ekran siyah kalır.
 * Bu sınır hatayı yakalar: süs bölümleri `fallback={null}` ile sessizce düşer, sayfanın geri kalanı açık kalır;
 * en dıştaki sınır ise siyah ekran yerine hatayı ve "Tekrar dene" düğmesini gösterir (stiller index.html'de).
 */
export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
    dbg(`React hatası: ${error.message}`);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div className="crash">
        <strong>Sayfa yüklenirken bir hata oluştu</strong>
        <div>Aşağıdaki bilgiyi gönderirseniz düzeltebilirim.</div>
        <pre>
          {error.message}
          {'\n\n'}
          {navigator.userAgent}
        </pre>
        <button type="button" onClick={() => window.location.reload()}>
          Tekrar dene
        </button>
      </div>
    );
  }
}
