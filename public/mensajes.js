/* Mensajes personalizados de NutriFit (reemplazan los alert() del navegador) */
(function () {
    var CSS =
        "#nutri-aviso{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 14px);z-index:3000;" +
        "width:min(420px,calc(100vw - 24px));transform:translate(-50%,-140%);opacity:0;pointer-events:none;" +
        "transition:transform .35s ease,opacity .35s ease;font-family:'Poppins',sans-serif}" +
        "#nutri-aviso.on{transform:translate(-50%,0);opacity:1;pointer-events:auto}" +
        "#nutri-aviso .caja{display:flex;gap:12px;align-items:flex-start;background:#fff;color:#2d3436;" +
        "border-radius:14px;border-left:6px solid var(--c);padding:14px 16px;box-shadow:0 10px 30px rgba(0,0,0,.18);cursor:pointer}" +
        "#nutri-aviso .ico{flex:none;width:28px;height:28px;border-radius:50%;background:var(--c);color:#fff;" +
        "display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.95rem}" +
        "#nutri-aviso .tit{margin:0;font-size:.95rem;font-weight:600;line-height:1.3}" +
        "#nutri-aviso .txt{margin:3px 0 0;font-size:.85rem;color:#555;line-height:1.45}" +
        "@media (prefers-reduced-motion:reduce){#nutri-aviso{transition:none}}";

    var TIPOS = {
        ok:    { color: "#28a745", icono: "✓" },
        error: { color: "#b42318", icono: "!" },
        info:  { color: "#2d3436", icono: "i" }
    };

    var REGLAS = [
        [/auth\/invalid-credential|auth\/wrong-password|auth\/user-not-found/, "error", "No pudimos iniciar tu sesión",
            "Revisa tu correo y tu contraseña. Si aún no tienes cuenta, toca «Crear cuenta»; si la olvidaste, usa «Cambiar / recuperar contraseña»."],
        [/auth\/email-already-in-use/, "info", "Ese correo ya tiene una cuenta",
            "Toca «Iniciar sesión» para entrar, o «Cambiar / recuperar contraseña» si no la recuerdas."],
        [/auth\/weak-password/, "error", "Contraseña muy corta", "Usa al menos 6 caracteres."],
        [/auth\/invalid-email/, "error", "Revisa tu correo", "Escríbelo con el formato nombre@correo.com."],
        [/auth\/too-many-requests/, "error", "Demasiados intentos", "Espera unos minutos e inténtalo de nuevo."],
        [/auth\/network-request-failed/, "error", "Sin conexión", "Revisa tu internet e inténtalo otra vez."],
        [/no est[aá] verificado/i, "info", "Falta verificar tu correo",
            "Busca el mensaje de NutriFit en tu bandeja de entrada (revisa también spam) y confirma tu cuenta."],
        [/Completa la casilla CAPTCHA/i, "info", "Falta la verificación",
            "Marca la casilla «No soy un robot» y vuelve a intentarlo."],
        [/Sesi[oó]n iniciada/i, "ok", "¡Qué bueno verte de nuevo!", function () {
            var campo = document.getElementById("identificador");
            var correo = campo && campo.value ? campo.value.trim() : "";
            return correo ? "Entraste como " + correo + "." : "Tu sesión ya está iniciada.";
        }],
        [/Cuenta creada/i, "ok", "¡Bienvenido a NutriFit!",
            "Te enviamos un correo de verificación. Confírmalo y después inicia sesión."],
        [/Solicitud enviada/i, "ok", "Revisa tu correo",
            "Si existe una cuenta con ese correo, te enviamos el enlace para cambiar tu contraseña. Mira también en spam."],
        [/Sesi[oó]n cerrada/i, "ok", "Sesión cerrada", "Hasta pronto, aquí te esperamos."]
    ];

    var caja, temporizador;

    function preparar() {
        if (caja) return;
        var estilo = document.createElement("style");
        estilo.textContent = CSS;
        document.head.appendChild(estilo);
        caja = document.createElement("div");
        caja.id = "nutri-aviso";
        caja.setAttribute("role", "status");
        caja.setAttribute("aria-live", "polite");
        caja.addEventListener("click", function () { caja.classList.remove("on"); });
        document.body.appendChild(caja);
    }

    window.avisar = function (mensaje) {
        var texto = String(mensaje == null ? "" : mensaje);
        var tipo = "error", titulo = "Algo salió mal", detalle = texto;

        for (var i = 0; i < REGLAS.length; i++) {
            if (REGLAS[i][0].test(texto)) {
                tipo = REGLAS[i][1];
                titulo = REGLAS[i][2];
                detalle = typeof REGLAS[i][3] === "function" ? REGLAS[i][3]() : REGLAS[i][3];
                break;
            }
        }

        // Mismo texto en la línea de estado del panel, para que no quede el mensaje técnico
        var estado = document.getElementById("authStatus");
        if (estado) {
            estado.textContent = detalle;
            estado.style.color = tipo === "ok" ? "#218838" : tipo === "error" ? "#b42318" : "#555";
        }

        preparar();
        caja.style.setProperty("--c", TIPOS[tipo].color);
        caja.textContent = "";

        var contenedor = document.createElement("div");
        contenedor.className = "caja";
        var icono = document.createElement("span");
        icono.className = "ico";
        icono.setAttribute("aria-hidden", "true");
        icono.textContent = TIPOS[tipo].icono;
        var cuerpo = document.createElement("div");
        var t = document.createElement("p");
        t.className = "tit";
        t.textContent = titulo;
        var d = document.createElement("p");
        d.className = "txt";
        d.textContent = detalle;
        cuerpo.appendChild(t);
        cuerpo.appendChild(d);
        contenedor.appendChild(icono);
        contenedor.appendChild(cuerpo);
        caja.appendChild(contenedor);

        caja.classList.add("on");
        clearTimeout(temporizador);
        temporizador = setTimeout(function () { caja.classList.remove("on"); }, 6500);
    };
})();
