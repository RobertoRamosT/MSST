# MSST Frontend — Angular 22+ (Standalone + Zoneless + Signals)

## Especificaciones Técnicas
- **Arquitectura:** Angular Standalone Components + Zoneless (`provideZonelessChangeDetection()`) + Signals.
- **Compatibilidad 1:1 con GOSST:**
  - Conserva el 100% de las hojas de estilo originales (`bootstrap-s.css`, `terminosCondiciones.css`, `estilosIndicadores.css`, `movilGosst.css`).
  - Incluye el catálogo completo de las **42 pantallas HTML** en [`gosst-screens.catalog.ts`](file:///D:/Temp/Maximo/MSST/Frontend/src/app/core/catalog/gosst-screens.catalog.ts) y los activos estáticos en `public/sstweb/` apuntando al Backend local `.NET 10 Native AOT` (`http://localhost:5000/sst`).
- **Servicios Core:**
  - [`GosstApiService`](file:///D:/Temp/Maximo/MSST/Frontend/src/app/core/services/gosst-api.service.ts): Cliente HTTP para los 1,344 endpoints (`/sst/*`).
  - [`GosstSessionService`](file:///D:/Temp/Maximo/MSST/Frontend/src/app/core/services/gosst-session.service.ts): Administración reactiva de `sessionStorage` compatible 1:1 con `util.js`.
  - [`gosstAuthInterceptor`](file:///D:/Temp/Maximo/MSST/Frontend/src/app/core/interceptors/gosst-auth.interceptor.ts): Manejo de credenciales `CGESTOP_HEADER_DS` y validación de `CODE_RESPONSE` (`01`, `02`, `05`, `06`, `07`).

## Ejecución Rápida
```powershell
npm install
npm start
```
