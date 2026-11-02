/*
 * NutriFit - Actividad al aire libre (web GPS)
 * - Seguimiento GPS con Geolocation.watchPosition.
 * - Mapa y ruta en tiempo real con Leaflet + OpenStreetMap.
 * - Distancia, tiempo activo, ritmo y velocidad promedio.
 * - Pausa, reanudación, finalización e historial local.
 * - Por privacidad, el historial guarda estadísticas, NO coordenadas de la ruta.
 *
 * Requiere HTTPS y permiso explícito de ubicación del navegador.
 * El seguimiento web está diseñado para permanecer en primer plano.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "nutrifit_gps_historial_v1";
  var app = document.getElementById("app");
  var section = document.getElementById("gpsActivity");
  if (!app || !section) return;

  var state = "idle"; // idle | tracking | paused | finished
  var activityType = "walk";
  var watchId = null;
  var tickId = null;
  var wakeLock = null;
  var map = null;
  var routeLine = null;
  var currentMarker = null;
  var routePoints = [];
  var lastAcceptedPoint = null;
  var distanceMeters = 0;
  var elapsedBeforeRunMs = 0;
  var runStartedAt = 0;
  var activityStartedAt = null;
  var lastStatus = "";

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    map: $("gpsMap"),
    status: $("gpsStatus"),
    distance: $("gpsDistance"),
    time: $("gpsTime"),
    pace: $("gpsPace"),
    speed: $("gpsSpeed"),
    accuracy: $("gpsAccuracy"),
    start: $("gpsStart"),
    pause: $("gpsPause"),
    resume: $("gpsResume"),
    finish: $("gpsFinish"),
    back: $("gpsBack"),
    summary: $("gpsSummary"),
    summaryBody: $("gpsSummaryBody"),
    history: $("gpsHistoryList"),
    mapFallback: $("gpsMapFallback")
  };

  var ACTIVITY_LABELS = {
    walk: "Caminata",
    run: "Carrera",
    free: "Actividad libre"
  };

  function setStatus(message, kind) {
    lastStatus = message;
    if (!el.status) return;
    el.status.textContent = message;
    el.status.className = "gps-status" + (kind ? " is-" + kind : "");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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
      button.disabled = state === "tracking" || state === "paused";
      button.classList.toggle("is-selected", button.getAttribute("data-gps-type") === activityType);
      button.setAttribute("aria-pressed", button.getAttribute("data-gps-type") === activityType ? "true" : "false");
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
    if (map || !window.L || !el.map) return !!map;

    map = L.map(el.map, {
      zoomControl: true,
      scrollWheelZoom: false,
      tap: true
    }).setView([23.6345, -102.5528], 5);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(map);

    routeLine = L.polyline([], {
      color: "#23864a",
      weight: 6,
      opacity: 0.88,
      lineCap: "round",
      lineJoin: "round"
    }).addTo(map);

    return true;
  }

  function resetMapRoute() {
    routePoints = [];
    lastAcceptedPoint = null;
    if (!ensureMap()) return;
    if (routeLine) routeLine.setLatLngs([]);
    if (currentMarker) {
      map.removeLayer(currentMarker);
      currentMarker = null;
    }
  }

  function drawPosition(point, first) {
    if (!ensureMap()) {
      if (el.mapFallback) el.mapFallback.hidden = false;
      return;
    }
    var latLng = [point.lat, point.lng];
    routePoints.push(latLng);
    routeLine.setLatLngs(routePoints);

    if (!currentMarker) {
      currentMarker = L.circleMarker(latLng, {
        radius: 9,
        color: "#ffffff",
        weight: 3,
        fillColor: "#23864a",
        fillOpacity: 1
      }).addTo(map).bindPopup("Tu ubicación actual");
    } else {
      currentMarker.setLatLng(latLng);
    }

    if (first) map.setView(latLng, 17);
    else map.panTo(latLng, { animate: true, duration: 0.35 });
  }

  function clearWatch() {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  }

  function stopTicker() {
    if (tickId !== null) {
      window.clearInterval(tickId);
      tickId = null;
    }
  }

  function startTicker() {
    stopTicker();
    tickId = window.setInterval(updateMetrics, 1000);
    updateMetrics();
  }

  async function requestWakeLock() {
    if (!("wakeLock" in navigator) || document.visibilityState !== "visible") return;
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", function () { wakeLock = null; });
    } catch (error) {
      // El navegador puede no permitir Wake Lock; el GPS sigue funcionando en primer plano.
    }
  }

  async function releaseWakeLock() {
    if (!wakeLock) return;
    try { await wakeLock.release(); } catch (error) {}
    wakeLock = null;
  }

  function startWatch() {
    if (!navigator.geolocation) {
      setStatus("Este navegador no ofrece acceso a la ubicación. Prueba con Chrome o Safari actualizado.", "error");
      return false;
    }
    if (!window.isSecureContext) {
      setStatus("El GPS necesita una conexión segura HTTPS. Abre NutriFit desde su dirección de Netlify.", "error");
      return false;
    }

    watchId = navigator.geolocation.watchPosition(
      onPosition,
      onPositionError,
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 20000
      }
    );
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

    distanceMeters = 0;
    elapsedBeforeRunMs = 0;
    runStartedAt = Date.now();
    activityStartedAt = new Date().toISOString();
    resetMapRoute();
    if (el.summary) el.summary.hidden = true;
    if (el.accuracy) el.accuracy.textContent = "Esperando señal GPS…";

    state = "tracking";
    updateControls();
    setStatus("Solicitando ubicación. Permite el acceso al GPS para comenzar a registrar tu recorrido…", "loading");
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

  function pauseActivity() {
    if (state !== "tracking") return;
    elapsedBeforeRunMs += Math.max(0, Date.now() - runStartedAt);
    runStartedAt = 0;
    state = "paused";
    clearWatch();
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
    setStatus("Recorrido en marcha. Mantén esta pantalla abierta para registrar el GPS.", "success");
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
    if (point.accuracy > 65) {
      if (el.accuracy) el.accuracy.textContent = "Precisión baja: ±" + Math.round(point.accuracy) + " m";
      setStatus("La señal GPS todavía es imprecisa. Sal a un espacio abierto y espera unos segundos.", "loading");
      return;
    }

    if (!lastAcceptedPoint) {
      lastAcceptedPoint = point;
      drawPosition(point, true);
      if (el.accuracy) el.accuracy.textContent = "Precisión aproximada: ±" + Math.round(point.accuracy) + " m";
      setStatus("GPS conectado. ¡Buen recorrido!", "success");
      return;
    }

    var segmentMeters = distanceBetween(lastAcceptedPoint, point);
    var deltaSeconds = Math.max(0.5, (point.timestamp - lastAcceptedPoint.timestamp) / 1000);
    var segmentSpeed = segmentMeters / deltaSeconds;
    var maxSpeed = activityType === "walk" ? 8 : (activityType === "run" ? 15 : 20);

    // Filtra saltos GPS poco plausibles y pequeños movimientos debidos al ruido de señal.
    if (segmentSpeed > maxSpeed || segmentMeters > 250) {
      setStatus("Se detectó un salto de ubicación y se omitió para evitar medir distancia incorrecta.", "loading");
      return;
    }

    if (segmentMeters >= 2.5) {
      distanceMeters += segmentMeters;
      lastAcceptedPoint = point;
      drawPosition(point, false);
    }

    if (el.accuracy) el.accuracy.textContent = "Precisión aproximada: ±" + Math.round(point.accuracy) + " m";
    if (lastStatus.indexOf("GPS conectado") !== 0) setStatus("Recorrido en marcha. Mantén esta pantalla abierta.", "success");
    updateMetrics();
  }

  function onPositionError(error) {
    var message = "No se pudo actualizar la ubicación.";
    if (error && error.code === 1) {
      message = "No diste permiso para compartir tu ubicación. Activa la ubicación para NutriFit desde los ajustes del navegador y vuelve a intentarlo.";
      clearWatch();
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

  function loadHistory() {
    try {
      var items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(items) ? items.slice(0, 20) : [];
    } catch (error) {
      return [];
    }
  }

  function saveHistory(record) {
    try {
      var history = loadHistory();
      history.unshift(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
      renderHistory();
    } catch (error) {
      setStatus("El recorrido terminó, pero el navegador no permitió guardar el historial local.", "error");
    }
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
      return '<article class="gps-history-item">' +
        '<div><b>' + escapeHtml(item.type) + '</b><small>' + escapeHtml(dateText) + '</small></div>' +
        '<div class="gps-history-stats"><span>' + Number(item.km || 0).toFixed(2) + ' km</span><span>' + escapeHtml(item.time || "00:00") + '</span><span>' + escapeHtml(item.pace || "--:--") + ' min/km</span></div>' +
      '</article>';
    }).join("");
  }

  function finishActivity() {
    if (state !== "tracking" && state !== "paused") return;
    if (state === "tracking") elapsedBeforeRunMs += Math.max(0, Date.now() - runStartedAt);
    runStartedAt = 0;
    clearWatch();
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
      km: Number(km.toFixed(3)),
      seconds: seconds,
      time: formatClock(seconds),
      pace: pace,
      speed: Number(speed.toFixed(2))
    };

    var saved = km >= 0.02 && seconds >= 5;
    if (saved) saveHistory(record);

    if (el.summary && el.summaryBody) {
      el.summaryBody.innerHTML =
        '<div class="gps-summary-grid">' +
          '<div><small>Distancia</small><b>' + km.toFixed(2) + ' km</b></div>' +
          '<div><small>Tiempo</small><b>' + escapeHtml(formatClock(seconds)) + '</b></div>' +
          '<div><small>Ritmo promedio</small><b>' + escapeHtml(pace) + ' min/km</b></div>' +
          '<div><small>Velocidad promedio</small><b>' + speed.toFixed(1) + ' km/h</b></div>' +
        '</div>' +
        '<p>' + (saved ? '¡Buen trabajo! Guardamos el resumen de tu actividad en este dispositivo.' : 'El recorrido fue demasiado corto para guardarlo en el historial. Puedes intentarlo nuevamente.') + '</p>' +
        '<small>Por privacidad, no guardamos las coordenadas exactas de tu recorrido.</small>';
      el.summary.hidden = false;
    }
    setStatus(saved ? "Actividad finalizada y resumen guardado en este dispositivo." : "Actividad finalizada.", "success");
  }

  function openGps() {
    app.classList.add("gps-app-hidden");
    section.hidden = false;
    ensureMap();
    renderHistory();
    window.setTimeout(function () {
      if (map) map.invalidateSize();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function closeGps() {
    if (state === "tracking" || state === "paused") {
      setStatus("Tu recorrido sigue activo. Finalízalo antes de volver a la rutina.", "error");
      return;
    }
    section.hidden = true;
    app.classList.remove("gps-app-hidden");
    app.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addLauncher() {
    var home = app.querySelector(".ej-hero");
    var routine = app.querySelector(".ej-rutina-head");
    var target = null;
    if (home) target = app.querySelector(".ej-intro-grid") || home;
    else if (routine) target = routine;

    var existing = $("gpsLaunchCard");
    if (!target) {
      if (existing) existing.remove();
      return;
    }

    if (!existing) {
      existing = document.createElement("section");
      existing.id = "gpsLaunchCard";
      existing.className = "gps-launch-card";
      existing.innerHTML =
        '<div class="gps-launch-icon" aria-hidden="true"><i class="fa-solid fa-person-walking"></i></div>' +
        '<div class="gps-launch-copy"><b>Actividad al aire libre</b><span>Registra caminatas y carreras con el GPS de tu celular.</span></div>' +
        '<button type="button" class="gps-launch-button" data-gps-open>Explorar <i class="fa-solid fa-arrow-right"></i></button>';
    }
    if (existing.previousElementSibling !== target) target.insertAdjacentElement("afterend", existing);
  }

  document.addEventListener("click", function (event) {
    var openButton = event.target.closest("[data-gps-open]");
    if (openButton) {
      openGps();
      return;
    }
    var typeButton = event.target.closest("[data-gps-type]");
    if (typeButton && state !== "tracking" && state !== "paused") {
      activityType = typeButton.getAttribute("data-gps-type");
      updateControls();
    }
  });

  if (el.start) el.start.addEventListener("click", startActivity);
  if (el.pause) el.pause.addEventListener("click", pauseActivity);
  if (el.resume) el.resume.addEventListener("click", resumeActivity);
  if (el.finish) el.finish.addEventListener("click", finishActivity);
  if (el.back) el.back.addEventListener("click", closeGps);

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && state === "tracking") requestWakeLock();
  });

  window.addEventListener("pagehide", function () {
    // Al salir de la página se pausa el seguimiento por seguridad y privacidad.
    // El usuario podrá reanudarlo manualmente si vuelve desde el historial del navegador.
    if (state === "tracking") pauseActivity();
    else {
      clearWatch();
      stopTicker();
      releaseWakeLock();
    }
  });

  if ("MutationObserver" in window) {
    var observer = new MutationObserver(function () { addLauncher(); });
    observer.observe(app, { childList: true, subtree: true });
  }
  addLauncher();
  updateControls();
  updateMetrics();
  renderHistory();
})();
