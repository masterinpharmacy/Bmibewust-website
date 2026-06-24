# Hosting & domein koppelen — BMI Bewust

Deze handleiding loodst je stap voor stap door het live zetten van de nieuwe website, inclusief de werkende AI-chat en je bestaande domein `bmibewust.nl`.

Je gebruikt **Vercel** als hosting. Dat is gratis voor een site van deze omvang, en werkt direct samen met de Next.js-code die ik heb klaargezet.

---

## Stap 1 — Anthropic API-key aanmaken

Dit is de "sleutel" waarmee de AI-chat berichten mag versturen.

1. Ga naar **console.anthropic.com**
2. Maak een account aan (of log in)
3. Ga naar **Settings → API Keys**
4. Klik op **Create Key**, geef hem een naam zoals `bmibewust-website`
5. Kopieer de key direct en bewaar 'm ergens veilig (je ziet hem maar één keer)
6. Ga naar **Settings → Billing** en zet een betaalmethode + een redelijk maandlimiet (bijv. €20) zodat er geen onverwachte kosten kunnen ontstaan

Een chatbericht kost een fractie van een cent, dus voor normaal gebruik blijven de kosten laag.

---

## Stap 1b — Resend API-key aanmaken (voor het intakeformulier)

Dit zorgt dat ingevulde intakeformulieren als e-mail bij `info@bmibewust.nl` terechtkomen.

1. Ga naar **resend.com** en maak een gratis account aan (3.000 e-mails/maand gratis)
2. Ga naar **API Keys → Create API Key**, noem hem bijvoorbeeld `bmibewust-intake`
3. Kopieer de key en bewaar 'm samen met je Anthropic-key
4. Belangrijk: om vanaf `intake@bmibewust.nl` te mogen versturen, moet je bij Resend onder **Domains** je domein `bmibewust.nl` toevoegen en de DNS-records die ze laten zien toevoegen bij je domeinprovider (vergelijkbaar met stap 5 hieronder). Tot die tijd kun je voor het testen tijdelijk het standaard Resend-testadres gebruiken, dat ze in hun documentatie aangeven.

---

## Stap 2 — Code naar GitHub

GitHub is waar je code "woont" zodat Vercel hem kan ophalen.

1. Ga naar **github.com** en maak een gratis account
2. Klik rechtsboven op **+ → New repository**
3. Naam: `bmibewust-site` → **Create repository**
4. Op de volgende pagina kies je **uploading an existing file**
5. Sleep alle bestanden uit de map die ik heb klaargezet (zie onderaan deze handleiding) naar het uploadvak
6. Klik **Commit changes**

> Let op: het bestand `.env.example` mag mee, maar zorg dat je nooit je eigen API-key ergens in de code zet — die hoort alleen in Vercel (stap 4).

---

## Stap 3 — Vercel koppelen aan GitHub

1. Ga naar **vercel.com** → **Sign Up** → kies **Continue with GitHub**
2. Geef Vercel toestemming om je GitHub-account te zien
3. Klik op **Add New → Project**
4. Selecteer de repository `bmibewust-site`
5. Vercel herkent automatisch dat het een Next.js-project is — laat de instellingen op standaard staan
6. **Nog niet klikken op Deploy** — eerst stap 4 doen, anders mist de site de API-key

---

## Stap 4 — API-keys veilig instellen

1. Op dat Vercel-projectscherm, klap **Environment Variables** open
2. Bij **Key** vul je in: `ANTHROPIC_API_KEY`, bij **Value** plak je de Anthropic-key uit stap 1 → **Add**
3. Voeg een tweede toe: **Key**: `RESEND_API_KEY`, **Value**: de Resend-key uit stap 1b → **Add**
4. Klik nu op **Deploy**

Na een paar minuten krijg je een live link zoals `bmibewust-site.vercel.app`. Open die en test:
- Werkt de BMI-calculator? (zou direct moeten werken)
- Werkt de chat? Stel een vraag en kijk of er een antwoord komt

---

## Stap 5 — Je domein `bmibewust.nl` koppelen

Nu koppel je je bestaande domein aan deze nieuwe site, in plaats van je oude website.

**In Vercel:**
1. Ga naar je project → **Settings → Domains**
2. Vul in: `bmibewust.nl` → **Add**
3. Vercel laat nu twee gegevens zien die je moet instellen bij je domeinprovider: meestal een **A-record** (een soort IP-adres) en een **CNAME-record** voor `www`. Vercel toont de exacte waarden.

**Bij je domeinprovider** (TransIP, Vimexx, Versio, of waar je het domein hebt geregistreerd):
1. Log in op je account bij die provider
2. Zoek naar **DNS-instellingen** of **DNS-beheer** voor `bmibewust.nl`
3. Verwijder eventuele bestaande A-records die naar je oude website wijzen
4. Voeg de A-record en CNAME-record toe die Vercel je liet zien
5. Sla op

> DNS-wijzigingen kunnen tot 24 uur duren om overal door te werken, vaak gaat het binnen een uur. Vercel laat in het Domains-scherm zien zodra het gelukt is (groen vinkje).

**Belangrijk:** zolang dit nog niet is omgezet, blijft je oude site bereikbaar. Niets gaat "stuk" tijdens deze stap — pas als de DNS wijst naar Vercel, zie je de nieuwe site op `bmibewust.nl`.

---

## Daarna: updates aanbrengen

Wil je later teksten, kleuren of foto's aanpassen?
- Je kunt mij de wijziging laten maken, ik lever een aangepast bestand
- Jij vervangt dat bestand in GitHub (via **upload files** opnieuw, of laat een developer het via Git doen)
- Vercel deployed automatisch een nieuwe versie zodra er een wijziging in GitHub komt — geen extra stappen nodig

---

## Wat als iets niet werkt?

- **Chat geeft foutmelding**: controleer of `ANTHROPIC_API_KEY` correct is ingevuld in Vercel (stap 4), en of er een geldige betaalmethode aan je Anthropic-account hangt
- **Domein laadt niet**: geef de DNS meer tijd (tot 24u), of controleer of je het juiste A-record exact hebt overgenomen
- **Site ziet er kapot uit**: laat het me weten, dan kijk ik mee in de code

Loop je vast bij een van deze stappen, stuur een screenshot en ik help je verder.
