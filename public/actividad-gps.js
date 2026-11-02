/*
 * NutriFit - Actividad al aire libre (GPS)
 * Crea su propia pantalla GPS para no tener que modificar ejercicios.js.
 * - Aviso personalizado antes del permiso oficial del navegador.
 * - Punto rojo para la ubicación y línea roja para el recorrido.
 * - Distancia, tiempo activo, ritmo y velocidad.
 * - Pausar, reanudar, finalizar e historial local (sin guardar coordenadas).
 * Requiere HTTPS, Leaflet y permiso de ubicación.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "nutrifit_gps_historial_v1";
  var app = document.getElementById("app");
  if (!app) return;

  var state = "idle"; // idle | tracking | paused | finished
  var activityType = "walk";
  var watchId = null;
  var tickerId = null;
  var wakeLock = null;
  var map = null;
  var routeLine = null;
  var currentMarker = null;
  var routePoints = [];
  var lastAcceptedPoint = null;
  var firstMarkerShown = false;
  var distanceMeters = 0;
  var elapsedBeforeRunMs = 0;
  var runStartedAt = 0;
  var activityStartedAt = null;
  var lastStatus = "";

  var $ = function (id) { return document.getElementById(id); };
  var el = {};
  var ACTIVITY_LABELS = {
    walk: "Caminata",
    run: "Carrera",
    free: "Actividad libre"
  };

  function injectStyles() {
    if ($("nutrifitGpsStyles")) return;
    var style = document.createElement("style");
    style.id = "nutrifitGpsStyles";
    style.textContent = `
      .gps-launch-card{display:flex;align-items:center;gap:13px;margin:18px 0;padding:16px;border:1px solid #dcebe0;border-radius:18px;background:#fff;box-shadow:0 8px 22px rgba(30,75,43,.07);font-family:Poppins,sans-serif}
      .gps-launch-icon{display:grid;flex:0 0 44px;width:44px;height:44px;place-items:center;border-radius:14px;background:#eaf6ed;color:#23864a;font-size:20px}
      .gps-launch-copy{display:grid;gap:4px;min-width:0;flex:1}.gps-launch-copy b{color:#202a23;font-size:.83rem}.gps-launch-copy span{color:#68756c;font-size:.69rem;line-height:1.45}
      .gps-launch-button{flex:0 0 auto;padding:10px 13px;border:0;border-radius:999px;background:#23864a;color:#fff;font-family:Poppins,sans-serif;font-size:.72rem;font-weight:700}
      #gpsActivity{width:min(100% - 32px,760px);margin:0 auto;padding:96px 0 60px;color:#202a23;font-family:Poppins,sans-serif}
      #gpsActivity[hidden]{display:none!important}.gps-screen-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
      .gps-screen-head h1{margin:0;color:#202a23;font-size:1.45rem;font-weight:800}.gps-back{border:1px solid #dce9df;border-radius:999px;background:#fff;padding:9px 13px;color:#286e40;font-weight:700;font-size:.75rem}
      .gps-status{margin:12px 0;padding:11px 13px;border:1px solid #dcebe0;border-radius:13px;background:#f1f8f3;color:#317447;font-size:.75rem;line-height:1.55}
      .gps-status.is-loading{background:#fff9e9;border-color:#efe2bd;color:#81641f}.gps-status.is-error{background:#fff1f0;border-color:#f2d2cf;color:#a8322b}.gps-status.is-paused{background:#f4f4f4;border-color:#e3e3e3;color:#666}
      .gps-map-card{overflow:hidden;border:1px solid #dfeae1;border-radius:18px;background:#fff;box-shadow:0 8px 22px rgba(30,75,43,.05)}
      .gps-map-title{display:flex;justify-content:space-between;gap:10px;padding:12px 14px;color:#202a23;font-size:.73rem;font-weight:700}.gps-map-title span:last-child{color:#849087;font-weight:400}
      #gpsMap{width:100%;height:310px;background:#e9f1ee;z-index:1}.gps-map-credit{padding:8px 10px;color:#68756c;font-size:.65rem}
      .gps-legend{display:flex;flex-wrap:wrap;gap:16px;padding:10px 12px;border-top:1px solid #edf1ed;color:#68756c;font-size:.68rem}
      .gps-legend span{display:inline-flex;align-items:center;gap:7px}.gps-legend-dot{width:12px;height:12px;border:2px solid #fff;border-radius:50%;background:#e53935;box-shadow:0 0 0 1px #e53935}.gps-legend-line{width:23px;height:4px;border-radius:5px;background:#e53935}
      .gps-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:12px 0}.gps-stat{min-width:0;padding:14px 12px;border:1px solid #dfeae1;border-radius:16px;background:#fff;box-shadow:0 5px 15px rgba(30,75,43,.04)}
      .gps-stat small{display:block;color:#849087;font-size:.68rem}.gps-stat b{display:block;margin:5px 0 3px;color:#202a23;font-size:1.23rem;font-weight:800;overflow-wrap:anywhere}.gps-stat span{color:#849087;font-size:.64rem}
      .gps-accuracy{margin:8px 0 12px;color:#849087;font-size:.68rem}.gps-types{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}
      .gps-type{padding:11px 7px;border:1px solid #dce9df;border-radius:12px;background:#fff;color:#47634e;font-size:.72rem;font-weight:700}.gps-type.is-selected{border-color:#23864a;background:#eaf6ed;color:#176237}.gps-type:disabled{opacity:.55}
      .gps-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.gps-action{min-height:46px;padding:12px;border:0;border-radius:999px;background:#23864a;color:#fff;font-family:Poppins,sans-serif;font-size:.78rem;font-weight:700}.gps-action.secondary{border:1px solid #cfe3d3;background:#fff;color:#175b35}.gps-action.danger{background:#d83c35}.gps-action[hidden]{display:none!important}
      .gps-summary{margin-top:15px;padding:16px;border:1px solid #dcebe0;border-radius:17px;background:#fff}.gps-summary[hidden]{display:none!important}.gps-summary h2{margin:0 0 12px;font-size:1rem}.gps-summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.gps-summary-grid div{padding:10px;border-radius:12px;background:#f3f8f4}.gps-summary-grid small{display:block;color:#718075;font-size:.66rem}.gps-summary-grid b{display:block;margin-top:4px;font-size:.94rem}.gps-summary p,.gps-summary>small{color:#68756c;font-size:.72rem;line-height:1.6}
      .gps-history{margin-top:18px}.gps-history h2{font-size:1rem}.gps-history-item{display:flex;justify-content:space-between;gap:10px;margin:8px 0;padding:12px;border:1px solid #e0eae2;border-radius:13px;background:#fff}.gps-history-item b{display:block;font-size:.76rem}.gps-history-item small{display:block;margin-top:4px;color:#849087;font-size:.63rem}.gps-history-stats{display:grid;gap:3px;text-align:right;color:#47634e;font-size:.67rem}.gps-empty{color:#849087;font-size:.72rem;line-height:1.6}
      #nutrifitLocationConsent{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(10,35,20,.68)}
      .gps-consent-card{width:100%;max-width:390px;padding:25px 22px;border-radius:22px;background:#fff;box-shadow:0 20px 55px rgba(0,0,0,.22);font-family:Poppins,sans-serif;text-align:center}
      .gps-consent-icon{display:grid;width:58px;height:58px;margin:0 auto 15px;place-items:center;border-radius:18px;background:#eaf6ed;color:#23864a;font-size:25px}
      .gps-consent-card h2{margin:0 0 10px;color:#202a23;font-size:1.15rem}.gps-consent-card p{margin:0 0 18px;color:#68756c;font-size:.76rem;line-height:1.7}
      .gps-consent-card button{width:100%;margin-top:9px;padding:14px;border:0;border-radius:30px;background:#23864a;color:#fff;font-family:Poppins,sans-serif;font-size:.77rem;font-weight:700}
      .gps-consent-card button.gps-cancel{background:#edf3ee;color:#45604c}
      @media(min-width:520px){.gps-stats{grid-template-columns:repeat(4,minmax(0,1fr))}.gps-stat b{font-size:1.35rem}}
      @media(max-width:380px){#gpsActivity{width:calc(100% - 26px);padding-top:88px}.gps-launch-card{gap:9px;padding:13px}.gps-launch-button{padding:9px 10px;font-size:.67rem}#gpsMap{height:270px}.gps-stat{padding:12px 9px}.gps-stat b{font-size:1.05rem}}
    `;
    document.head.appendChild(style);
  }

  function createGpsScreen() {
    var section = $("gpsActivity");
    if (section) return section;

    section = document.createElement("section");
    section.id = "gpsActivity";
    section.hidden = true;
    section.innerHTML = `
      <div class="gps-screen-head">
        <div><p style="margin:0 0 4px;color:#23864a;font-size:.65rem;font-weight:700;letter-spacing:.12em">NUTRIFIT EN MOVIMIENTO</p><h1>Actividad al aire libre</h1></div>
        <button type="button" id="gpsBack" class="gps-back"><i class="fa-solid fa-arrow-left"></i> Volver</button>
      </div>
      <p id="gpsStatus" class="gps-status" aria-live="polite">Prepara tu caminata o carrera y comienza cuando estés listo.</p>
      <div class="gps-types" aria-label="Tipo de actividad">
        <button type="button" class="gps-type is-selected" data-gps-type="walk" aria-pressed="true">Caminata</button>
        <button type="button" class="gps-type" data-gps-type="run" aria-pressed="false">Carrera</button>
        <button type="button" class="gps-type" data-gps-type="free" aria-pressed="false">Libre</button>
      </div>
      <div class="gps-map-card">
        <div class="gps-map-title"><span>Tu recorrido en el mapa</span><span id="gpsMapState">Ubicación sin iniciar</span></div>
        <div id="gpsMap" role="application" aria-label="Mapa de tu recorrido"></div>
        <div class="gps-legend"><span><i class="gps-legend-dot"></i> Tu ubicación actual</span><span><i class="gps-legend-line"></i> Tu recorrido</span></div>
        <div class="gps-map-credit">Mapa © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>. La línea muestra el recorrido de esta sesión.</div>
      </div>
      <div class="gps-stats">
        <article class="gps-stat"><small>Distancia</small><b id="gpsDistance">0.00 km</b><span>Distancia registrada</span></article>
        <article class="gps-stat"><small>Tiempo activo</small><b id="gpsTime">00:00</b><span>Sin contar pausas</span></article>
        <article class="gps-stat"><small>Ritmo promedio</small><b id="gpsPace">--:--</b><span>Minutos por kilómetro</span></article>
        <article class="gps-stat"><small>Velocidad promedio</small><b id="gpsSpeed">0.0 km/h</b><span>Según distancia y tiempo</span></article>
      </div>
      <p id="gpsAccuracy" class="gps-accuracy">La ubicación se mostrará cuando inicies el recorrido.</p>
      <div class="gps-actions">
        <button type="button" id="gpsStart" class="gps-action">Iniciar recorrido</button>
        <button type="button" id="gpsPause" class="gps-action secondary" hidden>Pausar</button>
        <button type="button" id="gpsResume" class="gps-action" hidden>Reanudar</button>
        <button type="button" id="gpsFinish" class="gps-action danger" hidden>Finalizar</button>
      </div>
      <div id="gpsSummary" class="gps-summary" hidden><h2>Resumen de tu actividad</h2><div id="gpsSummaryBody"></div></div>
      <div class="gps-history"><h2>Mis recorridos recientes</h2><div id="gpsHistoryList"></div></div>
    `;
    app.insertAdjacentElement("afterend", section);
    return section;
  }

  function cacheElements() {
    el = {
      section: $("gpsActivity"), map: $("gpsMap"), mapState: $("gpsMapState"),
      status: $("gpsStatus"), distance: $("gpsDistance"), time: $("gpsTime"),
      pace: $("gpsPace"), speed: $("gpsSpeed"), accuracy: $("gpsAccuracy"),
      start: $("gpsStart"), pause: $("gpsPause"), resume: $("gpsResume"),
      finish: $("gpsFinish"), back: $("gpsBack"), summary: $("gpsSummary"),
      summaryBody: $("gpsSummaryBody"), history: $("gpsHistoryList")
    };
  }

  function setStatus(message, kind) {
    lastStatus = message;
    if (!el.status) return;
    el.status.textContent = message;
    el.status.className = "gps-status" + (kind ? " is-" + kind : "");
  }

  function formatClock(totalSeconds) {
    var seconds = Math.max(0, Math.floor(totalSeconds || 0));
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return h > 0 ? pad(h) + ":" + pad(m) + ":" + pad(s) : pad(m) + ":" + pad(s);
  }

  function formatPace(secondsPerKm) {
    if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0 || secondsPerKm > 7200) return "--:--";
    var seconds = Math.round(secondsPerKm);
    return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
  }

  function elapsedSeconds() {
    var current = state === "tracking" ? Math.max(0, Date.now() - runStartedAt) : 0;
    return Math.floor((elapsedBeforeRunMs + current) / 1000);
  }

  function updateMetrics() {
    var elapsed = elapsedSeconds();
    var km = distanceMeters / 1000;
    var pace = km >= 0.03 ? elapsed / km : NaN;
    var speed = elapsed > 0 && km > 0 ? (km / elapsed) * 3600 : 0;
    if (el.distance) el.distance.textContent = km.toFixed(2) + " km";
    if (el.time) el.time.textContent = formatClock(elapsed);
    if (el.pace) el.pace.textContent = formatPace(pace);
    if (el.speed) el.speed.textContent = speed > 0 ? speed.toFixed(1) + " km/h" : "0.0 km/h";
  }

  function updateControls() {
    if (el.start) el.start.hidden = state === "tracking" || state === "paused";
    if (el.pause) el.pause.hidden = state !== "tracking";
    if (el.resume) el.resume.hidden = state !== "paused";
    if (el.finish) el.finish.hidden = state !== "tracking" && state !== "paused";
    document.querySelectorAll("[data-gps-type]").forEach(function (button) {
      var selected = button.getAttribute("data-gps-type") === activityType;
      button.disabled = state === "tracking" || state === "paused";
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function distanceBetween(a, b) {
    var rad = function (degrees) { return degrees * Math.PI / 180; };
    var earthRadius = 6371000;
    var dLat = rad(b.lat - a.lat);
    var dLon = rad(b.lng - a.lng);
    var lat1 = rad(a.lat);
    var lat2 = rad(b.lat);
    var sinLat = Math.sin(dLat / 2);
    var sinLon = Math.sin(dLon / 2);
    var value = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
    return 2 * earthRadius * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  }

  function ensureMap() {
    if (map) return true;
    if (!window.L || !el.map) {
      setStatus("No se pudo cargar el mapa. Revisa tu conexión a Internet e inténtalo de nuevo.", "error");
      return false;
    }
    map = L.map(el.map, { zoomControl: true, scrollWheelZoom: false, tap: true }).setView([23.6345, -102.5528], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(map);
    routeLine = L.polyline([], {
      color: "#e53935", weight: 6, opacity: 0.9, lineCap: "round", lineJoin: "round"
    }).addTo(map);
    return true;
  }

  function updateCurrentMarker(point, first) {
    if (!ensureMap()) return;
    var latLng = [point.lat, point.lng];
    if (!currentMarker) {
      currentMarker = L.circleMarker(latLng, {
        radius: 9, color: "#ffffff", weight: 3,
        fillColor: "#e53935", fillOpacity: 1
      }).addTo(map).bindPopup("🔴 Estás aquí. NutriFit está mostrando tu ubicación.");
    } else {
      currentMarker.setLatLng(latLng);
    }
    if (first) map.setView(latLng, 17);
    else map.panTo(latLng, { animate: true, duration: 0.35 });
    firstMarkerShown = true;
    if (el.mapState) el.mapState.textContent = "🔴 Ubicación en vivo";
  }

  function addRoutePoint(point, first) {
    updateCurrentMarker(point, first);
    var latLng = [point.lat, point.lng];
    routePoints.push(latLng);
    if (routeLine) routeLine.setLatLngs(routePoints);
  }

  function resetMapRoute() {
    routePoints = [];
    lastAcceptedPoint = null;
    firstMarkerShown = false;
    if (ensureMap()) {
      if (routeLine) routeLine.setLatLngs([]);
      if (currentMarker) {
        map.removeLayer(currentMarker);
        currentMarker = null;
      }
      map.setView([23.6345, -102.5528], 5);
      if (el.mapState) el.mapState.textContent = "Esperando ubicación";
    }
  }

  function stopWatch() {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  }

  function stopTicker() {
    if (tickerId !== null) {
      window.clearInterval(tickerId);
      tickerId = null;
    }
  }

  function startTicker() {
    stopTicker();
    tickerId = window.setInterval(updateMetrics, 1000);
    updateMetrics();
  }

  async function requestWakeLock() {
    if (!("wakeLock" in navigator) || document.visibilityState !== "visible") return;
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", function () { wakeLock = null; });
    } catch (error) { /* El GPS continúa sin bloqueo de pantalla. */ }
  }

  async function releaseWakeLock() {
    if (!wakeLock) return;
    try { await wakeLock.release(); } catch (error) {}
    wakeLock = null;
  }

  function showLocationConsent(onAccept) {
    if ($("nutrifitLocationConsent")) return;
    var modal = document.createElement("div");
    modal.id = "nutrifitLocationConsent";
    modal.innerHTML = `
      <div class="gps-consent-card" role="dialog" aria-modal="true" aria-labelledby="gpsConsentTitle">
        <div class="gps-consent-icon"><i class="fa-solid fa-location-dot"></i></div>
        <h2 id="gpsConsentTitle">¡Comencemos tu recorrido!</h2>
        <p>NutriFit necesita acceder a tu ubicación para mostrar tu posición en el mapa, dibujar tu recorrido y calcular la distancia, el tiempo y la velocidad de tu actividad.<br><br>Tu ubicación exacta se utiliza para mostrar el recorrido en esta sesión. El historial guarda únicamente tus estadísticas, no las coordenadas del camino.</p>
        <button type="button" data-gps-consent-accept>Continuar y permitir ubicación</button>
        <button type="button" class="gps-cancel" data-gps-consent-cancel>Ahora no</button>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector("[data-gps-consent-accept]").addEventListener("click", function () {
      modal.remove();
      onAccept(); // La solicitud oficial se ejecuta directamente tras el toque del usuario.
    });
    modal.querySelector("[data-gps-consent-cancel]").addEventListener("click", function () {
      modal.remove();
      setStatus("No iniciamos el recorrido. Puedes comenzar cuando estés listo.", "paused");
    });
  }

  function startWatch() {
    if (!navigator.geolocation) {
      setStatus("Este navegador no permite acceder a la ubicación. Actualiza Chrome o Safari.", "error");
      return false;
    }
    if (!window.isSecureContext) {
      setStatus("El GPS necesita una conexión segura HTTPS. Abre NutriFit desde Netlify.", "error");
      return false;
    }
    watchId = navigator.geolocation.watchPosition(onPosition, onPositionError, {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 25000
    });
    return true;
  }

  function startActivity() {
    if (state === "tracking" || state === "paused") return;
    if (!window.isSecureContext) {
      setStatus("Para utilizar el GPS debes abrir NutriFit mediante HTTPS.", "error");
      return;
    }
    if (!navigator.geolocation) {
      setStatus("Tu navegador no permite utilizar el GPS. Actualiza Chrome o Safari.", "error");
      return;
    }
    showLocationConsent(startActivityAfterConsent);
  }

  function startActivityAfterConsent() {
    distanceMeters = 0;
    elapsedBeforeRunMs = 0;
    runStartedAt = Date.now();
    activityStartedAt = new Date().toISOString();
    resetMapRoute();
    if (el.summary) el.summary.hidden = true;
    if (el.accuracy) el.accuracy.textContent = "Esperando señal GPS…";
    state = "tracking";
    updateControls();
    setStatus("🔴 Recorrido en curso. Esperando señal GPS para ubicarte en el mapa…", "loading");
    startTicker();
    requestWakeLock();
    if (!startWatch()) {
      state = "idle";
      stopTicker();
      updateControls();
      return;
    }
    updateMetrics();
  }

  function onPosition(position) {
    if (state !== "tracking") return;
    var coords = position.coords || {};
    var accuracy = Number(coords.accuracy);
    var point = {
      lat: Number(coords.latitude),
      lng: Number(coords.longitude),
      accuracy: Number.isFinite(accuracy) ? accuracy : 999,
      timestamp: Number(position.timestamp) || Date.now()
    };
    if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng)) return;

    // El punto rojo se muestra incluso con precisión baja (como ±92 m).
    // La línea solo se dibuja con una lectura más confiable (65 m o menos).
    if (point.accuracy > 65) {
      updateCurrentMarker(point, !firstMarkerShown);
      if (el.accuracy) el.accuracy.textContent = "Precisión baja: ±" + Math.round(point.accuracy) + " m. El punto rojo es aproximado.";
      setStatus("🔴 Tu ubicación aproximada está marcada en rojo. Esperando una señal más precisa para dibujar la ruta.", "loading");
      return;
    }

    if (!lastAcceptedPoint) {
      lastAcceptedPoint = point;
      addRoutePoint(point, !firstMarkerShown);
      if (el.accuracy) el.accuracy.textContent = "Precisión aproximada: ±" + Math.round(point.accuracy) + " m";
      setStatus("🔴 GPS conectado. La línea roja comenzará a mostrar tu recorrido.", "success");
      return;
    }

    var segmentMeters = distanceBetween(lastAcceptedPoint, point);
    var deltaSeconds = Math.max(0.5, (point.timestamp - lastAcceptedPoint.timestamp) / 1000);
    var segmentSpeed = segmentMeters / deltaSeconds;
    var maxSpeed = activityType === "walk" ? 8 : (activityType === "run" ? 15 : 20);

    if (segmentSpeed > maxSpeed || segmentMeters > 250) {
      updateCurrentMarker(point, false);
      if (el.accuracy) el.accuracy.textContent = "Precisión aproximada: ±" + Math.round(point.accuracy) + " m";
      setStatus("Se detectó un salto de GPS y se omitió para evitar medir distancia incorrecta.", "loading");
      return;
    }

    if (segmentMeters >= 2.5) {
      distanceMeters += segmentMeters;
      lastAcceptedPoint = point;
      addRoutePoint(point, false);
    } else {
      updateCurrentMarker(point, false);
    }
    if (el.accuracy) el.accuracy.textContent = "Precisión aproximada: ±" + Math.round(point.accuracy) + " m";
    if (el.mapState) el.mapState.textContent = "🔴 Ubicación en vivo";
    if (lastStatus.indexOf("GPS conectado") !== 0) setStatus("🔴 Recorrido en curso. El punto rojo indica tu ubicación y la línea roja tu camino.", "success");
    updateMetrics();
  }

  function onPositionError(error) {
    var message = "No se pudo actualizar la ubicación.";
    if (error && error.code === 1) {
      message = "No autorizaste la ubicación. Actívala para NutriFit en los ajustes del navegador y vuelve a intentarlo.";
      stopWatch();
      stopTicker();
      elapsedBeforeRunMs = 0;
      runStartedAt = 0;
      state = "idle";
      releaseWakeLock();
      updateControls();
    } else if (error && error.code === 2) {
      message = "No se pudo obtener la ubicación. Comprueba que el GPS del celular esté activado y prueba en un espacio abierto.";
    } else if (error && error.code === 3) {
      message = "El GPS tardó en responder. Seguimos esperando señal; intenta moverte a un lugar abierto.";
    }
    setStatus(message, "error");
  }

  function pauseActivity() {
    if (state !== "tracking") return;
    elapsedBeforeRunMs += Math.max(0, Date.now() - runStartedAt);
    runStartedAt = 0;
    state = "paused";
    stopWatch();
    stopTicker();
    releaseWakeLock();
    updateMetrics();
    updateControls();
    setStatus("Recorrido en pausa. Cuando estés listo, reanuda para continuar.", "paused");
  }

  function resumeActivity() {
    if (state !== "paused") return;
    state = "tracking";
    runStartedAt = Date.now();
    updateControls();
    if (!startWatch()) {
      state = "paused";
      runStartedAt = 0;
      updateControls();
      return;
    }
    startTicker();
    requestWakeLock();
    setStatus("🔴 Recorrido en curso. El punto rojo indica tu ubicación y la línea roja tu camino.", "success");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function loadHistory() {
    try {
      var records = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(records) ? records.slice(0, 20) : [];
    } catch (error) { return []; }
  }

  function renderHistory() {
    if (!el.history) return;
    var records = loadHistory();
    if (!records.length) {
      el.history.innerHTML = '<p class="gps-empty">Todavía no tienes recorridos guardados. Cuando termines tu primera caminata o carrera aparecerá aquí.</p>';
      return;
    }
    el.history.innerHTML = records.map(function (item) {
      var date = new Date(item.date);
      var dateText = isNaN(date.getTime()) ? "Actividad anterior" : date.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
      return '<article class="gps-history-item"><div><b>' + escapeHtml(item.type) + '</b><small>' + escapeHtml(dateText) + '</small></div>' +
        '<div class="gps-history-stats"><span>' + Number(item.km || 0).toFixed(2) + ' km</span><span>' + escapeHtml(item.time || "00:00") + '</span><span>' + escapeHtml(item.pace || "--:--") + ' min/km</span></div></article>';
    }).join("");
  }

  function saveHistory(record) {
    try {
      var history = loadHistory();
      history.unshift(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
      renderHistory();
      return true;
    } catch (error) { return false; }
  }

  function finishActivity() {
    if (state !== "tracking" && state !== "paused") return;
    if (state === "tracking") elapsedBeforeRunMs += Math.max(0, Date.now() - runStartedAt);
    runStartedAt = 0;
    stopWatch();
    stopTicker();
    releaseWakeLock();
    state = "finished";
    updateMetrics();
    updateControls();

    var seconds = Math.floor(elapsedBeforeRunMs / 1000);
    var km = distanceMeters / 1000;
    var pace = km >= 0.03 ? formatPace(seconds / km) : "--:--";
    var speed = seconds > 0 && km > 0 ? (km / seconds) * 3600 : 0;
    var record = {
      date: activityStartedAt || new Date().toISOString(),
      type: ACTIVITY_LABELS[activityType],
      km: Number(km.toFixed(3)), seconds: seconds,
      time: formatClock(seconds), pace: pace, speed: Number(speed.toFixed(2))
    };
    var saved = km >= 0.02 && seconds >= 5;
    var stored = saved ? saveHistory(record) : false;

    if (el.summary && el.summaryBody) {
      el.summaryBody.innerHTML = '<div class="gps-summary-grid">' +
        '<div><small>Distancia</small><b>' + km.toFixed(2) + ' km</b></div>' +
        '<div><small>Tiempo</small><b>' + escapeHtml(formatClock(seconds)) + '</b></div>' +
        '<div><small>Ritmo promedio</small><b>' + escapeHtml(pace) + ' min/km</b></div>' +
        '<div><small>Velocidad promedio</small><b>' + speed.toFixed(1) + ' km/h</b></div></div>' +
        '<p>' + (stored ? '¡Buen trabajo! Guardamos el resumen de tu actividad en este dispositivo.' : (saved ? 'Tu recorrido terminó, pero no se pudo guardar el historial en este navegador.' : 'El recorrido fue demasiado corto para guardarlo en el historial. Puedes intentarlo nuevamente.')) + '</p>' +
        '<small>Por privacidad, guardamos tus estadísticas, no las coordenadas exactas de tu recorrido.</small>';
      el.summary.hidden = false;
    }
    setStatus("Actividad finalizada. ¡Buen trabajo!", "success");
    if (el.mapState) el.mapState.textContent = "Actividad finalizada";
  }

  function openGps() {
    app.hidden = true;
    el.section.hidden = false;
    ensureMap();
    renderHistory();
    window.setTimeout(function () {
      if (map) map.invalidateSize();
      el.section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function closeGps() {
    if (state === "tracking" || state === "paused") {
      setStatus("Tu recorrido sigue activo. Finalízalo antes de volver a la rutina.", "error");
      return;
    }
    el.section.hidden = true;
    app.hidden = false;
    app.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addLauncher() {
    var home = app.querySelector(".ej-hero");
    var routine = app.querySelector(".ej-rutina-head");
    var target = home ? (app.querySelector(".ej-intro-grid") || home) : routine;
    var existing = $("gpsLaunchCard");
    if (!target) {
      if (existing) existing.remove();
      return;
    }
    if (!existing) {
      existing = document.createElement("section");
      existing.id = "gpsLaunchCard";
      existing.className = "gps-launch-card";
      existing.innerHTML = '<div class="gps-launch-icon" aria-hidden="true"><i class="fa-solid fa-person-walking"></i></div>' +
        '<div class="gps-launch-copy"><b>Actividad al aire libre</b><span>Registra caminatas y carreras con el GPS de tu celular.</span></div>' +
        '<button type="button" class="gps-launch-button" data-gps-open>Explorar <i class="fa-solid fa-arrow-right"></i></button>';
    }
    if (existing.previousElementSibling !== target) target.insertAdjacentElement("afterend", existing);
  }

  function init() {
    injectStyles();
    createGpsScreen();
    cacheElements();
    if (el.start) el.start.addEventListener("click", startActivity);
    if (el.pause) el.pause.addEventListener("click", pauseActivity);
    if (el.resume) el.resume.addEventListener("click", resumeActivity);
    if (el.finish) el.finish.addEventListener("click", finishActivity);
    if (el.back) el.back.addEventListener("click", closeGps);

    document.addEventListener("click", function (event) {
      var openButton = event.target.closest("[data-gps-open]");
      if (openButton) { openGps(); return; }
      var typeButton = event.target.closest("[data-gps-type]");
      if (typeButton && state !== "tracking" && state !== "paused") {
        activityType = typeButton.getAttribute("data-gps-type");
        updateControls();
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && state === "tracking") requestWakeLock();
    });
    window.addEventListener("pagehide", function () {
      if (state === "tracking") pauseActivity();
      else { stopWatch(); stopTicker(); releaseWakeLock(); }
    });

    if ("MutationObserver" in window) {
      var observer = new MutationObserver(function () { addLauncher(); });
      observer.observe(app, { childList: true, subtree: true });
    }
    addLauncher();
    updateControls();
    updateMetrics();
    renderHistory();
  }

  init();
})();
