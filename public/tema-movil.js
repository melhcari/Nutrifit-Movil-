/* NutriFit Móvil - sincroniza la paleta elegida en páginas independientes.
   Incluir este archivo con defer en servicios.html, recetas.html y ejercicios.html. */
(function () {
  "use strict";
  const KEY = "nutrifit-mobile-appearance-global";
  const MOBILE = window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
  if (!MOBILE) return;

  function validColor(value) {
    return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
  }

  function readAppearance() {
    const fallback = { mode: "light", accent: "#28a745" };
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return fallback;
      const value = JSON.parse(raw);
      return {
        mode: value.mode === "dark" ? "dark" : "light",
        accent: validColor(value.accent) ? value.accent : "#28a745"
      };
    } catch (error) {
      console.warn("NutriFit: no se pudo leer la apariencia compartida.", error);
      return fallback;
    }
  }

  function luminance(hex) {
    const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const linear = rgb.map((v) => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }

  function apply(appearance) {
    const body = document.body;
    const accent = appearance.accent;
    const whiteContrast = (1.05) / (luminance(accent) + 0.05);
    const blackContrast = (luminance(accent) + 0.05) / 0.05;
    const textColor = whiteContrast >= 4.5 ? "#ffffff" : (blackContrast >= 4.5 ? "#202124" : "#202124");

    body.dataset.nfMobileTheme = appearance.mode;
    body.dataset.nfMobilePalette = "true";
    body.style.setProperty("--nf-mobile-accent", accent);
    body.style.setProperty("--nf-mobile-accent-contrast", textColor);
    document.documentElement.style.setProperty("--nf-mobile-accent", accent);
    document.documentElement.style.setProperty("--nf-mobile-accent-contrast", textColor);
    document.documentElement.style.colorScheme = appearance.mode;
    if (accent.toLowerCase() === "#28a745") delete body.dataset.nfMobileCustom;
    else body.dataset.nfMobileCustom = "true";

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = accent;
  }

  function start() {
    if (!document.body) return;
    apply(readAppearance());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  window.addEventListener("storage", (event) => {
    if (event.key === KEY) apply(readAppearance());
  });
})();
