/* NutriFit: pago simulado, más contenido en Aprende y preguntas frecuentes. Se carga con "defer". */
(function () {
    var $ = function (s) { return document.querySelector(s); };

    /* ---------- Pago simulado (no se envía ni se guarda nada) ---------- */
    var modal, plan = { nombre: "", precio: "" };

    function digitos(v) { return String(v).replace(/\D/g, ""); }
    function luhn(n) {
        var suma = 0, alt = false;
        for (var i = n.length - 1; i >= 0; i--) {
            var d = +n[i];
            if (alt) { d *= 2; if (d > 9) d -= 9; }
            suma += d; alt = !alt;
        }
        return suma % 10 === 0;
    }
    function marca(n) {
        if (/^4/.test(n)) return "Visa";
        if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
        if (/^3[47]/.test(n)) return "American Express";
        return "";
    }

    function crear() {
        modal = document.createElement("div");
        modal.id = "pago-modal";
        modal.hidden = true;
        modal.innerHTML =
            '<div class="fondo"></div>' +
            '<form class="caja" role="dialog" aria-modal="true" aria-labelledby="pago-tit" autocomplete="off" novalidate>' +
              '<div id="pago-form">' +
                '<h3 id="pago-tit">Pagar plan</h3>' +
                '<p class="res"><span id="pago-plan"></span><strong id="pago-precio"></strong></p>' +
                '<p class="sim">Simulación de práctica: no se cobra nada ni se guarda ningún dato. No escribas una tarjeta real.</p>' +
                '<label>Nombre en la tarjeta<input id="pago-nombre" name="nf-nombre" type="text" autocomplete="off" placeholder="Como aparece en la tarjeta"></label>' +
                '<label>Número de tarjeta<span class="marca" id="pago-marca"></span><input id="pago-num" name="nf-num" type="text" inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242" maxlength="23"></label>' +
                '<div class="fila">' +
                  '<label>Vence<input id="pago-exp" name="nf-exp" type="text" inputmode="numeric" autocomplete="off" placeholder="MM/AA" maxlength="5"></label>' +
                  '<label>CVV<input id="pago-cvv" name="nf-cvv" type="text" inputmode="numeric" autocomplete="off" placeholder="123" maxlength="4"></label>' +
                '</div>' +
                '<p id="pago-err" role="alert"></p>' +
                '<button type="submit" class="btn" id="pago-pagar">Pagar</button>' +
                '<button type="button" class="btn" id="pago-cancelar">Cancelar</button>' +
              '</div>' +
              '<div id="pago-ok" hidden>' +
                '<div class="ok" aria-hidden="true">✓</div>' +
                '<h3>¡Pago aprobado!</h3>' +
                '<p id="pago-ok-plan"></p><p id="pago-ultimos"></p><p>Referencia: <strong id="pago-ref"></strong></p>' +
                '<p>Esto fue una simulación: no se realizó ningún cobro.</p>' +
                '<button type="button" class="btn" id="pago-listo" style="margin-top:12px">Listo</button>' +
              '</div>' +
            '</form>';
        document.body.appendChild(modal);

        $("#pago-num").addEventListener("input", function (e) {
            var n = digitos(e.target.value).slice(0, 16);
            e.target.value = n.replace(/(.{4})/g, "$1 ").trim();
            $("#pago-marca").textContent = marca(n);
        });
        $("#pago-exp").addEventListener("input", function (e) {
            var n = digitos(e.target.value).slice(0, 4);
            e.target.value = n.length > 2 ? n.slice(0, 2) + "/" + n.slice(2) : n;
        });
        $("#pago-cvv").addEventListener("input", function (e) { e.target.value = digitos(e.target.value).slice(0, 4); });
        modal.querySelector(".fondo").addEventListener("click", cerrar);
        $("#pago-cancelar").addEventListener("click", cerrar);
        $("#pago-listo").addEventListener("click", cerrar);
        modal.querySelector("form").addEventListener("submit", enviar);
        document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) cerrar(); });
    }

    function enviar(e) {
        e.preventDefault();
        var nombre = $("#pago-nombre").value.trim();
        var num = digitos($("#pago-num").value);
        var m = /^(\d{2})\/(\d{2})$/.exec($("#pago-exp").value);
        var cvv = digitos($("#pago-cvv").value);
        var err = "";
        if (nombre.length < 3) err = "Escribe el nombre como aparece en la tarjeta.";
        else if (num.length < 13 || !luhn(num)) err = "El número de tarjeta no es válido. Para probar usa 4242 4242 4242 4242.";
        else if (!m || +m[1] < 1 || +m[1] > 12 || new Date(2000 + +m[2], +m[1], 1) <= new Date()) err = "Revisa la fecha de vencimiento (MM/AA): no debe estar vencida.";
        else if (!/^\d{3,4}$/.test(cvv)) err = "El CVV debe tener 3 o 4 números.";
        $("#pago-err").textContent = err;
        if (err) return;

        var boton = $("#pago-pagar");
        boton.disabled = true;
        boton.textContent = "Procesando…";
        setTimeout(function () {
            $("#pago-ok-plan").textContent = plan.nombre + " · " + plan.precio;
            $("#pago-ultimos").textContent = "Tarjeta •••• " + num.slice(-4);
            $("#pago-ref").textContent = "SIM-" + Math.random().toString(36).slice(2, 8).toUpperCase();
            modal.querySelector("form").reset();
            $("#pago-marca").textContent = "";
            $("#pago-form").hidden = true;
            $("#pago-ok").hidden = false;
        }, 1600);
    }

    function abrir(card) {
        if (!modal) crear();
        plan.nombre = card.querySelector(".plan-title").textContent.trim();
        plan.precio = card.querySelector(".price").textContent.trim();
        $("#pago-plan").textContent = plan.nombre;
        $("#pago-precio").textContent = plan.precio;
        $("#pago-pagar").textContent = "Pagar " + plan.precio.split("/")[0] + " (simulado)";
        $("#pago-pagar").disabled = false;
        $("#pago-err").textContent = "";
        $("#pago-form").hidden = false;
        $("#pago-ok").hidden = true;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        $("#pago-nombre").focus();
    }

    function cerrar() { modal.hidden = true; document.body.style.overflow = ""; }

    document.querySelectorAll(".plan-card .btn-main").forEach(function (b) {
        b.addEventListener("click", function () { abrir(b.closest(".plan-card")); });
    });

    /* ---------- Mitos y verdades (se agregan al carrusel de Aprende) ---------- */
    var MITOS = [
        ["m", "Comer de noche engorda", "Lo que cuenta es el total de calorías del día, no la hora. Si cenar tarde te hace comer de más, ahí está el problema."],
        ["m", "Los carbohidratos son tus enemigos", "Son tu principal fuente de energía. Elige granos integrales, frutas y legumbres, y cuida las porciones."],
        ["v", "La proteína te mantiene lleno más tiempo", "Ayuda a la saciedad y a conservar músculo. Reparte tu proteína a lo largo del día."],
        ["m", "Sudar más es perder más grasa", "El sudor es agua, no grasa. Se recupera al hidratarte y no mide tu progreso."],
        ["v", "Dormir poco aumenta el hambre", "Dormir mal se relaciona con más apetito y antojos. Dormir bien también es parte del plan."],
        ["m", "Lo «light» siempre es mejor", "Puede tener azúcar añadida o llevarte a comer más. Lee la etiqueta y compara."],
        ["v", "Las grasas buenas sí son necesarias", "El aguacate, las nueces y el aceite de oliva aportan energía y ayudan a absorber las vitaminas A, D, E y K."]
    ];
    var carrusel = $("#aprende .carousel-container");
    if (carrusel) {
        MITOS.forEach(function (x) {
            carrusel.insertAdjacentHTML("beforeend",
                '<div class="card carousel-item square-card mito">' +
                '<span class="mito-tag ' + x[0] + '">' + (x[0] === "m" ? "MITO" : "VERDAD") + '</span>' +
                '<h3>' + x[1] + '</h3><p>' + x[2] + '</p></div>');
        });
    }

    /* ---------- Más preguntas frecuentes ---------- */
    var FAQS = [
        ["¿Cómo creo mi cuenta?", "Toca «Iniciar Sesión», escribe tu correo y una contraseña de al menos 6 caracteres, marca «No soy un robot» y toca «Crear cuenta»."],
        ["¿Por qué debo verificar mi correo?", "Te enviamos un mensaje para comprobar que el correo es tuyo y proteger tu cuenta. Si no lo ves, revisa la carpeta de spam."],
        ["¿Qué hago si olvidé mi contraseña?", "Escribe tu correo, marca el captcha y toca «Cambiar / recuperar contraseña». Te llegará un enlace para crear una nueva."],
        ["¿Qué incluye cada plan?", "El Básico incluye la calculadora de macros y el tracker de agua. El Integral suma menú semanal y soporte por WhatsApp. El Pro añade videollamada quincenal y protocolo de suplementos."],
        ["¿Esto reemplaza a un nutriólogo?", "No. NutriFit ofrece información y herramientas generales. Si tienes una condición médica, consulta a un profesional de la salud."],
        ["¿El pago con tarjeta es real?", "Por ahora es una simulación para practicar: no se cobra nada ni se guarda ningún dato de tu tarjeta."]
    ];
    var faq = $("#faq");
    if (faq) {
        FAQS.forEach(function (x) {
            faq.insertAdjacentHTML("beforeend",
                '<div class="faq-item"><h3 class="faq-question">' + x[0] +
                '<i class="fa-solid fa-chevron-down faq-icon" style="transition: transform 0.3s ease;"></i></h3>' +
                '<div class="faq-answer"><p>' + x[1] + '</p></div></div>');
        });
    }

    /* ---------- Abrir el inicio de sesión desde otras páginas (index.html#login) ---------- */
    window.addEventListener("load", function () {
        var b = document.getElementById("btnAbrirLogin");
        if (location.hash === "#login" && b) b.click();
    });
})();
