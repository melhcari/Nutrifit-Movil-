import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

// --- MENÚ DE HAMBURGUESA Y NAVEGACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const menuLinks = document.querySelectorAll('.menu-item');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });
    }

    // Cerrar menú al presionar cualquier pestaña/enlace
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
        });
    });
});

// --- FUNCIONES DEL PANEL LATERAL ---
window.abrirPanelPersonalizado = () => {
    const sidePanel = document.getElementById('sidePanel');
    const overlay = document.getElementById('overlay');
    const navMenu = document.getElementById('nav-menu');

    if (navMenu) navMenu.classList.remove('active');
    if (sidePanel) sidePanel.classList.add('active');
    if (overlay) overlay.classList.add('active');
};

window.cerrarPanelPersonalizado = () => {
    const sidePanel = document.getElementById('sidePanel');
    const overlay = document.getElementById('overlay');

    if (sidePanel) sidePanel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
};

// --- AUTENTICACIÓN & RECAPTCHA ---
const authForm = document.getElementById('authForm');
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('identificador')?.value.trim();
        const password = document.getElementById('password')?.value;

        if (!email || !password) return;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                alert("⚠️ Por favor confirma tu correo electrónico antes de ingresar.");
                await signOut(auth);
                return;
            }

            alert("¡Bienvenido a Nutrifit!");
            window.cerrarPanelPersonalizado();
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                if (confirm("No encontramos tu cuenta. ¿Deseas registrarte con este correo?")) {
                    try {
                        const newAcc = await createUserWithEmailAndPassword(auth, email, password);
                        await sendEmailVerification(newAcc.user);
                        alert("¡Cuenta creada! Te enviamos un correo de verificación.");
                        await signOut(auth);
                    } catch (regErr) {
                        alert("Error al registrar: " + regErr.message);
                    }
                }
            } else {
                alert("Error: " + error.message);
            }
        }
    });
}
