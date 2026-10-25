/**
 * Configuración global equivalente a js/generic/constantes.js
 * Conectado al Backend .NET 10 Native AOT y SQL Server On-Premise (DESKTOP-LOCAL).
 */
export const GOSST_CONFIG = {
  version: 'g.7.4.0-AOT',
  rutaFront: '/sstweb',
  rutaBack: '/sst',
  bucketOnPremise: 'msst-onpremise-storage',
  get apiUrl(): string {
    if (typeof window !== 'undefined' && (window.location.port === '4200' || window.location.port === '8080')) {
      return 'http://localhost:5000/sst';
    }
    return '/sst';
  }
};

export function urlArchivoOnPremise(url: string | null | undefined): string {
  if (!url) return '';
  if (url.indexOf('/evidencia/ver') === -1 && (url.indexOf('.amazonaws.com/') !== -1 || url.indexOf('DOC-') !== -1)) {
    return `${GOSST_CONFIG.apiUrl}/evidencia/ver?url=${encodeURIComponent(url)}`;
  }
  return url;
}
