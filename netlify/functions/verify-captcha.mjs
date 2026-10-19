export default async (request) => {
    const responder = (datos, estado = 200) =>
        new Response(JSON.stringify(datos), {
            status: estado,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "no-store"
            }
        });

    if (request.method !== "POST") {
        return responder({
            success: false,
            message: "La función está activa y espera una solicitud POST."
        }, 405);
    }

    const secret = (process.env.RECAPTCHA_SECRET_KEY || "").trim();

    if (!secret) {
        return responder({
            success: false,
            message: "Falta RECAPTCHA_SECRET_KEY en las variables de Netlify."
        }, 500);
    }

    let token;

    try {
        const body = await request.json();
        token = typeof body.token === "string" ? body.token : "";
    } catch {
        return responder({
            success: false,
            message: "La solicitud del CAPTCHA no contiene JSON válido."
        }, 400);
    }

    if (!token) {
        return responder({
            success: false,
            message: "No recibimos la respuesta del CAPTCHA. Márcalo e inténtalo otra vez."
        }, 400);
    }

    let resultado;

    try {
        const respuesta = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    secret: secret,
                    response: token
                })
            }
        );

        resultado = await respuesta.json();

    } catch (error) {
        console.error("Error contactando a Google reCAPTCHA:", error);

        return responder({
            success: false,
            message: "Netlify no pudo contactar al servicio de Google reCAPTCHA."
        }, 502);
    }

    const errores = Array.isArray(resultado["error-codes"])
        ? resultado["error-codes"]
        : [];

    // Mostrar una explicación útil sin revelar la clave secreta.
    if (!resultado.success) {
        console.error("Google reCAPTCHA rechazó la verificación:", errores);

        let mensaje = "Google rechazó el CAPTCHA. Revisa las claves configuradas.";

        if (
            errores.includes("missing-input-secret") ||
            errores.includes("invalid-input-secret")
        ) {
            mensaje =
                "La clave secreta configurada en Netlify falta o no es válida. Revisa RECAPTCHA_SECRET_KEY en Production.";
        } else if (
            errores.includes("missing-input-response") ||
            errores.includes("invalid-input-response")
        ) {
            mensaje =
                "Google recibió una respuesta CAPTCHA vacía o inválida. Vuelve a marcar la casilla e inténtalo otra vez.";
        } else if (errores.includes("timeout-or-duplicate")) {
            mensaje =
                "La respuesta del CAPTCHA venció o ya se utilizó. Completa una nueva verificación e intenta ingresar inmediatamente.";
        } else if (errores.includes("bad-request")) {
            mensaje =
                "Google recibió una solicitud CAPTCHA incorrecta. Revisa la configuración de la función.";
        }

        return responder({
            success: false,
            message: mensaje,
            errorCodes: errores
        }, 400);
    }

    const normalizarDominio = (valor) =>
        String(valor || "")
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .split("/")[0]
            .replace(/:\d+$/, "");

    const dominiosPermitidos = (
        process.env.RECAPTCHA_ALLOWED_HOSTS ||
        "nutrifilt-movil.netlify.app"
    )
        .split(",")
        .map(normalizarDominio)
        .filter(Boolean);

    const dominioRecibido = normalizarDominio(resultado.hostname);

    if (!dominiosPermitidos.includes(dominioRecibido)) {
        console.error("Dominio CAPTCHA no permitido:", dominioRecibido);

        return responder({
            success: false,
            message:
                "Google validó la respuesta, pero el dominio recibido no coincide con RECAPTCHA_ALLOWED_HOSTS.",
            hostname: dominioRecibido
        }, 400);
    }

    return responder({ success: true });
};
