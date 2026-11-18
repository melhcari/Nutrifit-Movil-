/* NutriFit Móvil - Perfil independiente de NutriFit Web.
   Requiere Firebase Authentication ya inicializado por index.html. */

import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  updatePassword
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAoowzmCUuoyNQcrbEU60TknICVaA22StA",
  authDomain: "tarea-588d2.firebaseapp.com",
  projectId: "tarea-588d2",
  storageBucket: "tarea-588d2.firebasestorage.app",
  messagingSenderId: "1097872716155",
  appId: "1:1097872716155:web:b71f4a189ba2f1a993cdde",
  measurementId: "G-09ZTK2VCLG"
};

const MOBILE_QUERY = window.matchMedia("(max-width: 768px)");
if (!MOBILE_QUERY.matches) {
  console.info("NutriFit Perfil Móvil: módulo inactivo fuera de pantallas móviles.");
} else {
  bootMobileProfile();
}

function bootMobileProfile() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const profileContainer = document.getElementById("userProfileContainer");
  const panel = document.getElementById("sidePanel");
  const overlay = document.getElementById("overlay");

  if (!profileContainer) {
    console.error("NutriFit: no se encontró #userProfileContainer.");
    return;
  }

  const root = document.createElement("div");
  root.id = "mobileAccountRoot";
  root.innerHTML = `
    <section class="nm-screen" data-screen="home">
      <div class="nm-home-head">
        <span class="nm-mark"><i class="fa-solid fa-leaf" aria-hidden="true"></i></span>
        <div><h3>Tu espacio NutriFit</h3><p>Tu cuenta, a tu manera</p></div>
      </div>
      <article class="nm-profile-card">
        <div class="nm-banner" id="nmHomeBanner"></div>
        <div class="nm-avatar-wrap"><div class="nm-avatar" id="nmHomeAvatar"><i class="fa-solid fa-user" aria-hidden="true"></i></div></div>
        <div class="nm-profile-info">
          <h4 id="nmHomeName">Mi perfil</h4>
          <p class="nm-username" id="nmHomeUsername">Configura tu @usuario</p>
          <span class="nm-created"><i class="fa-regular fa-calendar" aria-hidden="true"></i><span id="nmCreatedAt">Miembro de NutriFit</span></span>
        </div>
      </article>
      <nav class="nm-menu" aria-label="Opciones de cuenta">
        <button class="nm-menu-btn" type="button" data-go="profile">
          <span class="nm-menu-icon"><i class="fa-solid fa-id-card" aria-hidden="true"></i></span>
          <span class="nm-menu-copy"><strong>Mi perfil</strong><small>Foto, portada, nombre y usuario</small></span>
          <i class="fa-solid fa-chevron-right nm-chevron" aria-hidden="true"></i>
        </button>
        <button class="nm-menu-btn" type="button" data-go="account">
          <span class="nm-menu-icon"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></span>
          <span class="nm-menu-copy"><strong>Configuración de cuenta</strong><small>Correo, contraseña y acceso</small></span>
          <i class="fa-solid fa-chevron-right nm-chevron" aria-hidden="true"></i>
        </button>
        <button class="nm-menu-btn" type="button" data-go="appearance">
          <span class="nm-menu-icon"><i class="fa-solid fa-palette" aria-hidden="true"></i></span>
          <span class="nm-menu-copy"><strong>Apariencia</strong><small>Modo claro, oscuro y color</small></span>
          <i class="fa-solid fa-chevron-right nm-chevron" aria-hidden="true"></i>
        </button>
      </nav>
      <div class="nm-account-actions">
        <button class="nm-secondary" id="nmSwitchAccount" type="button"><i class="fa-solid fa-repeat" aria-hidden="true"></i> Cambiar cuenta</button>
        <button class="nm-danger" id="nmSignOut" type="button"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Cerrar sesión</button>
      </div>
      <p class="nm-home-foot">Tu perfil móvil es independiente de NutriFit Web.</p>
    </section>

    <section class="nm-screen" data-screen="profile" hidden>
      <div class="nm-screen-head"><button class="nm-back" type="button" data-back aria-label="Volver"><i class="fa-solid fa-arrow-left"></i></button><h3>Editar perfil</h3></div>
      <p class="nm-screen-intro">Personaliza cómo te identificas dentro de NutriFit Móvil.</p>
      <form class="nm-form-card" id="nmProfileForm">
        <label class="nm-field">Nombre visible
          <input id="nmDisplayName" type="text" maxlength="40" minlength="2" placeholder="¿Cómo te llamas?" required>
        </label>
        <label class="nm-field">Nombre de usuario
          <input id="nmUsername" type="text" maxlength="20" placeholder="tunombre" autocomplete="username">
          <small class="nm-help">Usa de 3 a 20 letras, números, puntos o guiones bajos. Será único entre perfiles móviles.</small>
        </label>
        <div class="nm-preview-row"><div class="nm-preview-avatar" id="nmAvatarPreview"><i class="fa-solid fa-user"></i></div><div class="nm-preview-banner" id="nmBannerPreview"></div></div>
        <label class="nm-field">Foto de perfil
          <input class="nm-file" id="nmPhotoFile" type="file" accept="image/png,image/jpeg,image/webp">
          <small class="nm-help">JPG, PNG o WebP. Máximo 5 MB.</small>
        </label>
        <label class="nm-field">Banner o portada
          <input class="nm-file" id="nmBannerFile" type="file" accept="image/png,image/jpeg,image/webp">
          <small class="nm-help">JPG, PNG o WebP. Máximo 8 MB.</small>
        </label>
        <button class="nm-primary" id="nmSaveProfile" type="submit">Guardar cambios</button>
        <p class="nm-status" id="nmProfileStatus" role="status" aria-live="polite"></p>
      </form>
    </section>

    <section class="nm-screen" data-screen="account" hidden>
      <div class="nm-screen-head"><button class="nm-back" type="button" data-back aria-label="Volver"><i class="fa-solid fa-arrow-left"></i></button><h3>Cuenta y seguridad</h3></div>
      <p class="nm-screen-intro">Los cambios de correo y contraseña también se reflejan en NutriFit Web porque ambas usan la misma cuenta de acceso.</p>
      <div class="nm-form-card">
        <strong style="font-size:.82rem">Correo actual</strong>
        <p class="nm-current-email" id="nmCurrentEmail">Cargando correo...</p>
        <p class="nm-verified" id="nmVerifiedStatus"></p>
        <div class="nm-divider"></div>
        <form id="nmEmailForm">
          <label class="nm-field">Contraseña actual
            <input id="nmEmailCurrentPassword" type="password" autocomplete="current-password" required>
          </label>
          <label class="nm-field">Nuevo correo electrónico
            <input id="nmNewEmail" type="email" autocomplete="email" placeholder="nuevo@correo.com" required>
          </label>
          <button class="nm-primary" id="nmChangeEmail" type="submit">Solicitar cambio de correo</button>
          <p class="nm-help">Firebase enviará un enlace de verificación al nuevo correo. El cambio se completa al confirmar ese enlace.</p>
          <p class="nm-status" id="nmEmailStatus" role="status" aria-live="polite"></p>
        </form>
        <div class="nm-divider"></div>
        <form id="nmPasswordForm">
          <label class="nm-field">Contraseña actual
            <input id="nmPasswordCurrent" type="password" autocomplete="current-password" required>
          </label>
          <label class="nm-field">Nueva contraseña
            <input id="nmNewPassword" type="password" minlength="6" autocomplete="new-password" required>
          </label>
          <label class="nm-field">Confirmar nueva contraseña
            <input id="nmConfirmPassword" type="password" minlength="6" autocomplete="new-password" required>
          </label>
          <button class="nm-primary" id="nmChangePassword" type="submit">Actualizar contraseña</button>
          <p class="nm-status" id="nmPasswordStatus" role="status" aria-live="polite"></p>
        </form>
      </div>
      <div class="nm-account-actions">
        <button class="nm-secondary" id="nmSwitchAccountFromSettings" type="button"><i class="fa-solid fa-repeat"></i> Cambiar cuenta</button>
        <button class="nm-danger" id="nmSignOutFromSettings" type="button"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</button>
      </div>
    </section>

    <section class="nm-screen" data-screen="appearance" hidden>
      <div class="nm-screen-head"><button class="nm-back" type="button" data-back aria-label="Volver"><i class="fa-solid fa-arrow-left"></i></button><h3>Apariencia</h3></div>
      <p class="nm-screen-intro">Elige cómo quieres ver NutriFit Móvil. Tu preferencia se guardará en tu perfil móvil.</p>
      <div class="nm-form-card">
        <strong style="font-size:.82rem">Tema de la aplicación</strong>
        <div class="nm-theme-options" style="margin-top:12px">
          <button class="nm-theme-option" type="button" data-mode="light" aria-pressed="true"><span class="nm-theme-dot" style="background:#fff"></span>Claro</button>
          <button class="nm-theme-option" type="button" data-mode="dark" aria-pressed="false"><span class="nm-theme-dot" style="background:#17221b"></span>Oscuro</button>
        </div>
        <div class="nm-divider"></div>
        <div class="nm-color-row"><label for="nmAccentColor">Color principal personalizado</label><input id="nmAccentColor" type="color" value="#28a745" aria-label="Seleccionar color principal"></div>
        <small class="nm-help">El verde NutriFit es el color inicial. Puedes elegir cualquier otro color.</small>
        <button class="nm-secondary" id="nmResetAccent" type="button" style="margin-top:12px">Restablecer verde NutriFit</button>
        <p class="nm-status" id="nmAppearanceStatus" role="status" aria-live="polite"></p>
      </div>
    </section>
  `;
  profileContainer.appendChild(root);

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  let currentUser = null;
  let currentProfile = null;
  let currentScreen = "home";
  let selectedPhoto = null;
  let selectedBanner = null;
  let appearance = { mode: "light", accent: "#28a745" };

  function toast(message, isError = false) {
    if (typeof window.avisar === "function") {
      window.avisar(message);
      return;
    }
    console[isError ? "error" : "log"]("NutriFit:", message);
  }

  function setStatus(id, message, type = "") {
    const el = $(id);
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("is-error", type === "error");
    el.classList.toggle("is-ok", type === "ok");
  }

  function switchScreen(name) {
    currentScreen = name;
    $$(".nm-screen").forEach((screen) => {
      screen.hidden = screen.dataset.screen !== name;
    });
    const scroller = panel || root;
    scroller.scrollTo?.({ top: 0, behavior: "smooth" });
  }

  root.addEventListener("click", (event) => {
    const go = event.target.closest("[data-go]");
    if (go) switchScreen(go.dataset.go);
    if (event.target.closest("[data-back]")) switchScreen("home");
    const modeButton = event.target.closest("[data-mode]");
    if (modeButton) saveAppearance({ ...appearance, mode: modeButton.dataset.mode });
  });

  function escapeUsername(value) {
    return String(value || "").trim().replace(/^@/, "");
  }

  function usernameKey(value) {
    return escapeUsername(value).toLowerCase();
  }

  function formatDate(value) {
    if (!value) return "Fecha de registro no disponible";
    const date = value instanceof Date ? value : value.toDate ? value.toDate() : new Date(value);
    if (Number.isNaN(date.getTime())) return "Fecha de registro no disponible";
    return "Miembro desde " + new Intl.DateTimeFormat("es-MX", {
      day: "numeric", month: "long", year: "numeric"
    }).format(date);
  }

  function setAvatar(container, url) {
    if (!container) return;
    container.replaceChildren();
    if (url) {
      const img = document.createElement("img");
      img.src = url;
      img.alt = "Foto de perfil";
      img.loading = "lazy";
      container.appendChild(img);
    } else {
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-user";
      icon.setAttribute("aria-hidden", "true");
      container.appendChild(icon);
    }
  }

  function renderProfile(profile, user) {
    const displayName = profile.displayName || user.displayName || user.email?.split("@")[0] || "Usuario NutriFit";
    $("#nmHomeName").textContent = displayName;
    $("#nmHomeUsername").textContent = profile.username ? "@" + profile.username : "Configura tu @usuario";
    $("#nmCreatedAt").textContent = formatDate(profile.createdAt || user.metadata?.creationTime);
    setAvatar($("#nmHomeAvatar"), profile.photoURL || "");
    const banner = $("#nmHomeBanner");
    banner.style.backgroundImage = profile.bannerURL ? `url("${profile.bannerURL}")` : "";
    $("#nmDisplayName").value = profile.displayName || user.displayName || user.email?.split("@")[0] || "";
    $("#nmUsername").value = profile.username || "";
    setAvatar($("#nmAvatarPreview"), profile.photoURL || "");
    $("#nmBannerPreview").style.backgroundImage = profile.bannerURL ? `url("${profile.bannerURL}")` : "";
    $("#nmCurrentEmail").textContent = user.email || "Correo no disponible";
    $("#nmVerifiedStatus").textContent = user.emailVerified ? "✓ Correo verificado" : "Tu correo aún no está verificado.";
    $("#nmAccentColor").value = appearance.accent || "#28a745";
    updateModeButtons();
  }

  function applyAppearance() {
    document.body.dataset.nfMobileTheme = appearance.mode === "dark" ? "dark" : "light";
    document.body.style.setProperty("--nf-mobile-accent", appearance.accent || "#28a745");
    if ((appearance.accent || "#28a745").toLowerCase() === "#28a745") {
      delete document.body.dataset.nfMobileCustom;
    } else {
      document.body.dataset.nfMobileCustom = "true";
    }
    try {
      if (currentUser) localStorage.setItem(`nutrifit-mobile-appearance-${currentUser.uid}`, JSON.stringify(appearance));
    } catch (error) {
      console.warn("No se pudo guardar la apariencia localmente:", error);
    }
    updateModeButtons();
  }

  function updateModeButtons() {
    $$("[data-mode]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === appearance.mode));
    });
  }

  async function saveAppearance(nextAppearance) {
    appearance = {
      mode: nextAppearance.mode === "dark" ? "dark" : "light",
      accent: /^#[0-9a-fA-F]{6}$/.test(nextAppearance.accent || "") ? nextAppearance.accent : "#28a745"
    };
    applyAppearance();
    setStatus("#nmAppearanceStatus", "Guardando preferencias...");
    if (!currentUser) return;
    try {
      await setDoc(doc(db, "PerfilesMoviles", currentUser.uid), {
        appearance,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setStatus("#nmAppearanceStatus", "Preferencias guardadas.", "ok");
    } catch (error) {
      console.error("No se pudo guardar la apariencia:", error);
      setStatus("#nmAppearanceStatus", "No se pudo guardar en Firebase. Revisa las reglas de Firestore.", "error");
      toast("No se pudieron guardar tus preferencias en la nube.", true);
    }
  }

  function loadCachedAppearance(user) {
    appearance = { mode: "light", accent: "#28a745" };
    try {
      const saved = localStorage.getItem(`nutrifit-mobile-appearance-${user.uid}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        appearance = {
          mode: parsed.mode === "dark" ? "dark" : "light",
          accent: /^#[0-9a-fA-F]{6}$/.test(parsed.accent || "") ? parsed.accent : "#28a745"
        };
        applyAppearance();
      }
    } catch (error) {
      console.warn("No se pudo leer la apariencia guardada:", error);
    }
  }

  async function loadMobileProfile(user) {
    currentUser = user;
    loadCachedAppearance(user);
    const profileRef = doc(db, "PerfilesMoviles", user.uid);
    const snapshot = await getDoc(profileRef);
    const firebaseCreated = user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date();

    if (!snapshot.exists()) {
      const initialProfile = {
        displayName: user.displayName || user.email?.split("@")[0] || "Usuario NutriFit",
        username: "",
        usernameKey: "",
        photoURL: "",
        bannerURL: "",
        createdAt: Timestamp.fromDate(firebaseCreated),
        appearance,
        updatedAt: serverTimestamp()
      };
      await setDoc(profileRef, initialProfile, { merge: true });
      currentProfile = initialProfile;
    } else {
      currentProfile = snapshot.data();
      if (currentProfile.appearance) {
        appearance = {
          mode: currentProfile.appearance.mode === "dark" ? "dark" : "light",
          accent: /^#[0-9a-fA-F]{6}$/.test(currentProfile.appearance.accent || "") ? currentProfile.appearance.accent : "#28a745"
        };
      }
    }

    applyAppearance();
    renderProfile(currentProfile, user);
    $("#nmEmailCurrentPassword").value = "";
    $("#nmPasswordCurrent").value = "";
    switchScreen("home");
  }

  function setBusy(button, busy, label) {
    if (!button) return;
    if (busy) {
      button.dataset.originalText = button.textContent;
      button.textContent = label || "Procesando...";
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  }

  function validateImage(file, maxBytes, label) {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      throw new Error(`${label}: selecciona una imagen JPG, PNG o WebP.`);
    }
    if (file.size > maxBytes) {
      throw new Error(`${label}: el archivo supera el límite permitido.`);
    }
  }

  function fileExtension(file) {
    if (file.type === "image/png") return "png";
    if (file.type === "image/webp") return "webp";
    return "jpg";
  }

  async function uploadImage(file, kind) {
    if (!file) return null;
    const path = `PerfilesMoviles/${currentUser.uid}/${kind}-${Date.now()}.${fileExtension(file)}`;
    const imageRef = storageRef(storage, path);
    await uploadBytes(imageRef, file, { contentType: file.type });
    return getDownloadURL(imageRef);
  }

  $("#nmPhotoFile").addEventListener("change", (event) => {
    selectedPhoto = event.target.files?.[0] || null;
    if (!selectedPhoto) return;
    try {
      validateImage(selectedPhoto, 5 * 1024 * 1024, "Foto de perfil");
      const preview = URL.createObjectURL(selectedPhoto);
      setAvatar($("#nmAvatarPreview"), preview);
    } catch (error) {
      selectedPhoto = null;
      event.target.value = "";
      setStatus("#nmProfileStatus", error.message, "error");
    }
  });

  $("#nmBannerFile").addEventListener("change", (event) => {
    selectedBanner = event.target.files?.[0] || null;
    if (!selectedBanner) return;
    try {
      validateImage(selectedBanner, 8 * 1024 * 1024, "Banner");
      $("#nmBannerPreview").style.backgroundImage = `url("${URL.createObjectURL(selectedBanner)}")`;
    } catch (error) {
      selectedBanner = null;
      event.target.value = "";
      setStatus("#nmProfileStatus", error.message, "error");
    }
  });

  $("#nmProfileForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) return;
    const button = $("#nmSaveProfile");
    const displayName = $("#nmDisplayName").value.trim();
    const username = escapeUsername($("#nmUsername").value);
    const newKey = usernameKey(username);
    if (displayName.length < 2) {
      setStatus("#nmProfileStatus", "El nombre visible debe tener al menos 2 caracteres.", "error");
      return;
    }
    if (username && !/^[a-zA-Z0-9._]{3,20}$/.test(username)) {
      setStatus("#nmProfileStatus", "El @usuario debe tener de 3 a 20 caracteres: letras, números, puntos o guiones bajos.", "error");
      return;
    }
    try {
      validateImage(selectedPhoto, 5 * 1024 * 1024, "Foto de perfil");
      validateImage(selectedBanner, 8 * 1024 * 1024, "Banner");
    } catch (error) {
      setStatus("#nmProfileStatus", error.message, "error");
      return;
    }

    setBusy(button, true, "Guardando...");
    setStatus("#nmProfileStatus", "Guardando tu perfil...");
    try {
      const profileRef = doc(db, "PerfilesMoviles", currentUser.uid);
      const oldKey = currentProfile?.usernameKey || usernameKey(currentProfile?.username || "");
      const newUsernameRef = newKey ? doc(db, "NombresMoviles", newKey) : null;
      const oldUsernameRef = oldKey ? doc(db, "NombresMoviles", oldKey) : null;

      await runTransaction(db, async (transaction) => {
        const profileSnapshot = await transaction.get(profileRef);
        let newClaimSnapshot = null;
        let oldClaimSnapshot = null;
        if (newUsernameRef) newClaimSnapshot = await transaction.get(newUsernameRef);
        if (oldUsernameRef && oldKey !== newKey) oldClaimSnapshot = await transaction.get(oldUsernameRef);

        if (newClaimSnapshot?.exists() && newClaimSnapshot.data().uid !== currentUser.uid) {
          throw new Error("Ese nombre de usuario ya está ocupado. Prueba con otro.");
        }

        if (oldUsernameRef && oldKey !== newKey && oldClaimSnapshot?.exists() && oldClaimSnapshot.data().uid === currentUser.uid) {
          transaction.delete(oldUsernameRef);
        }
        if (newUsernameRef) {
          transaction.set(newUsernameRef, { uid: currentUser.uid, username }, { merge: false });
        }

        const previous = profileSnapshot.exists() ? profileSnapshot.data() : {};
        transaction.set(profileRef, {
          displayName,
          username,
          usernameKey: newKey,
          photoURL: previous.photoURL || currentProfile?.photoURL || "",
          bannerURL: previous.bannerURL || currentProfile?.bannerURL || "",
          createdAt: previous.createdAt || currentProfile?.createdAt || Timestamp.fromDate(new Date(currentUser.metadata.creationTime)),
          updatedAt: serverTimestamp()
        }, { merge: true });
      });

      let photoURL = currentProfile?.photoURL || "";
      let bannerURL = currentProfile?.bannerURL || "";
      if (selectedPhoto) photoURL = await uploadImage(selectedPhoto, "foto");
      if (selectedBanner) bannerURL = await uploadImage(selectedBanner, "banner");
      await updateDoc(profileRef, { photoURL, bannerURL, updatedAt: serverTimestamp() });

      currentProfile = { ...currentProfile, displayName, username, usernameKey: newKey, photoURL, bannerURL };
      selectedPhoto = null;
      selectedBanner = null;
      $("#nmPhotoFile").value = "";
      $("#nmBannerFile").value = "";
      renderProfile(currentProfile, currentUser);
      setStatus("#nmProfileStatus", "Tu perfil móvil se guardó correctamente.", "ok");
      toast("Tu perfil móvil se actualizó correctamente.");
      switchScreen("home");
    } catch (error) {
      console.error("Error al guardar perfil móvil:", error);
      setStatus("#nmProfileStatus", error.message || "No se pudo guardar el perfil.", "error");
      toast(error.message || "No se pudo guardar el perfil móvil.", true);
    } finally {
      setBusy(button, false);
    }
  });

  async function reauthenticate(password) {
    if (!currentUser || !currentUser.email) throw new Error("No se encontró el correo de la cuenta actual.");
    if (!password) throw new Error("Escribe tu contraseña actual.");
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
  }

  $("#nmEmailForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = $("#nmChangeEmail");
    const password = $("#nmEmailCurrentPassword").value;
    const newEmail = $("#nmNewEmail").value.trim();
    if (!newEmail || !$("#nmNewEmail").checkValidity()) {
      setStatus("#nmEmailStatus", "Escribe un correo válido.", "error");
      return;
    }
    if (newEmail.toLowerCase() === (currentUser?.email || "").toLowerCase()) {
      setStatus("#nmEmailStatus", "Ese ya es tu correo actual.", "error");
      return;
    }
    setBusy(button, true, "Enviando verificación...");
    setStatus("#nmEmailStatus", "Verificando tus credenciales...");
    try {
      await reauthenticate(password);
      await verifyBeforeUpdateEmail(currentUser, newEmail);
      $("#nmEmailCurrentPassword").value = "";
      $("#nmNewEmail").value = "";
      setStatus("#nmEmailStatus", "Te enviamos un enlace al nuevo correo. Confírmalo para completar el cambio.", "ok");
      toast("Revisa tu nuevo correo para confirmar el cambio.");
    } catch (error) {
      console.error("Error al cambiar correo:", error);
      setStatus("#nmEmailStatus", friendlyAuthError(error), "error");
    } finally {
      setBusy(button, false);
    }
  });

  $("#nmPasswordForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = $("#nmChangePassword");
    const currentPassword = $("#nmPasswordCurrent").value;
    const newPassword = $("#nmNewPassword").value;
    const confirmation = $("#nmConfirmPassword").value;
    if (newPassword.length < 6) {
      setStatus("#nmPasswordStatus", "La nueva contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }
    if (newPassword !== confirmation) {
      setStatus("#nmPasswordStatus", "Las nuevas contraseñas no coinciden.", "error");
      return;
    }
    if (newPassword === currentPassword) {
      setStatus("#nmPasswordStatus", "La nueva contraseña debe ser diferente a la actual.", "error");
      return;
    }
    setBusy(button, true, "Actualizando...");
    try {
      await reauthenticate(currentPassword);
      await updatePassword(currentUser, newPassword);
      $("#nmPasswordCurrent").value = "";
      $("#nmNewPassword").value = "";
      $("#nmConfirmPassword").value = "";
      setStatus("#nmPasswordStatus", "Tu contraseña se actualizó correctamente.", "ok");
      toast("Tu contraseña se actualizó correctamente.");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setStatus("#nmPasswordStatus", friendlyAuthError(error), "error");
    } finally {
      setBusy(button, false);
    }
  });

  function friendlyAuthError(error) {
    const code = error?.code || "";
    if (code === "auth/wrong-password" || code === "auth/invalid-credential") return "La contraseña actual no es correcta.";
    if (code === "auth/requires-recent-login") return "Por seguridad, cierra sesión y vuelve a entrar antes de hacer este cambio.";
    if (code === "auth/email-already-in-use") return "Ese correo ya está asociado a otra cuenta.";
    if (code === "auth/invalid-email") return "El correo nuevo no tiene un formato válido.";
    if (code === "auth/weak-password") return "La contraseña debe tener al menos 6 caracteres.";
    if (code === "auth/network-request-failed") return "No hay conexión. Revisa tu internet e inténtalo de nuevo.";
    return error?.message || "No se pudo completar la operación.";
  }

  $("#nmAccentColor").addEventListener("input", (event) => {
    const selected = event.target.value;
    appearance = { ...appearance, accent: selected };
    applyAppearance();
  });
  $("#nmAccentColor").addEventListener("change", () => saveAppearance(appearance));
  $("#nmResetAccent").addEventListener("click", () => {
    $("#nmAccentColor").value = "#28a745";
    saveAppearance({ ...appearance, accent: "#28a745" });
  });

  async function changeAccount(closePanel = false) {
    try {
      await signOut(auth);
      if (closePanel) {
        panel?.classList.remove("active");
        overlay?.classList.remove("active");
      } else {
        switchScreen("home");
      }
      toast("Sesión cerrada correctamente.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast(friendlyAuthError(error), true);
    }
  }

  $("#nmSwitchAccount").addEventListener("click", () => changeAccount(false));
  $("#nmSwitchAccountFromSettings").addEventListener("click", () => changeAccount(false));
  $("#nmSignOut").addEventListener("click", () => changeAccount(true));
  $("#nmSignOutFromSettings").addEventListener("click", () => changeAccount(true));

  onAuthStateChanged(auth, async (user) => {
    if (!user || !user.emailVerified) {
      currentUser = null;
      currentProfile = null;
      appearance = { mode: "light", accent: "#28a745" };
      document.body.dataset.nfMobileTheme = "light";
      delete document.body.dataset.nfMobileCustom;
      document.body.style.setProperty("--nf-mobile-accent", "#28a745");
      return;
    }
    try {
      await loadMobileProfile(user);
    } catch (error) {
      console.error("No se pudo cargar PerfilesMoviles:", error);
      setStatus("#nmProfileStatus", "No se pudo cargar tu perfil. Verifica Firestore y sus reglas de seguridad.", "error");
      toast("No se pudo cargar tu perfil móvil. Revisa la configuración de Firebase.", true);
    }
  });
}
