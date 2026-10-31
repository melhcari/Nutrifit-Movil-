/* NutriFit: cuestionario, generador de rutina, guardado y cambio de ejercicios */
(function () {
    var KEY = "nutrifit_rutina_v1";
    var app = document.getElementById("app");
    var TODOS = EJ.concat(CARDIO);
    var NIV = ["principiante", "intermedio", "avanzado"];
    // [series, repeticiones, descanso en segundos]
    var PAUTA = {
        masa: { principiante: [3, "10", 60], intermedio: [4, "10", 90], avanzado: [4, "8", 120] },
        tonificar: { principiante: [3, "12", 45], intermedio: [3, "15", 45], avanzado: [4, "15", 45] }
    };
    var TIEMPO = [20, 30, 45];
    var PASOS = [
        { k: "exp", t: "¿Has hecho ejercicio antes?", op: [["si", "Sí", "Ya he entrenado antes."], ["no", "No", "Voy a empezar desde cero."]] },
        { k: "objetivo", t: "¿Cuál es tu objetivo?", op: OBJETIVOS.map(function (o) { return [o.id, o.n, o.d]; }) },
        { k: "nivel", t: "¿Cuál es tu nivel?", op: NIVELES.map(function (o) { return [o.id, o.n, o.d]; }) },
        { k: "grupos", t: "¿Qué quieres entrenar?", sub: "Elige exactamente 2.", multi: 2, op: GRUPOS.map(function (g) { return [g.id, g.n, ""]; }) },
        { k: "dias", t: "¿Cuántos días a la semana quieres entrenar?", op: [[3, "3 días", ""], [4, "4 días", ""], [5, "5 días", ""]] }
    ];
    var est = { paso: 0, p: {} }, rutina = null, dia = 0, sel = null;

    function ej(id) { return TODOS.filter(function (x) { return x.id === id; })[0]; }
    function by(lista, id) { return lista.filter(function (x) { return x.id === id; })[0]; }
    function nomGrupo(id) { return by(GRUPOS, id).n; }
    function mmss(s) { return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
    function repsPara(e, p) {
        var n = NIV.indexOf(p.nivel);
        return e.min ? e.min[n] + " min" : e.t ? TIEMPO[n] + " s" : PAUTA[p.objetivo][p.nivel][1];
    }
    function resumen(it) { return it.d ? it.s + " × " + it.r + " · descanso " + mmss(it.d) : it.r; }
    function cargar() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
    function guardar() { try { localStorage.setItem(KEY, JSON.stringify(rutina)); } catch (e) {} }
    function pasos() { return PASOS.filter(function (s) { return !(s.k === "grupos" && est.p.objetivo === "cardio"); }); }

    function vInicio() {
        app.innerHTML = '<section class="ej-hero"><h1>Tu rutina, a tu medida</h1><p>Responde unas preguntas y creamos una rutina para ti. Se guarda en este dispositivo y no cambia hasta que tú decidas cambiarla.</p>' +
            '<button class="ej-btn blanco" data-a="empezar">Empezar</button><button class="ej-btn borde" data-a="quees">¿Qué es?</button></section><p class="ej-aviso">' + AVISO + '</p>';
    }

    function vPaso() {
        var L = pasos(), s = L[est.paso], p = est.p;
        if (s.k === "nivel" && !p.nivel && p.exp === "no") p.nivel = "principiante";
        var marcados = s.multi ? (p[s.k] || []) : [String(p[s.k] || "")];
        var ok = s.multi ? marcados.length === s.multi : !!p[s.k];
        var h = '<div class="ej-prog"><i style="width:' + Math.round((est.paso + 1) / L.length * 100) + '%"></i></div><p class="ej-paso">Paso ' + (est.paso + 1) + ' de ' + L.length + '</p><h1>' + s.t + '</h1>';
        if (s.sub) h += '<p class="ej-sub">' + s.sub + '</p>';
        if (s.k === "nivel" && p.exp === "no") h += '<p class="ej-sub">Como apenas empiezas, te recomendamos comenzar como principiante.</p>';
        h += '<div class="' + (s.multi ? "ej-grid" : "") + '">' + s.op.map(function (o) {
            return '<button type="button" class="ej-op' + (marcados.indexOf(String(o[0])) > -1 ? " on" : "") + '" data-a="op" data-v="' + o[0] + '"><b>' + o[1] + '</b>' + (o[2] ? "<span>" + o[2] + "</span>" : "") + "</button>";
        }).join("") + "</div>";
        h += '<div class="ej-nav"><button class="ej-btn sec" data-a="atras">Atrás</button><button class="ej-btn" data-a="sig"' + (ok ? "" : " disabled") + ">" + (est.paso === L.length - 1 ? "Crear mi rutina" : "Siguiente") + "</button></div>";
        app.innerHTML = h;
        window.scrollTo(0, 0);
    }

    function crear() {
        var p = est.p, d = [], i, n = NIV.indexOf(p.nivel);
        for (i = 0; i < p.dias; i++) {
            if (p.objetivo === "cardio") {
                var c = CARDIO[i % CARDIO.length];
                d.push({ t: c.n, items: [{ id: c.id, s: 1, r: repsPara(c, p), d: 0 }] });
            } else {
                var g = p.grupos[i % 2];
                var l = EJ.filter(function (x) { return x.g === g; });
                var o = Math.floor(i / 2) % l.length;
                var rot = l.slice(o).concat(l.slice(0, o));
                var pa = PAUTA[p.objetivo][p.nivel];
                d.push({ t: nomGrupo(g), items: rot.slice(0, Math.min(n === 0 ? 3 : 4, rot.length)).map(function (x) { return { id: x.id, s: pa[0], r: repsPara(x, p), d: pa[2] }; }) });
            }
        }
        rutina = { perfil: p, dias: d };
        dia = 0;
        guardar();
        vRutina();
    }

    function vRutina() {
        var p = rutina.perfil, d = rutina.dias[dia];
        var h = '<h1>Tu rutina</h1><p class="ej-sub">' + by(OBJETIVOS, p.objetivo).n + " · " + by(NIVELES, p.nivel).n + " · " + p.dias + " días por semana" +
            (p.objetivo !== "cardio" ? " · " + p.grupos.map(nomGrupo).join(" y ") : "") + "</p>";
        h += '<div class="ej-tabs">' + rutina.dias.map(function (x, i) { return '<button class="ej-tab' + (i === dia ? " on" : "") + '" data-a="dia" data-i="' + i + '">Día ' + (i + 1) + "</button>"; }).join("") + "</div>";
        h += '<h2 class="ej-dia">Día ' + (dia + 1) + " · " + d.t + '</h2><div class="ej-lista">' + d.items.map(function (it, i) {
            var e = ej(it.id);
            return '<button class="ej-card" data-a="ver" data-i="' + i + '"><b>' + e.n + "</b><span>" + resumen(it) + "</span><small>" + e.e + " · Toca para ver cómo se hace</small></button>";
        }).join("") + "</div>";
        h += '<div class="ej-nav"><button class="ej-btn sec" data-a="rehacer">Cambiar mi rutina</button><button class="ej-btn sec" data-a="quees">¿Qué es?</button></div><p class="ej-aviso">' + AVISO + "</p>";
        app.innerHTML = h;
    }

    function vQueEs() {
        var acc = function (t, d) { return '<details class="ej-acc"><summary>' + t + "</summary><p>" + d + "</p></details>"; };
        app.innerHTML = '<h1>¿Qué es?</h1><p class="ej-sub">Lo básico para entrenar mejor y con seguridad.</p><h2 class="ej-dia">Objetivos</h2>' +
            OBJETIVOS.map(function (o) { return acc(o.n, o.d); }).join("") + '<h2 class="ej-dia">Conceptos básicos</h2>' +
            QUE_ES.map(function (q) { return acc(q[0], q[1]); }).join("") +
            '<div class="ej-nav"><button class="ej-btn" data-a="volver">Volver</button></div><p class="ej-aviso">' + AVISO + "</p>";
        window.scrollTo(0, 0);
    }

    /* Hoja inferior con la explicación del ejercicio y el cambio de ejercicio */
    var hoja = document.createElement("div");
    hoja.id = "hoja";
    hoja.hidden = true;
    hoja.innerHTML = '<div class="ej-fondo" data-h="x"></div><div class="ej-panel" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(hoja);
    function abrirHoja(html) { hoja.querySelector(".ej-panel").innerHTML = html; hoja.hidden = false; document.body.style.overflow = "hidden"; }
    function cerrar() { hoja.hidden = true; document.body.style.overflow = ""; }

    function abrir(i) {
        sel = i;
        var it = rutina.dias[dia].items[i], e = ej(it.id);
        abrirHoja('<h2>' + e.n + '</h2><p class="ej-tag">' + e.e + "</p><p>" + e.d + '</p><p class="ej-dato">' + resumen(it) + "</p>" +
            '<button class="ej-btn" data-h="cambiar">Cambiar ejercicio</button><button class="ej-btn sec" data-h="x">Cerrar</button>');
    }
    function cambiar() {
        var items = rutina.dias[dia].items, cur = ej(items[sel].id);
        var usados = items.map(function (x) { return x.id; });
        var alts = TODOS.filter(function (x) { return x.g === cur.g && usados.indexOf(x.id) < 0; });
        abrirHoja('<h2>¿Qué ejercicio prefieres?</h2><p>Elige el que mejor se adapte al equipo que tienes disponible.</p>' +
            (alts.length ? alts.map(function (x) { return '<button class="ej-op" data-h="elegir" data-id="' + x.id + '"><b>' + x.n + "</b><span>" + x.e + "</span></button>"; }).join("") : "<p>No hay más variaciones disponibles para este día.</p>") +
            '<button class="ej-btn sec" data-h="x">Cancelar</button>');
    }
    function elegir(id) {
        var it = rutina.dias[dia].items[sel];
        it.id = id;
        it.r = repsPara(ej(id), rutina.perfil);
        guardar();
        cerrar();
        vRutina();
    }

    hoja.addEventListener("click", function (e) {
        var b = e.target.closest("[data-h]");
        if (!b) return;
        var h = b.dataset.h;
        if (h === "x") cerrar(); else if (h === "cambiar") cambiar(); else if (h === "elegir") elegir(+b.dataset.id);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !hoja.hidden) cerrar(); });

    app.addEventListener("click", function (e) {
        var b = e.target.closest("[data-a]");
        if (!b) return;
        var a = b.dataset.a, p = est.p;
        if (a === "empezar") { est = { paso: 0, p: {} }; vPaso(); }
        else if (a === "quees") vQueEs();
        else if (a === "volver") { rutina ? vRutina() : vInicio(); }
        else if (a === "op") {
            var s = pasos()[est.paso], v = b.dataset.v;
            if (s.multi) {
                var l = p[s.k] || [], i = l.indexOf(v);
                if (i > -1) l.splice(i, 1); else if (l.length < s.multi) l.push(v);
                p[s.k] = l;
            } else p[s.k] = s.k === "dias" ? +v : v;
            vPaso();
        }
        else if (a === "atras") { if (est.paso === 0) { rutina ? vRutina() : vInicio(); } else { est.paso--; vPaso(); } }
        else if (a === "sig") { if (est.paso < pasos().length - 1) { est.paso++; vPaso(); } else crear(); }
        else if (a === "dia") { dia = +b.dataset.i; vRutina(); }
        else if (a === "ver") abrir(+b.dataset.i);
        else if (a === "rehacer") { if (confirm("Vas a crear una nueva rutina. Reemplazará la actual cuando termines. ¿Continuar?")) { est = { paso: 0, p: {} }; vPaso(); } }
    });

    rutina = cargar();
    if (rutina && rutina.perfil && rutina.dias && rutina.dias.length) vRutina(); else { rutina = null; vInicio(); }
})();
