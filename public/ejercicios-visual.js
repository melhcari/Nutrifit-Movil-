/*
 * NutriFit - apoyo visual para la sección de ejercicios
 * Añade imágenes, instrucciones paso a paso, consejos y la tarjeta de GPS.
 * No reemplaza ejercicios.js ni modifica la rutina o el progreso guardado.
 * Fuente de ilustraciones/instrucciones: RepDB (requiere atribución visible).
 */
(function () {
    "use strict";

    var app = document.getElementById("app");
    if (!app) return;

    var DATA_URL = "https://exercise-dataset.com/exercises.json";
    var DATA_HOME = "https://exercise-dataset.com/";
    var dataSet = [];
    var observer = null;
    var observerPanel = null;

    /* Nombres alternativos para encontrar la demostración correcta. */
    var ALIASES = {
        "press de banca con barra": ["barbell bench press", "press de banca con barra"],
        "press de pecho con mancuernas": ["dumbbell bench press", "press de banca con mancuernas"],
        "press de pecho en maquina": ["machine chest press", "press de pecho en maquina"],
        "flexiones de pecho": ["push up", "push-ups", "flexiones"],
        "jalon al pecho": ["wide grip lat pulldown", "lat pulldown", "jalon al pecho"],
        "remo con mancuerna": ["one arm dumbbell row", "remo con mancuerna a un brazo"],
        "remo en maquina": ["seated row machine", "seated cable row", "remo sentado en polea"],
        "remo con banda elastica": ["resistance band row", "band row", "remo con banda"],
        "press de hombro con mancuernas": ["dumbbell shoulder press", "press de hombros con mancuernas"],
        "elevaciones laterales": ["dumbbell lateral raise", "elevacion lateral con mancuernas"],
        "press de hombro en maquina": ["machine shoulder press", "shoulder press machine"],
        "face pull con polea": ["face pull", "face pull en polea"],
        "curl con barra": ["barbell curl", "curl de biceps con barra"],
        "curl con mancuernas": ["dumbbell curl", "seated dumbbell curl", "curl con mancuernas"],
        "curl martillo": ["hammer curl", "curl martillo"],
        "curl en polea baja": ["standing biceps cable curl", "cable biceps curl", "curl de biceps en polea"],
        "extension de triceps en polea": ["triceps pushdown", "cable triceps pushdown", "extension de triceps en polea"],
        "fondos en banco": ["bench dips", "fondos en banco"],
        "press frances con mancuerna": ["dumbbell triceps extension", "lying dumbbell triceps extension", "extension de triceps con mancuerna"],
        "patada de triceps": ["triceps kickback", "dumbbell triceps kickback", "patada de triceps"],
        "sentadilla con barra": ["barbell back squat", "barbell squat", "sentadilla con barra"],
        "prensa de piernas": ["leg press", "prensa de piernas"],
        "sentadilla goblet": ["goblet squat", "dumbbell goblet squat", "sentadilla goblet"],
        "zancadas": ["dumbbell lunge", "reverse lunge", "walking lunge", "zancada"],
        "curl femoral en maquina": ["seated leg curl", "lying leg curl", "leg curl machine"],
        "peso muerto rumano con mancuernas": ["dumbbell romanian deadlift", "romanian deadlift"],
        "hiperextensiones": ["back extension", "hyperextension", "hiperextension"],
        "curl femoral con banda": ["banded leg curl", "standing band leg curl", "band leg curl"],
        "puente de gluteo": ["glute bridge", "puente de gluteo"],
        "hip thrust con barra": ["barbell hip thrust", "hip thrust"],
        "patada de gluteo en polea": ["cable glute kickback", "cable kickback", "glute kickback"],
        "sentadilla bulgara": ["bulgarian split squat", "split squat"],
        "plancha": ["forearm plank", "plank"],
        "crunch abdominal": ["crunch", "abdominal crunch"],
        "elevacion de piernas": ["lying leg raise", "lying leg raises", "leg raise"],
        "crunch en polea": ["cable crunch", "kneeling cable crunch"],
        "caminata rapida": ["brisk walking", "walking", "treadmill walking"],
        "trote suave": ["jogging", "running", "treadmill running"],
        "bicicleta": ["stationary bike", "cycling", "exercise bike"],
        "saltar la cuerda": ["jump rope", "skipping"],
        "intervalos hiit basico": ["high intensity interval training", "hiit", "interval training"]
    };

    function normalizar(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, " ")
            .trim()
            .replace(/\s+/g, " ");
    }

    function textoSeguro(texto) {
        return String(texto == null ? "" : texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function obtenerUrlImagen(ruta) {
        if (!ruta) return "";
        if (/^https?:\/\//i.test(ruta)) return ruta;
        return new URL(ruta, DATA_HOME).toString();
    }

    function obtenerCandidatos(local) {
        var key = normalizar(local.n);
        var frases = ALIASES[key] || [local.n];
        var i;
        var j;

        /* Primero busca coincidencias exactas por nombre en español o inglés. */
        for (i = 0; i < frases.length; i++) {
            var frase = normalizar(frases[i]);
            for (j = 0; j < dataSet.length; j++) {
                var registro = dataSet[j];
                if (normalizar(registro.name_es) === frase || normalizar(registro.name_en) === frase) {
                    return registro;
                }
            }
        }

        /* Después permite coincidencias parciales, manteniendo la categoría. */
        for (i = 0; i < frases.length; i++) {
            var parcial = normalizar(frases[i]);
            for (j = 0; j < dataSet.length; j++) {
                var item = dataSet[j];
                var es = normalizar(item.name_es);
                var en = normalizar(item.name_en);
                if ((es.indexOf(parcial) !== -1 || en.indexOf(parcial) !== -1) &&
                    (local.g === "cardio" ? item.category === "cardio" : item.category !== "cardio")) {
                    return item;
                }
            }
        }

        /* Último recurso: elige el nombre más parecido por palabras compartidas. */
        var palabras = normalizar(local.n).split(" ").filter(function (p) { return p.length > 3; });
        var mejor = null;
        var mejorPuntaje = 0;
        dataSet.forEach(function (item) {
            if (local.g === "cardio" && item.category !== "cardio") return;
            if (local.g !== "cardio" && item.category === "cardio") return;
            var nombre = normalizar(item.name_es + " " + item.name_en);
            var puntos = 0;
            palabras.forEach(function (palabra) {
                if (nombre.indexOf(palabra) !== -1) puntos += palabra.length > 5 ? 2 : 1;
            });
            if (puntos > mejorPuntaje) {
                mejorPuntaje = puntos;
                mejor = item;
            }
        });
        return mejorPuntaje >= 2 ? mejor : null;
    }

    function enriquecerEjercicios() {
        var todos = (window.EJ || []).concat(window.CARDIO || []);
        todos.forEach(function (local) {
            var registro = obtenerCandidatos(local);
            if (!registro) return;

            var flat = registro.images && registro.images.flat ? registro.images.flat : {};
            var imagenes = [];
            if (flat.start) imagenes.push(obtenerUrlImagen(flat.start));
            if (flat.peak) imagenes.push(obtenerUrlImagen(flat.peak));
            if (flat.main) imagenes.push(obtenerUrlImagen(flat.main));
            if (!imagenes.length) return;

            local.img = imagenes[0];
            local.imgs = imagenes;
            local.pasosVisuales = Array.isArray(registro.instructions_es) ? registro.instructions_es : [];
            local.consejosVisuales = Array.isArray(registro.tips_es) ? registro.tips_es : [];
            local.descripcionVisual = registro.description_es || "";
            local.fuenteVisual = registro.name_es || registro.name_en || "";
        });
    }

    function buscarEjercicioLocal(nombre) {
        var todos = (window.EJ || []).concat(window.CARDIO || []);
        var clave = normalizar(nombre);
        for (var i = 0; i < todos.length; i++) {
            if (normalizar(todos[i].n) === clave) return todos[i];
        }
        return null;
    }

    function agregarTarjetaAireLibre() {
        var grid = app.querySelector(".ej-intro-grid");
        if (!grid || grid.querySelector("[data-ej-outdoor-card]")) return;

        var card = document.createElement("article");
        card.className = "ej-mini-info ej-mini-info-outdoor";
        card.setAttribute("data-ej-outdoor-card", "true");
        card.innerHTML =
            '<span class="ej-mini-icon ej-mini-icon-outdoor"><i class="fa-solid fa-person-walking" aria-hidden="true"></i></span>' +
            '<b>Actividad al aire libre</b>' +
            '<small>Registra caminatas y carreras con el GPS de tu celular.</small>';
        grid.appendChild(card);
    }

    function agregarMiniaturas() {
        app.querySelectorAll(".ej-card").forEach(function (card) {
            if (card.querySelector(".ej-card-thumb")) return;
            var titulo = card.querySelector("b");
            if (!titulo) return;
            var ejercicio = buscarEjercicioLocal(titulo.textContent);
            if (!ejercicio || !ejercicio.img) return;

            var img = document.createElement("img");
            img.className = "ej-card-thumb";
            img.src = ejercicio.img;
            img.alt = "Ilustración de " + ejercicio.n;
            img.loading = "lazy";
            img.decoding = "async";
            img.onerror = function () {
                if (img.parentNode) img.parentNode.removeChild(img);
                card.classList.remove("ej-card-with-image");
            };
            card.insertBefore(img, card.firstChild);
            card.classList.add("ej-card-with-image");
        });
    }

    function crearGaleria(panel, ejercicio) {
        if (!ejercicio || !ejercicio.imgs || !ejercicio.imgs.length) return;
        if (panel.querySelector(".ej-visual-gallery")) return;

        var anterior = panel.querySelector(".ej-visual-placeholder, .ej-exercise-image");
        if (!anterior) return;

        var galeria = document.createElement("div");
        galeria.className = "ej-visual-gallery";
        galeria.setAttribute("aria-label", "Ilustraciones del movimiento");

        ejercicio.imgs.slice(0, 2).forEach(function (url, indice) {
            var figura = document.createElement("figure");
            figura.className = "ej-visual-figure";
            var img = document.createElement("img");
            img.src = url;
            img.alt = ejercicio.n + (indice === 0 ? ", posición inicial" : ", posición final");
            img.loading = "lazy";
            img.decoding = "async";
            img.onerror = function () {
                if (figura.parentNode) figura.parentNode.removeChild(figura);
                if (!galeria.children.length && galeria.parentNode) galeria.parentNode.removeChild(galeria);
            };
            var caption = document.createElement("figcaption");
            caption.textContent = ejercicio.imgs.length > 1
                ? (indice === 0 ? "Posición inicial" : "Movimiento")
                : "Demostración del ejercicio";
            figura.appendChild(img);
            figura.appendChild(caption);
            galeria.appendChild(figura);
        });

        anterior.parentNode.replaceChild(galeria, anterior);
    }

    function crearInstrucciones(panel, ejercicio) {
        if (!ejercicio || !ejercicio.pasosVisuales || !ejercicio.pasosVisuales.length) return;
        if (panel.querySelector(".ej-visual-technique")) return;

        var seccion = document.createElement("section");
        seccion.className = "ej-visual-technique";

        var titulo = document.createElement("h3");
        titulo.innerHTML = '<i class="fa-solid fa-list-ol" aria-hidden="true"></i> Cómo realizarlo';
        seccion.appendChild(titulo);

        var lista = document.createElement("ol");
        ejercicio.pasosVisuales.forEach(function (paso) {
            var li = document.createElement("li");
            li.textContent = paso;
            lista.appendChild(li);
        });
        seccion.appendChild(lista);

        if (ejercicio.consejosVisuales && ejercicio.consejosVisuales.length) {
            var consejos = document.createElement("div");
            consejos.className = "ej-visual-tips";
            var subtitulo = document.createElement("b");
            subtitulo.innerHTML = '<i class="fa-solid fa-lightbulb" aria-hidden="true"></i> Consejos de técnica';
            consejos.appendChild(subtitulo);
            var ul = document.createElement("ul");
            ejercicio.consejosVisuales.forEach(function (consejo) {
                var li = document.createElement("li");
                li.textContent = consejo;
                ul.appendChild(li);
            });
            consejos.appendChild(ul);
            seccion.appendChild(consejos);
        }

        var descripcion = panel.querySelector(".ej-panel-desc");
        if (descripcion && descripcion.parentNode) {
            descripcion.insertAdjacentElement("afterend", seccion);
        } else {
            panel.appendChild(seccion);
        }
    }

    function decorarPanel() {
        var panel = document.querySelector("#hoja .ej-panel");
        if (!panel || !panel.querySelector("h2")) return;
        var titulo = panel.querySelector("h2").textContent;
        var ejercicio = buscarEjercicioLocal(titulo);
        if (!ejercicio) return;
        crearGaleria(panel, ejercicio);
        crearInstrucciones(panel, ejercicio);
    }

    function agregarCredito() {
        if (app.querySelector(".ej-repdb-credit")) return;
        var credit = document.createElement("p");
        credit.className = "ej-repdb-credit";
        credit.innerHTML = 'Ilustraciones e instrucciones de ejercicios por <a href="https://repdb.co" target="_blank" rel="noopener noreferrer nofollow">RepDB</a>.';
        app.appendChild(credit);
    }

    function decorarApp() {
        agregarTarjetaAireLibre();
        agregarMiniaturas();
        agregarCredito();
        decorarPanel();
    }

    function iniciarObservadores() {
        if (window.MutationObserver) {
            observer = new MutationObserver(function () { decorarApp(); });
            observer.observe(app, { childList: true, subtree: true });

            var hoja = document.getElementById("hoja");
            if (hoja) {
                observerPanel = new MutationObserver(function () { decorarPanel(); });
                observerPanel.observe(hoja, { childList: true, subtree: true });
            }
        }
        decorarApp();
    }

    function cargarDatosVisuales() {
        if (!window.fetch) return;
        fetch(DATA_URL, { cache: "force-cache" })
            .then(function (respuesta) {
                if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo visual.");
                return respuesta.json();
            })
            .then(function (datos) {
                dataSet = Array.isArray(datos.exercises) ? datos.exercises : [];
                enriquecerEjercicios();
                decorarApp();
            })
            .catch(function (error) {
                console.warn("NutriFit: no se pudieron cargar las ilustraciones externas. Se conservarán las descripciones actuales.", error);
            });
    }

    iniciarObservadores();
    cargarDatosVisuales();
})();
