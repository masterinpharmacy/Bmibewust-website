// Verwerkt het intakeformulier. Stuurt een e-mail via Resend.
// RESEND_API_KEY blijft op de server, nooit zichtbaar voor bezoekers.
//
// Toekomstige uitbreiding naar een CRM: voeg hieronder een extra fetch-call toe
// die dezelfde 'data' naar het CRM stuurt (bijv. Hubspot/Pipedrive API).
// De voorkant (het formulier) hoeft daarvoor niet aangepast te worden.

export async function POST(request) {
  try {
    const data = await request.json();
    const { naam, email, telefoon, bericht } = data;

    if (!naam || !email) {
      return Response.json({ error: "Naam en e-mail zijn verplicht." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json(
        { error: "Server is niet correct geconfigureerd (ontbrekende e-mail key)." },
        { status: 500 }
      );
    }

    const emailBody = `
      <h2>Nieuwe intake-aanmelding via bmibewust.nl</h2>
      <p><strong>Naam:</strong> ${naam}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Telefoon:</strong> ${telefoon || "-"}</p>
      <p><strong>Bericht:</strong><br/>${(bericht || "-").replace(/\n/g, "<br/>")}</p>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "BMI Bewust website <intake@bmibewust.nl>",
        to: ["info@bmibewust.nl"],
        reply_to: email,
        subject: `Nieuwe intake-aanmelding: ${naam}`,
        html: emailBody,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Resend API error:", errText);
      return Response.json(
        { error: "Versturen is niet gelukt. Probeer het later opnieuw of mail ons direct." },
        { status: 502 }
      );
    }

    // CRM-koppeling (later toe te voegen), bijvoorbeeld:
    // await fetch("https://api.jouwcrm.com/contacts", {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${process.env.CRM_API_KEY}` },
    //   body: JSON.stringify({ naam, email, telefoon, bericht }),
    // });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Intake route error:", err);
    return Response.json({ error: "Onverwachte serverfout." }, { status: 500 });
  }
}
