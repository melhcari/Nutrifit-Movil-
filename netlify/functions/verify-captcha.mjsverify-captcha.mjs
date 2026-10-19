export default async (request) => {
  const json = (data, status = 200) => new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });

  if (request.method !== "POST") {
    return json({ success: false, message: "Método no permitido." }, 405);
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return json({
      success: false,
      message: "Falta configurar RECAPTCHA_SECRET_KEY en las variables de entorno de Netlify."
    }, 500);
  }

  let token;
  try {
    const body = await request.json();
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return json({ success: false, message: "Solicitud inválida." }, 400);
  }

  if (!token) {
    return json({ success: false, message: "Falta completar el CAPTCHA." }, 400);
  }

  try {
    const verifyResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token })
    });

    if (!verifyResponse.ok) {
      return json({ success: false, message: "No se pudo contactar al servicio CAPTCHA." }, 502);
    }

    const result = await verifyResponse.json();
    const allowedHosts = (process.env.RECAPTCHA_ALLOWED_HOSTS || "nutrifilt-movil.netlify.app")
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean);
    const hostname = String(result.hostname || "").toLowerCase();

    if (!result.success || !allowedHosts.includes(hostname)) {
      return json({ success: false, message: "La verificación CAPTCHA no fue válida. Inténtalo otra vez." }, 400);
    }

    return json({ success: true });
  } catch {
    return json({ success: false, message: "Ocurrió un error al verificar el CAPTCHA." }, 502);
  }
};
