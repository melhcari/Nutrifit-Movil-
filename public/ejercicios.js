/*
 * NutriFit - módulo de ejercicios
 * Cuestionario, distribución semanal de 4/6 grupos, rutinas guardadas,
 * seguimiento de series, temporizador, sustituciones y celebraciones.
 * Depende de ejercicios-data.js (EJ, CARDIO, GRUPOS, OBJETIVOS, NIVELES, QUE_ES).
 */
(function () {
    "use strict";

    var STORAGE_KEY = "nutrifit_rutina_v1";
    var app = document.getElementById("app");
    var TODOS = (window.EJ || []).concat(window.CARDIO || []);
    var NIV = ["principiante", "intermedio", "avanzado"];
    var rutina = null;
    var diaActual = 0;
    var ejercicioActual = null;
    var cuestionario = { paso: 0, respuestas: {} };
    var temporizador = {
        intervalo: null,
        fin: 0,
        restante: 0,
        corriendo: false
    };

    var PAUTA = {
        masa: {
            principiante: [3, "10", 75],
            intermedio: [4, "10", 90],
            avanzado: [4, "8", 120]
        },
        tonificar: {
            principiante: [2, "12", 60],
            intermedio: [3, "15", 60],
            avanzado: [3, "15", 75]
        }
    };
    var TIEMPO_CARDIO = [20, 30, 40];

    var PASOS = [
        {
            k: "experiencia",
            titulo: "¿Has hecho ejercicio antes?",
            opciones: [
                ["si", "Sí, ya he entrenado", "Tengo algo de experiencia entrenando."],
                ["no", "No, estoy empezando", "Quiero comenzar poco a poco y aprender la técnica."]
            ]
        },
        {
            k: "objetivo",
            titulo: "¿Cuál es tu objetivo?",
            opciones: (window.OBJETIVOS || []).map(function (x) { return [x.id, x.n, x.d]; })
        },
        {
            k: "nivel",
            titulo: "¿Cuál es tu nivel de entrenamiento?",
            opciones: (window.NIVELES || []).map(function (x) { return [x.id, x.n, x.d]; })
        },
        {
            k: "grupos",
            titulo: "¿Qué grupos musculares quieres entrenar?",
            subtitulo: "Selecciona 4 o 6 grupos. Los distribuiremos a lo largo de tu semana.",
            multiple: true,
            opciones: (window.GRUPOS || []).map(function (x) { return [x.id, x.n, ""] ; })
        },
        {
            k: "dias",
            titulo: "¿Cuántos días quieres entrenar?",
            opciones: [[3, "3 días por semana", "Una rutina de tres sesiones."], [4, "4 días por semana", "Cuatro sesiones distribuidas durante la semana."], [5, "5 días por semana", "Cinco sesiones, incluyendo recuperación cuando corresponda."]]
        }
    ];

    function buscarPorId(lista, id) {
        return (lista || []).filter(function (x) { return String(x.id) === String(id); })[0] || null;
    }

    function obtenerEjercicio(id) {
        return TODOS.filter(function (x) { return Number(x.id) === Number(id); })[0] || null;
    }

    function nombreGrupo(id) {
        var g = buscarPorId(window.GRUPOS, id);
        return g ? g.n : (id === "cardio" ? "Cardio" : "Entrenamiento");
    }

    function escaparHtml(valor) {
        return String(valor == null ? "" : valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function mmss(segundos) {
        var s = Math.max(0, Math.ceil(segundos || 0));
        return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    }

    function indiceNivel(perfil) {
        var i = NIV.indexOf(perfil.nivel);
        return i < 0 ? 0 : i;
    }

    function repeticionesPara(ejercicio, perfil) {
        var n = indiceNivel(perfil);
        if (ejercicio.min) return ejercicio.min[n] + " min";
        if (ejercicio.t) return TIEMPO_CARDIO[n] + " s";
        var p = PAUTA[perfil.objetivo] || PAUTA.tonificar;
        return p[perfil.nivel][1];
    }

    function pautaPara(perfil) {
        return (PAUTA[perfil.objetivo] || PAUTA.tonificar)[perfil.nivel] || PAUTA.tonificar.principiante;
    }

    function resumenItem(item) {
        if (!item.d) return item.r;
        return item.s + " series × " + item.r + " · descanso " + mmss(item.d);
    }

    function cargarRutina() {
        try {
            var guardada = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!guardada || !guardada.perfil || !Array.isArray(guardada.dias) || !guardada.dias.length) return null;
            // Las rutinas antiguas de dos grupos deben rehacerse para aplicar la nueva selección de 4/6.
            if (guardada.perfil.objetivo !== "cardio" && (!Array.isArray(guardada.perfil.grupos) || (guardada.perfil.grupos.length !== 4 && guardada.perfil.grupos.length !== 6))) return null;
            guardada.dias.forEach(function (d) {
                (d.items || []).forEach(function (item) {
                    if (!Array.isArray(item.seriesCompletadas)) item.seriesCompletadas = [];
                    if (!item.s) item.s = 1;
                });
                if (!Array.isArray(d.grupos)) d.grupos = [];
            });
            if (!Array.isArray(guardada.diasCelebrados)) guardada.diasCelebrados = [];
            guardada.semanaCelebrada = !!guardada.semanaCelebrada;
            return guardada;
        } catch (e) {
            return null;
        }
    }

    function guardarRutina() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(rutina));
        } catch (e) {
            console.warn("No se pudo guardar la rutina en este dispositivo.", e);
        }
    }

    function listaPasos() {
        return PASOS.filter(function (p) {
            return !(p.k === "grupos" && cuestionario.respuestas.objetivo === "cardio");
        });
    }

    function esMultiple(paso) { return !!paso.multiple; }

    function esSeleccionValida(paso, cantidad) {
        if (paso.k === "grupos") return cantidad === 4 || cantidad === 6;
        return !paso.multiple || cantidad > 0;
    }

    function pintarInicio() {
        var avisoAnterior = rutina === null && (function () {
            try { return !!localStorage.getItem(STORAGE_KEY); } catch (e) { return false; }
        })();
        app.innerHTML =
            '<section class="ej-hero">' +
                '<h1>Tu rutina, a tu medida</h1>' +
                '<p>Cuéntanos tu experiencia, tus objetivos y los grupos musculares que quieres trabajar. NutriFit organizará tus sesiones y guardará tu progreso en este dispositivo.</p>' +
                '<button class="ej-btn blanco" type="button" data-a="empezar"><i class="fa-solid fa-dumbbell"></i>&nbsp; Crear mi rutina</button>' +
                '<button class="ej-btn borde" type="button" data-a="quees">¿Qué es? · Guía para entrenar</button>' +
            '</section>' +
            (avisoAnterior ? '<p class="ej-aviso">Tu rutina guardada pertenece a una versión anterior. Crea una nueva para elegir 4 o 6 grupos musculares.</p>' : '') +
            '<section class="ej-intro-grid">' +
                '<article class="ej-mini-info"><span class="ej-mini-icon"><i class="fa-solid fa-calendar-week"></i></span><b>Tu semana organizada</b><small>Elige 3, 4 o 5 días de entrenamiento.</small></article>' +
                '<article class="ej-mini-info"><span class="ej-mini-icon"><i class="fa-solid fa-chart-line"></i></span><b>Tu progreso guardado</b><small>Marca tus series y continúa cuando vuelvas.</small></article>' +
            '</section>' +
            '<p class="ej-aviso">' + escaparHtml(window.AVISO || "Entrena con una técnica cómoda y detente si sientes dolor.") + '</p>';
    }

    function pintarPaso() {
        var pasos = listaPasos();
        if (cuestionario.paso >= pasos.length) cuestionario.paso = pasos.length - 1;
        var paso = pasos[cuestionario.paso];
        var respuestas = cuestionario.respuestas;
        if (paso.k === "nivel" && respuestas.experiencia === "no" && !respuestas.nivel) respuestas.nivel = "principiante";

        var seleccionados = esMultiple(paso) ? (respuestas[paso.k] || []) : [String(respuestas[paso.k] == null ? "" : respuestas[paso.k])];
        var valido = esMultiple(paso) ? esSeleccionValida(paso, seleccionados.length) : !!respuestas[paso.k];
        var porcentaje = Math.round(((cuestionario.paso + 1) / pasos.length) * 100);
        var html =
            '<div class="ej-prog"><i style="width:' + porcentaje + '%"></i></div>' +
            '<p class="ej-paso">Paso ' + (cuestionario.paso + 1) + ' de ' + pasos.length + '</p>' +
            '<h1>' + escaparHtml(paso.titulo) + '</h1>';

        if (paso.subtitulo) html += '<p class="ej-sub">' + escaparHtml(paso.subtitulo) + '</p>';
        if (paso.k === "nivel" && respuestas.experiencia === "no") {
            html += '<div class="ej-hint"><i class="fa-solid fa-seedling"></i><span>Como estás empezando, te recomendamos el nivel principiante. Puedes elegir otro nivel si ya tienes experiencia guiada.</span></div>';
        }
        if (paso.k === "grupos") {
            html += '<div class="ej-seleccion-resumen"><b>' + seleccionados.length + ' seleccionados</b><span>Elige 4 o 6 grupos</span></div>';
        }

        html += '<div class="' + (esMultiple(paso) ? 'ej-grid' : 'ej-opciones') + '">';
        html += paso.opciones ? paso.opciones.map(function (op) { return renderOpcion(op, seleccionados, paso); }).join("") : paso.opciones;
        html += (paso.opciones ? '</div>' : '');

        if (paso.k === "grupos" && seleccionados.length !== 4 && seleccionados.length !== 6) {
            var texto = seleccionados.length < 4
                ? 'Selecciona ' + (4 - seleccionados.length) + ' grupo(s) más para llegar a 4.'
                : 'Tienes 5 grupos. Agrega uno más para llegar a 6 o desmarca uno para quedarte con 4.';
            html += '<p class="ej-sub ej-seleccion-ayuda">' + texto + '</p>';
        }

        html +=
            '<div class="ej-nav">' +
                '<button class="ej-btn sec" type="button" data-a="atras">Atrás</button>' +
                '<button class="ej-btn" type="button" data-a="siguiente"' + (valido ? '' : ' disabled') + '>' + (cuestionario.paso === pasos.length - 1 ? 'Generar mi rutina' : 'Continuar') + '</button>' +
            '</div>';
        app.innerHTML = html;
        window.scrollTo(0, 0);
    }

    function renderOpcion(op, seleccionados, paso) {
        var valor = String(op[0]);
        var marcada = seleccionados.indexOf(valor) !== -1;
        var bloqueada = paso.k === "grupos" && !marcada && seleccionados.length >= 6;
        return '<button type="button" class="ej-op' + (marcada ? ' on' : '') + '" data-a="opcion" data-v="' + escaparHtml(valor) + '"' + (bloqueada ? ' disabled aria-disabled="true"' : '') + '>' +
            '<b>' + escaparHtml(op[1]) + '</b>' + (op[2] ? '<span>' + escaparHtml(op[2]) + '</span>' : '') +
            (marcada ? '<i class="fa-solid fa-circle-check ej-op-check" aria-hidden="true"></i>' : '') +
            '</button>';
    }

    // Reparte todos los grupos una sola vez. Los días sin grupo, si los hay, quedan para recuperación activa.
    function distribuirGrupos(grupos, dias) {
        var reparto = [];
        var i;
        for (i = 0; i < dias; i++) reparto.push([]);
        grupos.forEach(function (grupo, indice) {
            reparto[indice % dias].push(grupo);
        });
        return reparto;
    }

    function crearItemsDeGrupo(grupo, perfil, gruposEnDia) {
        var lista = (window.EJ || []).filter(function (x) { return x.g === grupo; });
        var nivel = indiceNivel(perfil);
        var pauta = pautaPara(perfil);
        var cantidad = gruposEnDia > 1 ? (nivel === 0 ? 2 : 3) : (nivel === 0 ? 3 : 4);
        return lista.slice(0, cantidad).map(function (e) {
            return {
                id: e.id,
                s: pauta[0],
                r: repeticionesPara(e, perfil),
                d: pauta[2],
                seriesCompletadas: []
            };
        });
    }

    function crearRutina() {
        var p = cuestionario.respuestas;
        var dias = [];
        var i;
        if (!p.objetivo || !p.nivel || !p.dias) {
            alert("Completa las preguntas antes de generar tu rutina.");
            return;
        }
        if (p.objetivo !== "cardio" && (!Array.isArray(p.grupos) || (p.grupos.length !== 4 && p.grupos.length !== 6))) {
            alert("Selecciona exactamente 4 o 6 grupos musculares.");
            var indice = listaPasos().map(function (x) { return x.k; }).indexOf("grupos");
            cuestionario.paso = Math.max(0, indice);
            pintarPaso();
            return;
        }

        var reparto = p.objetivo === "cardio" ? [] : distribuirGrupos(p.grupos, Number(p.dias));
        for (i = 0; i < Number(p.dias); i++) {
            if (p.objetivo === "cardio") {
                var cardio = (window.CARDIO || [])[i % window.CARDIO.length];
                dias.push({
                    titulo: cardio.n,
                    grupos: ["cardio"],
                    items: [{ id: cardio.id, s: 1, r: repeticionesPara(cardio, p), d: 0, seriesCompletadas: [] }]
                });
            } else if (!reparto[i].length) {
                var caminata = (window.CARDIO || [])[0];
                dias.push({
                    titulo: "Recuperación activa",
                    recuperacion: true,
                    nota: "Este día se reserva para caminar a un ritmo cómodo, hacer movilidad suave y recuperarte. No es necesario entrenar con intensidad.",
                    grupos: [],
                    items: [{ id: caminata.id, s: 1, r: "20 min suaves", d: 0, seriesCompletadas: [] }]
                });
            } else {
                var gruposDia = reparto[i];
                var items = [];
                gruposDia.forEach(function (grupo) {
                    items = items.concat(crearItemsDeGrupo(grupo, p, gruposDia.length));
                });
                dias.push({
                    titulo: gruposDia.map(nombreGrupo).join(" + "),
                    grupos: gruposDia.slice(),
                    items: items
                });
            }
        }

        rutina = {
            version: 2,
            perfil: {
                experiencia: p.experiencia,
                objetivo: p.objetivo,
                nivel: p.nivel,
                grupos: (p.grupos || []).slice(),
                dias: Number(p.dias)
            },
            dias: dias,
            diasCelebrados: [],
            semanaCelebrada: false,
            creada: new Date().toISOString()
        };
        diaActual = 0;
        guardarRutina();
        pintarRutina();
    }

    function totalSeries(item) { return Math.max(1, Number(item.s) || 1); }
    function seriesHechas(item) { return Array.isArray(item.seriesCompletadas) ? item.seriesCompletadas.length : 0; }
    function itemCompleto(item) { return seriesHechas(item) >= totalSeries(item); }
    function diaCompleto(dia) { return dia.items.length > 0 && dia.items.every(itemCompleto); }

    function pintarRutina() {
        if (!rutina || !rutina.dias || !rutina.dias[diaActual]) {
            pintarInicio();
            return;
        }
        var p = rutina.perfil;
        var d = rutina.dias[diaActual];
        var diasTerminados = rutina.dias.filter(diaCompleto).length;
        var progresoSemana = Math.round((diasTerminados / rutina.dias.length) * 100);
        var gruposTxt = p.objetivo === "cardio" ? "Cardio" : p.grupos.map(nombreGrupo).join(", ");
        var h =
            '<section class="ej-rutina-head">' +
                '<p class="ej-paso">TU PLAN PERSONALIZADO</p>' +
                '<h1>Tu rutina de entrenamiento</h1>' +
                '<p class="ej-sub">' + escaparHtml(p.objetivo === "cardio" ? "Cardio" : buscarPorId(window.OBJETIVOS, p.objetivo).n) + ' · ' + escaparHtml(buscarPorId(window.NIVELES, p.nivel).n) + ' · ' + p.dias + ' días por semana</p>' +
                '<div class="ej-resumen-chips"><span><i class="fa-solid fa-bullseye"></i> ' + escaparHtml(gruposTxt) + '</span><span><i class="fa-solid fa-calendar-check"></i> ' + diasTerminados + '/' + rutina.dias.length + ' días completados</span></div>' +
                '<div class="ej-week-progress"><div><b>Progreso semanal</b><strong>' + progresoSemana + '%</strong></div><span><i style="width:' + progresoSemana + '%"></i></span></div>' +
            '</section>';

        h += '<div class="ej-tabs" aria-label="Días de entrenamiento">' + rutina.dias.map(function (x, i) {
            return '<button type="button" class="ej-tab' + (i === diaActual ? ' on' : '') + (diaCompleto(x) ? ' done' : '') + '" data-a="dia" data-i="' + i + '">Día ' + (i + 1) + (diaCompleto(x) ? ' ✓' : '') + '</button>';
        }).join("") + '</div>';

        var hechos = d.items.filter(itemCompleto).length;
        h += '<section class="ej-dia-head"><div><p class="ej-paso">SESIÓN ' + (diaActual + 1) + '</p><h2 class="ej-dia">' + escaparHtml(d.titulo) + '</h2></div><span class="ej-dia-count">' + hechos + '/' + d.items.length + ' ejercicios</span></section>';
        if (d.recuperacion) h += '<p class="ej-aviso">' + escaparHtml(d.nota) + '</p>';
        else if (d.grupos && d.grupos.length > 1) h += '<p class="ej-sub">Hoy trabajarás ' + escaparHtml(d.grupos.map(nombreGrupo).join(" y ")) + '. Haz cada movimiento con control y respeta los descansos.</p>';

        h += '<div class="ej-lista">' + d.items.map(function (item, i) {
            var e = obtenerEjercicio(item.id);
            if (!e) return "";
            var completas = seriesHechas(item);
            var porcentaje = Math.round((completas / totalSeries(item)) * 100);
            return '<button type="button" class="ej-card' + (itemCompleto(item) ? ' completed' : '') + '" data-a="ver" data-i="' + i + '">' +
                '<b>' + escaparHtml(e.n) + '</b>' +
                '<span>' + escaparHtml(resumenItem(item)) + '</span>' +
                '<small>' + escaparHtml(e.e) + ' · ' + completas + '/' + totalSeries(item) + ' series completadas</small>' +
                '<i class="ej-card-progress"><i style="width:' + porcentaje + '%"></i></i>' +
                '</button>';
        }).join("") + '</div>';

        h += '<div class="ej-nav"><button class="ej-btn sec" type="button" data-a="quees"><i class="fa-solid fa-circle-info"></i>&nbsp; Guía para entrenar</button><button class="ej-btn sec" type="button" data-a="rehacer">Cambiar mi rutina</button></div>';
        h += '<p class="ej-aviso">' + escaparHtml(window.AVISO || "Detente si sientes dolor agudo y consulta a un profesional ante dudas de salud.") + '</p>';
        app.innerHTML = h;
    }

    function pintarQueEs() {
        var html = '<p class="ej-paso">APRENDE A ENTRENAR</p><h1>Lo básico para entrenar mejor</h1><p class="ej-sub">Conoce los conceptos antes de comenzar tu rutina.</p>';
        html += '<h2 class="ej-dia">Objetivos de entrenamiento</h2>';
        html += (window.OBJETIVOS || []).map(function (o) {
            return '<details class="ej-acc"><summary>' + escaparHtml(o.n) + '</summary><p>' + escaparHtml(o.d) + '</p></details>';
        }).join("");
        html += '<h2 class="ej-dia">Conceptos básicos</h2>';
        html += (window.QUE_ES || []).map(function (q) {
            return '<details class="ej-acc"><summary>' + escaparHtml(q[0]) + '</summary><p>' + escaparHtml(q[1]) + '</p></details>';
        }).join("");
        html += '<div class="ej-nav"><button class="ej-btn" type="button" data-a="volver">Volver</button></div>';
        html += '<p class="ej-aviso">' + escaparHtml(window.AVISO || "Si tienes dudas de salud, consulta a un profesional.") + '</p>';
        app.innerHTML = html;
        window.scrollTo(0, 0);
    }

    // Modal inferior para explicación, seguimiento de series y sustituciones.
    var hoja = document.createElement("div");
    hoja.id = "hoja";
    hoja.hidden = true;
    hoja.innerHTML = '<div class="ej-fondo" data-h="cerrar"></div><div class="ej-panel" role="dialog" aria-modal="true" aria-label="Detalle del ejercicio"></div>';
    document.body.appendChild(hoja);

    function ejercicioIcono(grupo) {
        var iconos = {
            pecho: "fa-dumbbell", espalda: "fa-person-walking", hombro: "fa-weight-hanging",
            biceps: "fa-dumbbell", triceps: "fa-dumbbell", cuadriceps: "fa-person-running",
            femoral: "fa-person-running", gluteo: "fa-person-running", abdomen: "fa-person"
        };
        return iconos[grupo] || "fa-dumbbell";
    }

    function imagenEjercicio(e) {
        if (e && e.img) {
            return '<img class="ej-exercise-image" src="' + escaparHtml(e.img) + '" alt="Demostración de ' + escaparHtml(e.n) + '" loading="lazy">';
        }
        return '<div class="ej-visual-placeholder"><i class="fa-solid ' + ejercicioIcono(e.g) + '"></i><span>Guía de movimiento</span><small>Lee la técnica paso a paso antes de comenzar.</small></div>';
    }

    function abrirHoja(html) {
        detenerTemporizador(false);
        hoja.querySelector(".ej-panel").innerHTML = html;
        hoja.hidden = false;
        document.body.style.overflow = "hidden";
    }

    function cerrarHoja() {
        detenerTemporizador(false);
        hoja.hidden = true;
        document.body.style.overflow = "";
    }

    function pintarTemporizador(item) {
        var restante = temporizador.corriendo ? Math.max(0, Math.ceil((temporizador.fin - Date.now()) / 1000)) : temporizador.restante;
        var duracion = Number(item.d) || 0;
        return '<section class="ej-timer" id="ejTimer" data-duracion="' + duracion + '">' +
            '<div class="ej-timer-title"><i class="fa-regular fa-clock"></i><div><b>Descanso entre series</b><small>Tiempo recomendado: ' + mmss(duracion) + '</small></div></div>' +
            '<strong class="ej-timer-time" id="ejTimerTime">' + mmss(restante || duracion) + '</strong>' +
            '<div class="ej-timer-actions"><button type="button" class="ej-btn" data-h="timer-start">' + (temporizador.corriendo ? 'Pausar descanso' : 'Iniciar descanso') + '</button><button type="button" class="ej-btn sec" data-h="timer-reset">Reiniciar</button></div>' +
            '<p class="ej-timer-status" id="ejTimerStatus">' + (temporizador.corriendo ? 'El descanso está en marcha.' : 'Inicia el reloj cuando termines una serie.') + '</p>' +
        '</section>';
    }

    function pintarDetalle() {
        if (!rutina || ejercicioActual === null) return;
        var item = rutina.dias[diaActual].items[ejercicioActual.indice];
        var e = obtenerEjercicio(item.id);
        if (!e) return;
        var hechas = item.seriesCompletadas || [];
        var html = '<p class="ej-paso">DETALLE DEL EJERCICIO</p><h2>' + escaparHtml(e.n) + '</h2>' +
            '<span class="ej-tag">' + escaparHtml(nombreGrupo(e.g)) + ' · ' + escaparHtml(e.e) + '</span>' +
            imagenEjercicio(e) +
            '<p class="ej-panel-desc">' + escaparHtml(e.d) + '</p>' +
            '<div class="ej-dato">' + escaparHtml(resumenItem(item)) + '</div>' +
            '<h3 class="ej-serie-heading">Marca cada serie al terminarla</h3>' +
            '<div class="ej-series-list">';
        for (var i = 0; i < totalSeries(item); i++) {
            var marcada = hechas.indexOf(i) !== -1;
            html += '<label class="ej-serie' + (marcada ? ' done' : '') + '"><input type="checkbox" data-h="serie" data-i="' + i + '"' + (marcada ? ' checked' : '') + '><span class="ej-serie-check"><i class="fa-solid fa-check"></i></span><span class="ej-serie-text"><b>Serie ' + (i + 1) + '</b><small>' + escaparHtml(item.r) + ' repeticiones</small></span><span class="ej-serie-state">' + (marcada ? 'Completada' : 'Pendiente') + '</span></label>';
        }
        html += '</div>';
        if (item.d > 0 && !itemCompleto(item)) html += pintarTemporizador(item);
        else if (item.d > 0) html += '<p class="ej-timer-done">¡Ejercicio completado! Puedes continuar con el siguiente.</p>';
        html += '<button type="button" class="ej-btn sec" data-h="cambiar">Cambiar ejercicio</button>';
        html += '<button type="button" class="ej-btn sec" data-h="cerrar">Cerrar</button>';
        hoja.querySelector(".ej-panel").innerHTML = html;
    }

    function abrirDetalle(indice) {
        detenerTemporizador(false);
        temporizador.restante = 0;
        ejercicioActual = { indice: indice };
        pintarDetalle();
        hoja.hidden = false;
        document.body.style.overflow = "hidden";
    }

    function sonarAlTerminar() {
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            var ctx = new AudioCtx();
            var oscilador = ctx.createOscillator();
            var ganancia = ctx.createGain();
            oscilador.type = "sine";
            oscilador.frequency.value = 880;
            ganancia.gain.setValueAtTime(0.0001, ctx.currentTime);
            ganancia.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
            ganancia.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
            oscilador.connect(ganancia);
            ganancia.connect(ctx.destination);
            oscilador.start();
            oscilador.stop(ctx.currentTime + 0.46);
            oscilador.onended = function () { ctx.close(); };
        } catch (e) {
            console.warn("El sonido no está disponible en este navegador.", e);
        }
        if (navigator.vibrate) navigator.vibrate([180, 90, 180]);
    }

    function actualizarReloj() {
        var display = document.getElementById("ejTimerTime");
        var status = document.getElementById("ejTimerStatus");
        if (!display) return;
        var restante = Math.max(0, Math.ceil((temporizador.fin - Date.now()) / 1000));
        temporizador.restante = restante;
        display.textContent = mmss(restante);
        if (restante <= 0) {
            detenerTemporizador(false);
            if (status) status.textContent = "¡Descanso terminado! Puedes continuar con tu siguiente serie.";
            var boton = hoja.querySelector('[data-h="timer-start"]');
            if (boton) boton.textContent = "Iniciar de nuevo";
            sonarAlTerminar();
        }
    }

    function iniciarTemporizador() {
        if (!ejercicioActual) return;
        var item = rutina.dias[diaActual].items[ejercicioActual.indice];
        var duracion = Math.max(0, Number(item.d) || 0);
        if (!duracion) return;
        if (temporizador.intervalo) clearInterval(temporizador.intervalo);
        var inicio = temporizador.restante > 0 && temporizador.restante < duracion ? temporizador.restante : duracion;
        temporizador.fin = Date.now() + inicio * 1000;
        temporizador.restante = inicio;
        temporizador.corriendo = true;
        var status = document.getElementById("ejTimerStatus");
        if (status) status.textContent = "Descansa y prepárate para la siguiente serie.";
        var boton = hoja.querySelector('[data-h="timer-start"]');
        if (boton) boton.textContent = "Temporizador activo";
        temporizador.intervalo = setInterval(actualizarReloj, 250);
        actualizarReloj();
    }

    function pausarTemporizador() {
        if (!temporizador.corriendo) return;
        temporizador.restante = Math.max(0, Math.ceil((temporizador.fin - Date.now()) / 1000));
        detenerTemporizador(false);
        var status = document.getElementById("ejTimerStatus");
        if (status) status.textContent = "Descanso pausado.";
        var boton = hoja.querySelector('[data-h="timer-start"]');
        if (boton) boton.textContent = "Continuar descanso";
        var display = document.getElementById("ejTimerTime");
        if (display) display.textContent = mmss(temporizador.restante);
    }

    function detenerTemporizador(reiniciar) {
        if (temporizador.intervalo) clearInterval(temporizador.intervalo);
        temporizador.intervalo = null;
        temporizador.corriendo = false;
        if (reiniciar) temporizador.restante = 0;
    }

    function reiniciarTemporizador() {
        detenerTemporizador(true);
        var status = document.getElementById("ejTimerStatus");
        var display = document.getElementById("ejTimerTime");
        var item = ejercicioActual ? rutina.dias[diaActual].items[ejercicioActual.indice] : null;
        if (display && item) display.textContent = mmss(item.d);
        if (status) status.textContent = "Temporizador reiniciado.";
        var boton = hoja.querySelector('[data-h="timer-start"]');
        if (boton) boton.textContent = "Iniciar descanso";
    }

    function cambiarEjercicio() {
        if (!ejercicioActual) return;
        var actual = rutina.dias[diaActual].items[ejercicioActual.indice];
        var ejercicio = obtenerEjercicio(actual.id);
        var usados = rutina.dias[diaActual].items.map(function (x) { return Number(x.id); });
        var alternativas = TODOS.filter(function (x) {
            return x.g === ejercicio.g && Number(x.id) !== Number(ejercicio.id) && usados.indexOf(Number(x.id)) === -1;
        });
        var html = '<p class="ej-paso">ALTERNATIVAS</p><h2>Elige otro ejercicio</h2><p class="ej-panel-desc">Puedes cambiarlo por otro movimiento del mismo grupo muscular. Revisa el equipo disponible y la explicación antes de elegir.</p>';
        if (alternativas.length) {
            html += alternativas.map(function (x) {
                return '<button type="button" class="ej-op ej-alternativa" data-h="elegir" data-id="' + x.id + '"><b>' + escaparHtml(x.n) + '</b><span>' + escaparHtml(x.e) + '</span><small>' + escaparHtml(x.d) + '</small></button>';
            }).join("");
        } else {
            html += '<p class="ej-sub">No hay más alternativas de este grupo en el catálogo actual.</p>';
        }
        html += '<button type="button" class="ej-btn sec" data-h="volver-detalle">Volver al ejercicio</button>';
        hoja.querySelector(".ej-panel").innerHTML = html;
    }

    function elegirAlternativa(id) {
        var item = rutina.dias[diaActual].items[ejercicioActual.indice];
        var nuevo = obtenerEjercicio(id);
        if (!nuevo) return;
        item.id = nuevo.id;
        item.r = repeticionesPara(nuevo, rutina.perfil);
        item.seriesCompletadas = [];
        guardarRutina();
        pintarDetalle();
    }

    function comprobarDiaCompletado() {
        var dia = rutina.dias[diaActual];
        if (!diaCompleto(dia)) return;
        if (rutina.diasCelebrados.indexOf(diaActual) !== -1) return;
        rutina.diasCelebrados.push(diaActual);
        detenerTemporizador(false);
        var todaSemana = rutina.dias.every(diaCompleto);
        if (todaSemana) rutina.semanaCelebrada = true;
        guardarRutina();
        cerrarHoja();
        mostrarCelebracion(todaSemana);
    }

    function mostrarCelebracion(semanaCompleta) {
        var overlay = document.getElementById("ejCelebracion");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "ejCelebracion";
            overlay.className = "ej-celebracion";
            overlay.innerHTML = '<div class="ej-confeti" aria-hidden="true"></div><section class="ej-celebracion-card" role="dialog" aria-modal="true"><div class="ej-celebracion-icon">' + (semanaCompleta ? '🏆' : '🎉') + '</div><p class="ej-paso">NUTRIFIT CELEBRA CONTIGO</p><h2 id="ejCelebracionTitulo"></h2><p id="ejCelebracionTexto"></p><button type="button" class="ej-btn" data-celebrar="cerrar">¡Gracias!</button></section>';
            document.body.appendChild(overlay);
        }
        document.getElementById("ejCelebracionTitulo").textContent = semanaCompleta ? "¡Semana completada!" : "¡Felicidades, lo has logrado!";
        document.getElementById("ejCelebracionTexto").textContent = semanaCompleta ? "Completaste todos los días de tu rutina. La próxima semana vamos por más, siempre respetando tu recuperación." : "Terminaste la rutina de este día. Reconoce tu esfuerzo, hidrátate y date tiempo para recuperarte.";
        overlay.classList.add("show");
        crearConfeti(overlay.querySelector(".ej-confeti"));
    }

    function crearConfeti(contenedor) {
        if (!contenedor) return;
        contenedor.innerHTML = "";
        var colores = ["#23864a", "#91c99c", "#f3c969", "#ffffff", "#b6dfbf"];
        for (var i = 0; i < 48; i++) {
            var pieza = document.createElement("span");
            pieza.className = "ej-confeti-piece";
            pieza.style.left = Math.random() * 100 + "%";
            pieza.style.background = colores[i % colores.length];
            pieza.style.animationDelay = (Math.random() * 1.4) + "s";
            pieza.style.animationDuration = (2.5 + Math.random() * 2) + "s";
            pieza.style.transform = "rotate(" + Math.round(Math.random() * 360) + "deg)";
            contenedor.appendChild(pieza);
        }
    }

    // Eventos del panel de detalle.
    hoja.addEventListener("click", function (event) {
        var boton = event.target.closest("[data-h]");
        if (!boton) return;
        var accion = boton.getAttribute("data-h");
        if (accion === "cerrar") cerrarHoja();
        else if (accion === "cambiar") cambiarEjercicio();
        else if (accion === "elegir") elegirAlternativa(Number(boton.getAttribute("data-id")));
        else if (accion === "volver-detalle") pintarDetalle();
        else if (accion === "timer-start") {
            if (temporizador.corriendo) pausarTemporizador(); else iniciarTemporizador();
        }
        else if (accion === "timer-reset") reiniciarTemporizador();
    });

    hoja.addEventListener("change", function (event) {
        var input = event.target;
        if (!input || input.getAttribute("data-h") !== "serie" || !ejercicioActual) return;
        var item = rutina.dias[diaActual].items[ejercicioActual.indice];
        var numero = Number(input.getAttribute("data-i"));
        var lista = item.seriesCompletadas || [];
        var estaba = lista.indexOf(numero) !== -1;
        if (input.checked && !estaba) lista.push(numero);
        if (!input.checked && estaba) lista.splice(lista.indexOf(numero), 1);
        lista.sort(function (a, b) { return a - b; });
        item.seriesCompletadas = lista;
        guardarRutina();
        var faltan = !itemCompleto(item);
        pintarDetalle();
        if (faltan && input.checked && item.d > 0) iniciarTemporizador();
        if (itemCompleto(item)) comprobarDiaCompletado();
    });

    document.addEventListener("click", function (event) {
        var boton = event.target.closest("[data-celebrar]");
        if (!boton) return;
        var overlay = document.getElementById("ejCelebracion");
        if (overlay) overlay.classList.remove("show");
        pintarRutina();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !hoja.hidden) cerrarHoja();
        var overlay = document.getElementById("ejCelebracion");
        if (event.key === "Escape" && overlay && overlay.classList.contains("show")) {
            overlay.classList.remove("show");
            pintarRutina();
        }
    });

    app.addEventListener("click", function (event) {
        var boton = event.target.closest("[data-a]");
        if (!boton) return;
        var accion = boton.getAttribute("data-a");
        var respuestas = cuestionario.respuestas;

        if (accion === "empezar") {
            cuestionario = { paso: 0, respuestas: {} };
            pintarPaso();
        } else if (accion === "quees") {
            pintarQueEs();
        } else if (accion === "volver") {
            rutina ? pintarRutina() : pintarInicio();
        } else if (accion === "opcion") {
            var paso = listaPasos()[cuestionario.paso];
            var valor = boton.getAttribute("data-v");
            if (esMultiple(paso)) {
                var seleccion = respuestas[paso.k] || [];
                var posicion = seleccion.indexOf(valor);
                if (posicion >= 0) seleccion.splice(posicion, 1);
                else if (seleccion.length < 6) seleccion.push(valor);
                respuestas[paso.k] = seleccion;
            } else {
                respuestas[paso.k] = paso.k === "dias" ? Number(valor) : valor;
                if (paso.k === "experiencia" && valor === "no") respuestas.nivel = "principiante";
            }
            pintarPaso();
        } else if (accion === "atras") {
            if (cuestionario.paso === 0) rutina ? pintarRutina() : pintarInicio();
            else {
                cuestionario.paso--;
                pintarPaso();
            }
        } else if (accion === "siguiente") {
            var pasos = listaPasos();
            var actual = pasos[cuestionario.paso];
            if (actual.k === "grupos" && !(respuestas.grupos && (respuestas.grupos.length === 4 || respuestas.grupos.length === 6))) {
                alert("Debes elegir exactamente 4 o 6 grupos musculares.");
                return;
            }
            if (cuestionario.paso < pasos.length - 1) {
                cuestionario.paso++;
                pintarPaso();
            } else crearRutina();
        } else if (accion === "dia") {
            diaActual = Number(boton.getAttribute("data-i"));
            pintarRutina();
        } else if (accion === "ver") {
            abrirDetalle(Number(boton.getAttribute("data-i")));
        } else if (accion === "rehacer") {
            if (confirm("Vas a crear una nueva rutina. Tu rutina actual se reemplazará cuando termines el cuestionario. ¿Continuar?")) {
                cuestionario = { paso: 0, respuestas: {} };
                pintarPaso();
            }
        }
    });

    // Actualiza el temporizador al volver de otra app/pestaña; el tiempo se calcula con reloj real.
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden && temporizador.corriendo) actualizarReloj();
    });

    rutina = cargarRutina();
    if (rutina) {
        diaActual = 0;
        pintarRutina();
    } else {
        pintarInicio();
    }
})();
