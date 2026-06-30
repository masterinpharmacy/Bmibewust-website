// Deze route draait op de server, nooit in de browser.
// De API-key (ANTHROPIC_API_KEY) wordt alleen hier gelezen en blijft onzichtbaar voor bezoekers.

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "Server is niet correct geconfigureerd (ontbrekende API-key)." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system:
          "Je bent de digitale intake-assistent van BMI Bewust, een springplank-traject (geen doorlopend abonnement) dat mensen met overgewicht helpt op weg naar duurzame zorg. Het traject duurt 3 maanden, inclusief geneesmiddelen (zoals Ozempic, Wegovy, Mounjaro) en 24/7 coaching, en kost een vaste pakketprijs van €1.490. De medicatie wordt geleverd via en opgehaald bij onze partnerapotheek. Na de 3 maanden volgt een individueel evaluatiegesprek: de klant kiest dan om door te gaan met reguliere zorg en leefstijlbegeleiding via de partnerapotheek, of te stoppen. Beantwoord vragen over het traject, de procedure (8 stappen: aanmelding, intake, gezondheidscheck, behandelplan, begeleiding, check na 2 weken, controle na 12 weken, resultaat), prijzen, en algemene voorlichting over hoe dit soort medicatie werkt. Geef NOOIT een persoonlijk medisch advies, diagnose, dosering of inschatting of medicatie geschikt is voor de specifieke gebruiker — verwijs daarvoor altijd naar het intakegesprek met de huisarts. Wees warm, nuchter en beknopt (max 4-5 zinnen per antwoord). Antwoord in het Nederlands.",
        messages: messages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        })),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return Response.json(
        { error: "Er ging iets mis bij het ophalen van een antwoord." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply =
      data?.content?.map((block) => (block.type === "text" ? block.text : "")).join("") ||
      "Sorry, daar ging iets mis. Kun je het opnieuw proberen?";

    return Response.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return Response.json({ error: "Onverwachte serverfout." }, { status: 500 });
  }
}
