// Importaciones de Firebase v12.10.0
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-storage.js";
// Si no tienes estos archivos locales, comenta estas 3 líneas:
// import { configurarAgua } from './js/habitos.js';
// import { configurarRutina } from './js/rutina.js';
// import { registrarUsuario, loguearUsuario, recuperarPassword } from './autenticacion/auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyAoowzmCUuoyNQcrbEU60TknICVaA22StA",
    authDomain: "tarea-588d2.firebaseapp.com",
    projectId: "tarea-588d2",
    storageBucket: "tarea-588d2.firebasestorage.app",
    messagingSenderId: "1097872716155",
    appId: "1:1097872716155:web:b71f4a189ba2f1a993cdde",
    measurementId: "G-09ZTK2VCLG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

AOS.init({ duration: 1000, once: true });

function sanitizarEntrada(texto) {
    if (!texto) return "";
    const mapa = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', "/": '&#x2F;' };
    const reg = /[&<>"'/]/ig;
    return texto.replace(reg, (match) => (mapa[match]));
}

// CONTROL DE UI Y MENÚS
const sidePanel = document.getElementById('sidePanel');
const overlay = document.getElementById('overlay');
const profileBtn = document.getElementById('profileBtn');
const closePanel = document.getElementById('closePanel');
const menuToggleBtn = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
window.usuarioLogueado = false;

if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
}

window.togglePanel = () => {
    if(sidePanel) sidePanel.classList.toggle('active');
    if(overlay) overlay.classList.toggle('active');
};
if (closePanel) closePanel.onclick = window.togglePanel;
if (overlay) overlay.onclick = window.togglePanel;

if (profileBtn) {
    profileBtn.onclick = (e) => {
        e.stopPropagation();
        if (window.usuarioLogueado) {
            document.getElementById('profileDropdown').classList.toggle('active');
        } else {
            window.togglePanel();
        }
    };
}

onAuthStateChanged(auth, async (user) => {
    const authCont = document.getElementById('authContainer');
    const userProf = document.getElementById('userProfile');

    if (user && user.emailVerified) {
        window.usuarioLogueado = true;
        if (authCont) authCont.style.display = 'none';
        if (userProf) userProf.style.display = 'block';

        try {
            const docSnap = await getDoc(doc(db, "Usuarios", user.uid));
            if (docSnap.exists()) {
                const data = docSnap.data();
                const perfilNombre = document.getElementById('perfilNombre');
                if (perfilNombre) perfilNombre.innerHTML = sanitizarEntrada(data.nombre || 'Usuario');
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    } else {
        window.usuarioLogueado = false;
        if (authCont) authCont.style.display = 'block';
        if (userProf) userProf.style.display = 'none';
    }
});

// ANIMACIÓN PREGUNTAS FRECUENTES (FAQ) CORREGIDA
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const icon = button.querySelector('i');

            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                if (icon) icon.style.transform = "rotate(0deg)";
            } else {
                document.querySelectorAll('.faq-answer').forEach(ans => ans.style.maxHeight = null);
                document.querySelectorAll('.faq-question i').forEach(ic => ic.style.transform = "rotate(0deg)");

                answer.style.maxHeight = answer.scrollHeight + "px";
                if (icon) {
                    icon.style.transform = "rotate(180deg)";
                    icon.style.transition = "transform 0.3s ease";
                }
            }
        });
    });
}); // <- Este es el cierre correcto que faltaba.