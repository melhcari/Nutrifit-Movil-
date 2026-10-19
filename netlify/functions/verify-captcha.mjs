export default async (request) => {
    const json = (data, status = 200) =>
        new Response(JSON.stringify(data), {
            status,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "no-store"
            }
        });

    if (request.method !== "POST") {
        return json({
            success: false,
            message: "La función está activa y espera una solicitud POST."
        }, 405);
    }

    const secret = (
        process.env.RECAPTCHA_SECRET_KEY || ""
    ).trim();

    if (!secret) {
        return json({
            success: false,
            message: "Falta RECAPTCHA_SECRET_KEY en Netlify."
        }, 500);
    }

    let token;

    try {
        const body = await request.json();
        token = typeof body.token === "string" ? body.token : "";
    } catch {
        return json({
            success: false,
            message: "La solicitud del CAPTCHA no es válida."
        }, 400);
    }

    if (!token) {
        return json({
            success: false,
            message: "No se recibió la respuesta del CAPTCHA."
        }, 400);
    }

    let result;

    try {
        const response = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    secret,
                    response: token
                })
            }
        );

        result = await response.json();

    } catch (error) {
        console.error("Error al contactar a Google:", error);

        return json({
            success: false,
            message: "Netlify no pudo contactar a Google reCAPTCHA."
        }, 502);
    }

    const errors = Array.isArray(result["error-codes"])
        ? result["error-codes"]
        : [];

    if (!result.success) {
        console.error("Google rechazó el CAPTCHA:", errors);

        let message =
            "Google rechazó la respuesta. Revisa las claves configuradas.";

        if (
            errors.includes("invalid-input-secret") ||
            errors.includes("missing-input-secret")
        ) {
            message =
                "La clave secreta falta o no es válida. Revisa RECAPTCHA_SECRET_KEY en Production.";
        } else if (
            errors.includes("invalid-input-response") ||
            errors.includes("missing-input-response")
        ) {
            message =
                "La respuesta del CAPTCHA es inválida. Recarga la página y vuelve a marcar la casilla.";
        } else if (errors.includes("timeout-or-duplicate")) {
            message =
                "El CAPTCHA venció o ya fue utilizado. Marca la casilla nuevamente e intenta ingresar enseguida.";
        } else if (errors.includes("bad-request")) {
            message =
                "Google recibió una solicitud incorrecta. Revisa la configuración.";
        }

        return json({
            success: false,
            message,
            errorCodes: errors
        }, 400);
    }

    const normalizeHost = (value) =>
        String(value || "")
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .split("/")[0]
            .replace(/:\d+$/, "");

    const allowedHosts = (
        process.env.RECAPTCHA_ALLOWED_HOSTS ||
        "nutrifilt-movil.netlify.app"
    )
        .split(",")
        .map(normalizeHost)
        .filter(Boolean);

    const hostname = normalizeHost(result.hostname);

    if (!allowedHosts.includes(hostname)) {
        console.error("Dominio recibido:", hostname);

        return json({
            success: false,
            message:
                "El CAPTCHA fue validado por Google, pero el dominio no coincide con la lista permitida.",
            hostname
        }, 400);
    }

    return json({ success: true });
};
