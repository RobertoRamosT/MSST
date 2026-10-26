const target = process.env.MSST_API_URL;
if (!target) throw new Error('Configure MSST_API_URL con el origen HTTPS del servicio MSST.');
const origin = new URL(target);
if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash)
  throw new Error('MSST_API_URL debe ser un origen HTTPS sin credenciales ni rutas.');
module.exports = {'/sst/**': {target: origin.origin, secure: true, changeOrigin: true}};
