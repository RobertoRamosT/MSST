// ============================================================================
// CONFIGURACIÓN LOCAL ON-PREMISE MSST (.NET 10 Native AOT + SQL Server DESKTOP-LOCAL)
// ============================================================================
var configGlobal = {
    rutaFront: "/sstweb",
    rutaBack: "/sst",
    nombreBucketS3: "msst-onpremise-storage"
};

// Detecta automáticamente si corre en proxy IIS/Angular o directo contra puerto 5000 (.NET 10 AOT)
var BACKEND_ORIGIN = (window.location.port === '4200' || window.location.port === '8080')
    ? 'http://localhost:5000'
    : window.location.origin;

var URL = BACKEND_ORIGIN + configGlobal.rutaBack;
var URLCorto = window.location.origin + configGlobal.rutaFront;
var BUCKETAMAZONS3 = configGlobal.nombreBucketS3;

function urlArchivo(url) {
    if (url && typeof url === 'string' && url.indexOf('/evidencia/ver') === -1
            && (url.indexOf('.amazonaws.com/') !== -1 || url.indexOf('DOC-') !== -1)) {
        return URL + '/evidencia/ver?url=' + encodeURIComponent(url);
    }
    return url;
}

function obtenerUrlFirmada(url, callback) {
    if (!url || typeof url !== 'string') {
        callback(url);
        return;
    }
    $.getJSON(URL + '/evidencia/firmar?url=' + encodeURIComponent(url))
        .done(function (r) { callback(r && r.url ? r.url : url); })
        .fail(function () { callback(url); });
}
