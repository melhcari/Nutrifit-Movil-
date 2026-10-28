/* Ilustración de cada plato, dibujada a partir de sus ingredientes. window.dibujarPlato(receta) devuelve un SVG. */
(function () {
    function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    function rng(a) {
        return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    }

    // [palabras clave, figura, color, color 2]; el orden da prioridad (primero las proteínas)
    var M = [
        ["pollo|pechuga|pavo", "blob", "#e2b673", "#c98f45"],
        ["\\bres\\b|bistec|albondiga|carne", "blob", "#8b4a3b", "#6d3326"],
        ["salmon", "blob", "#f28c62", "#f8b79a"],
        ["pescado|tilapia|atun|ceviche", "blob", "#e8d8bb", "#c9b58f"],
        ["camaron", "sticks", "#f4a18a", "#e07b62"],
        ["huevo|omelette|claras|frittata|shakshuka", "ring", "#fffaf0", "#f6b73c"],
        ["tofu|queso|panela|feta|mozzarella|requeson|parmesano", "blob", "#f5ecd0", "#e6d7a8"],
        ["aguacate", "ring", "#8ab45a", "#7a5a32"],
        ["jitomate|tomate|salsa", "ring", "#e04b36", "#f28b7a"],
        ["espinaca|lechuga|ensalada|verdura|romana|cilantro|perejil|\\bcol\\b|nopal", "leaves", "#3f9d4a", "#7cc576"],
        ["brocoli|esparrago|chicharo", "dots", "#2f8f3e", ""],
        ["calabac|pepino|chayote", "ring", "#cfe3a6", "#6aa84f"],
        ["champi|seta", "ring", "#dcc7a6", "#b99b6f"],
        ["lenteja", "dots", "#a8641f", ""],
        ["frijol", "dots", "#4a2f2f", ""],
        ["garbanzo|hummus", "dots", "#e1bf6a", ""],
        ["arroz|quinoa|avena|polenta|granola|maiz pozolero", "dots", "#efe0b5", ""],
        ["platano", "ring", "#f6e3a1", "#d9b44a"],
        ["frutos rojos|fresa|arandano|frambuesa", "dots", "#b0293f", ""],
        ["limon|naranja", "ring", "#f6d84c", "#fff3a8"],
        ["zanahoria", "sticks", "#f08c2e", "#d9741b"],
        ["papa|camote", "blob", "#e8c36a", "#cfa13d"],
        ["pimiento|morron|chile", "sticks", "#d9402e", "#b83322"],
        ["berenjena", "blob", "#5b3a7a", "#3f2757"],
        ["coliflor", "dots", "#f1ead8", ""],
        ["tortilla|tostada|pasta|lasana", "ring", "#e6c58a", "#d1a85e"],
        ["yogur|batido|smoothie|leche", "ring", "#f3d1dc", "#ffffff"],
        ["aceituna", "dots", "#2e2a1f", ""]
    ];

    var F = {
        blob: function (c, c2, s, r) {
            return '<g transform="rotate(' + (r() * 50 - 25).toFixed(0) + ') scale(' + s + ')"><ellipse rx="46" ry="30" fill="' + c + '"/><ellipse rx="33" ry="18" cx="-4" cy="-3" fill="' + c2 + '" opacity=".5"/><path d="M-22 -4q8 8 0 16M-4 -10q8 10 0 22M14 -8q8 10 0 20" stroke="' + c2 + '" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/></g>';
        },
        ring: function (c, c2, s) {
            var o = "", p = [[0, 0], [24, 10], [-10, 26]], i;
            for (i = 0; i < 3; i++) o += '<g transform="translate(' + p[i][0] * s + ' ' + p[i][1] * s + ')"><circle r="' + 20 * s + '" fill="' + c + '"/><circle r="' + 11 * s + '" fill="' + c2 + '"/></g>';
            return o;
        },
        dots: function (c, c2, s, r) {
            var o = "", i, a, d;
            for (i = 0; i < 16; i++) { a = r() * 6.283; d = Math.sqrt(r()) * 32 * s; o += '<circle cx="' + (Math.cos(a) * d).toFixed(1) + '" cy="' + (Math.sin(a) * d).toFixed(1) + '" r="' + (4 + r() * 3).toFixed(1) + '" fill="' + c + '"/>'; }
            return o;
        },
        leaves: function (c, c2, s, r) {
            var o = "", i;
            for (i = 0; i < 6; i++) o += '<ellipse cx="' + 22 * s + '" rx="' + 22 * s + '" ry="' + 9 * s + '" transform="rotate(' + (i * 60 + r() * 30).toFixed(0) + ')" fill="' + (i % 2 ? c : c2) + '"/>';
            return o;
        },
        sticks: function (c, c2, s, r) {
            var o = "", i;
            for (i = 0; i < 5; i++) o += '<rect x="-4" y="' + -30 * s + '" width="9" height="' + 52 * s + '" rx="4.5" fill="' + (i % 2 ? c : c2) + '" transform="rotate(' + (-50 + i * 25 + r() * 8).toFixed(0) + ')"/>';
            return o;
        }
    };

    var SLOTS = [[178, 148, 1.15], [248, 112, .85], [246, 190, .85], [146, 200, .75]];

    window.dibujarPlato = function (rc) {
        var rnd = rng(rc.id * 7919 + 13), tit = norm(rc.titulo), txt = tit + " " + norm(rc.ingredientes.join(" ")), el = [], i, x, y;
        for (i = 0; i < M.length && el.length < 4; i++) if (new RegExp(M[i][0]).test(txt)) el.push(M[i]);
        if (!el.length) el.push(M[9]);
        var h = (rc.id * 47) % 360;
        var hondo = /sopa|caldo|pozole|gazpacho|bowl|curry|avena|yogur|ceviche|ensalada|tabule|shakshuka/.test(tit);
        var liq = /gazpacho|tlalpeno/.test(tit) ? "#e0553a" : /sopa|caldo|pozole|curry/.test(tit) ? "#ebbd5e" : "";
        var o = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustración de ' + rc.titulo + '">' +
            '<defs><linearGradient id="g' + rc.id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(' + h + ',45%,88%)"/><stop offset="1" stop-color="hsl(' + ((h + 25) % 360) + ',45%,78%)"/></linearGradient></defs>' +
            '<rect width="400" height="300" fill="url(#g' + rc.id + ')"/>' +
            '<ellipse cx="206" cy="268" rx="120" ry="14" fill="#000" opacity=".14"/>' +
            '<circle cx="200" cy="150" r="118" fill="' + (hondo ? "#d9d2c3" : "#fff") + '"/><circle cx="200" cy="150" r="98" fill="' + (hondo ? "#fbf8f1" : "#f6f3ec") + '"/>';
        if (liq) o += '<circle cx="200" cy="150" r="88" fill="' + liq + '"/>';
        el.forEach(function (m, k) {
            var p = SLOTS[k];
            o += '<g transform="translate(' + p[0] + ' ' + p[1] + ')">' + F[m[1]](m[2], m[3], p[2] * (hondo ? .8 : 1), rnd) + '</g>';
        });
        for (i = 0; i < 7; i++) {
            x = 150 + rnd() * 100; y = 100 + rnd() * 100;
            o += '<ellipse cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="5" ry="2.5" fill="#3f9d4a" opacity=".85" transform="rotate(' + (rnd() * 180).toFixed(0) + ' ' + x.toFixed(0) + ' ' + y.toFixed(0) + ')"/>';
        }
        return o + '</svg>';
    };
})();
