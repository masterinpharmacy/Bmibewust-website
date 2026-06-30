"use client";

import React, { useState, useRef, useEffect, createContext, useContext } from "react";

/* ---------- Design tokens ----------
  ink:      #2B2B26  (near-black text)
  forest:   #1B3A34  (deep clinical green)
  ivory:    #F7F4ED  (background)
  copper:   #C8754B  (signature accent)
  sage:     #8A9A8E  (secondary / muted)
  forest-2: #234A42  (lighter forest for hover states)
-------------------------------------- */

/* ====================================================================
   I18N CONTENT
   Three languages: nl (default), en, de.
   Everything user-facing lives here so the rest of the file stays
   language-agnostic and just reads from `t` (the active translation).
==================================================================== */

const LANGS = [
  { code: "nl", label: "NL" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
];

const CONTENT = {
  nl: {
    nav: {
      links: [
        { href: "#hoe-werkt-het", label: "Hoe het werkt" },
        { href: "#ai-intake", label: "AI-intake" },
        { href: "#verhalen", label: "Ervaringen" },
        { href: "#faq", label: "Vragen" },
      ],
      cta: "Plan intake",
    },
    hero: {
      eyebrow: "Onder begeleiding van huisarts, apotheker & diëtist",
      titlePre: "Afvallen als ",
      titleEm: "medische",
      titlePost: ", niet als esthetische keuze.",
      sub: "Overgewicht is vaak het gevolg van jaren disbalans — lichamelijk, hormonaal, mentaal. BMI Bewust is jouw springplank naar een traject met verantwoord voorgeschreven medicatie zoals Ozempic, Wegovy en Mounjaro: 3 maanden intensieve begeleiding, geleverd via onze partnerapotheek, waarna je samen met ons het vervolg bepaalt.",
      ctaPrimary: "Start je intake",
      ctaGhost: "Bereken je BMI ↓",
      trust1: "reactietijd",
      trust1n: "24u",
      trust2: "huisarts-gemonitord",
      trust2n: "100%",
      trust3: "volledig traject",
      trust3n: "8 stappen",
    },
    about: [
      { title: "Springplank, geen abonnement", body: "3 maanden intensieve begeleiding bij BMI Bewust, daarna samen kiezen: doorgaan via reguliere zorg bij onze partnerapotheek, of stoppen." },
      { title: "Drie experts, één plan", body: "Huisarts, apotheker en diëtist werken samen: medisch toezicht, medicatiebewaking en voedingsadvies in één lijn." },
      { title: "24/7 coaching", body: "Vragen tussen de afspraken door? Je coach is dag en nacht bereikbaar — je staat er nooit alleen voor." },
    ],
    timeline: {
      eyebrow: "Het traject",
      title: "Acht stappen, één duidelijke route",
      sub: "Geen verrassingen. Elke fase bouwt voort op de vorige, met controle op vaste momenten.",
      steps: [
        { n: "01", title: "Aanmelding", body: "Je vult het intakeformulier in. Binnen 24 uur plannen we een afspraak." },
        { n: "02", title: "Intakegesprek", body: "We bespreken leefstijl, eetpatroon en motivatie. Jij stelt het doel." },
        { n: "03", title: "Gezondheidscheck", body: "Buikomvang, vetpercentage en bloedwaarden geven een volledig beeld." },
        { n: "04", title: "Behandelplan", body: "De huisarts bepaalt of medicatie een passende aanvulling is." },
        { n: "05", title: "Begeleiding", body: "Beweegplan, voedingsadvies en medicatie — samen, niet los van elkaar." },
        { n: "06", title: "Check na 2 weken", body: "We evalueren bijwerkingen en stellen bij waar nodig." },
        { n: "07", title: "Controle na 12 weken", body: "Resultaten worden besproken en de therapie wordt herijkt." },
        { n: "08", title: "Resultaat", body: "Na 3 tot 12 maanden een gezonder lichaam — en een leefstijl die blijft." },
      ],
    },
    pricing: {
      eyebrow: "Eén pakket, een duidelijk vervolg",
      title: "Jouw springplank naar duurzame zorg",
      sub: "BMI Bewust begeleidt je de eerste 3 maanden — geneesmiddelen, coaching en monitoring in één pakket. Daarna bepaal je samen met ons het vervolg, via de reguliere zorg van onze partnerapotheek.",
      cardEyebrow: "Pakketprijs · 3 maanden",
      price: "€1.490",
      note: "Eenmalig pakket · inclusief geneesmiddelen en coaching",
      cta: "Start je intake",
      features: [
        { title: "Eén pakketprijs", body: "€1.490 voor het volledige 3-maanden traject, inclusief geneesmiddelen en coaching. Geen verrassingen achteraf." },
        { title: "24/7 coaching", body: "Vragen of twijfels tussen de afspraken door? Je coach is dag en nacht bereikbaar." },
        { title: "Vaste apotheek", body: "Levering en ophalen via onze partnerapotheek — vertrouwde medicatiebewaking, geen anonieme verzending." },
      ],
    },
    aiSection: {
      eyebrow: "Voor je eerste afspraak",
      title: "Stel je vragen, dag en nacht",
      sub: "Onze digitale intake-assistent beantwoordt voorlichtingsvragen vooraf, zodat je gesprek met de huisarts direct de diepte in kan.",
      features: [
        { icon: "?", title: "Voorlichting, geen diagnose", body: "Vragen over het traject, medicatie en procedure worden direct beantwoord — een medische beoordeling blijft bij de huisarts." },
        { icon: "⏱", title: "Altijd beschikbaar", body: "Geen wachttijd voor een eerste antwoord. Twijfel je of dit traject iets voor je is? Vraag het nu." },
        { icon: "→", title: "Vloeiende overdracht", body: "Wat je hier bespreekt, helpt je voorbereiden — het vervangt het intakegesprek niet, het versterkt het." },
      ],
    },
    chat: {
      headerTitle: "Digitale intake-assistent",
      headerSub: "Stelt geen diagnose · verwijst naar je arts",
      greeting: "Hoi, ik ben de digitale intake-assistent van BMI Bewust. Ik kan je alvast vragen beantwoorden over het traject, medicatie of de procedure. Ik vervang geen huisarts en geef geen medisch advies — voor een echte beoordeling plannen we een afspraak. Waarmee kan ik je op weg helpen?",
      placeholder: "Stel je vraag…",
      errorReply: "Sorry, daar ging iets mis. Kun je het opnieuw proberen?",
      errorCatch: "Er ging iets mis bij het ophalen van een antwoord. Probeer het nog eens.",
      langInstruction: "Antwoord altijd in het Nederlands.",
    },
    testimonials: {
      eyebrow: "Wat anderen ervaarden",
      title: "Verhalen uit de praktijk",
      items: [
        { quote: "Uitermate tevreden over de persoonlijke aandacht en deskundigheid. Een echte aanrader.", name: "B. Bos" },
        { quote: "Na het consult werd ik ingesteld op Ozempic. Drie maanden later van 80 naar 69 kg bij 1,70m.", name: "E. Timmermans" },
        { quote: "De apotheek begeleidde me goed bij Mounjaro. Na vier weken voelde ik me al veel fitter.", name: "Anoniem" },
      ],
    },
    intakeSection: {
      eyebrow: "Klaar voor de eerste stap",
      title: "Meld je aan voor een intake",
      sub: "Na je aanmelding nemen we binnen 24 uur contact met je op om een afspraak te plannen met de huisarts. Geen verplichtingen, gewoon een goed gesprek over wat bij jouw situatie past.",
      trust1n: "24u",
      trust1: "reactietijd",
      trust2n: "Vrijblijvend",
      trust2: "gesprek",
    },
    intakeForm: {
      eyebrow: "Plan je intake",
      title: "Meld je hier aan",
      sub: "Vul je gegevens in, dan nemen we binnen 24 uur contact met je op.",
      labelNaam: "Naam *",
      placeholderNaam: "Jouw volledige naam",
      labelEmail: "E-mail *",
      placeholderEmail: "naam@email.nl",
      labelTelefoon: "Telefoon",
      placeholderTelefoon: "06 12345678",
      labelLeeftijd: "Leeftijd",
      placeholderLeeftijd: "Bijv. 42",
      labelGeslacht: "Geslacht",
      geslachtChoose: "Maak een keuze",
      geslachtVrouw: "Vrouw",
      geslachtMan: "Man",
      geslachtAnders: "Anders",
      geslachtZegIkNiet: "Zeg ik liever niet",
      labelLengte: "Lengte (cm)",
      placeholderLengte: "Bijv. 172",
      labelGewicht: "Gewicht (kg)",
      placeholderGewicht: "Bijv. 88",
      bmiReadout: "Jouw BMI:",
      labelBericht: "Vertel kort over je situatie",
      placeholderBericht: "Bijvoorbeeld: wat je hoopt te bereiken, of je al ervaring hebt met dit type traject...",
      submitSending: "Versturen…",
      submitDefault: "Verstuur aanmelding",
      disclaimer: "Door dit formulier te versturen ga je akkoord dat we contact met je opnemen over je aanmelding. Dit vervangt geen medisch advies.",
      successTitlePre: "Bedankt,",
      successTitlePost: "is verzonden!",
      successFallbackName: "je aanmelding",
      successBody: "We nemen binnen 24 uur contact met je op om een afspraak in te plannen.",
      errorGeneric: "Er ging iets mis. Probeer het opnieuw.",
      errorCatch: "Er ging iets mis. Probeer het opnieuw of mail ons direct.",
    },
    faqSection: {
      eyebrow: "Veelgestelde vragen",
      title: "Voordat je begint",
      items: [
        { q: "Wat kost een traject bij BMI Bewust?", a: "Eén pakketprijs van €1.490 voor het volledige 3-maanden traject — inclusief geneesmiddelen en coaching. Geen losse facturen, geen verborgen kosten." },
        { q: "Wat gebeurt er na de 3 maanden?", a: "We evalueren samen je traject. Je kiest dan zelf: doorgaan met reguliere zorg en leefstijlbegeleiding via onze partnerapotheek, of stoppen. BMI Bewust is de springplank naar die zorg — geen abonnement dat automatisch doorloopt." },
        { q: "Waar haal ik mijn medicatie op?", a: "De geneesmiddelen worden geleverd via onze partnerapotheek en kun je daar ook ophalen. Zo blijft de medicatiebewaking in vertrouwde, deskundige handen." },
        { q: "Wordt dit vergoed door mijn zorgverzekering?", a: "GLP-1 medicatie wordt in Nederland alleen vergoed bij een medische indicatie zoals diabetes type 2, vastgesteld door je huisarts. Bij gewichtsverlies zonder die indicatie betaal je het pakket zelf. We bespreken dit altijd vooraf." },
        { q: "Is dit veilig in vergelijking met online bestellen?", a: "Bij ons werken huisarts, apotheker en diëtist samen aan jouw traject: medicatiebewaking, voedingsadvies en monitoring van bijwerkingen in één team, met levering via een echte apotheek. Bij anonieme onlineverkoop ontbreekt dat volledig." },
        { q: "Hoeveel kan ik kwijtraken?", a: "Dat verschilt per persoon. Eerdere trajecten laten resultaten zien tussen 8 en 15% lichaamsgewicht in 3 maanden, in combinatie met leefstijlverandering." },
        { q: "Kan ik altijd contact opnemen met mijn coach?", a: "Ja. Naast de vaste controlemomenten kun je 24/7 contact opnemen met je coach bij vragen, twijfels of bijwerkingen. Je staat er nooit alleen voor tijdens het traject." },
      ],
    },
    finalCta: {
      title: "Klaar om het roer om te gooien?",
      sub: "Meld je aan en we plannen binnen 24 uur een afspraak om jouw situatie te bespreken.",
      cta: "Meld je nu aan",
    },
    footer: {
      contactTitle: "Contact",
      socialsTitle: "Socials",
      bottom: "© 2025–2026 BMI Bewust — Medische begeleiding bij gewichtsverlies, via huisarts en apotheek.",
    },
    bmiCalc: {
      eyebrow: "Direct resultaat",
      title: "Bereken je BMI",
      labelLengte: "Lengte",
      labelGewicht: "Gewicht",
      disclaimer: "Een BMI-berekening is een indicatie, geen diagnose. Alleen een huisarts kan een medisch advies geven dat past bij jouw situatie.",
      categories: {
        onder: "Ondergewicht",
        gezond: "Gezond gewicht",
        over: "Overgewicht",
        obesitas: "Obesitas",
      },
      advice: {
        onder: "Een traject gericht op gewichtsverlies is hier niet aan de orde. Neem contact op met je huisarts voor passend advies.",
        gezond: "Je BMI valt binnen een gezonde marge. Wil je toch werken aan leefstijl of lichaamssamenstelling? Een intake kan nog steeds nuttig zijn.",
        over: "Bij deze BMI kan een begeleid traject met leefstijlcoaching al veel betekenen. Medicatie is meestal niet de eerste stap.",
        obesitas: "Bij deze BMI is medische begeleiding relevant. Een combinatie van leefstijl en eventueel medicatie kan worden overwogen, in overleg met de huisarts.",
      },
    },
  },

  en: {
    nav: {
      links: [
        { href: "#hoe-werkt-het", label: "How it works" },
        { href: "#ai-intake", label: "AI intake" },
        { href: "#verhalen", label: "Experiences" },
        { href: "#faq", label: "FAQ" },
      ],
      cta: "Plan intake",
    },
    hero: {
      eyebrow: "Guided by a GP, pharmacist & dietitian",
      titlePre: "Weight loss as a ",
      titleEm: "medical",
      titlePost: " choice, not an aesthetic one.",
      sub: "Excess weight is often the result of years of imbalance — physical, hormonal, mental. BMI Bewust is your springboard into a responsibly prescribed treatment with medication such as Ozempic, Wegovy and Mounjaro: 3 months of intensive guidance, supplied through our partner pharmacy, after which you decide the next step together with us.",
      ctaPrimary: "Start your intake",
      ctaGhost: "Calculate your BMI ↓",
      trust1: "response time",
      trust1n: "24h",
      trust2: "GP-monitored",
      trust2n: "100%",
      trust3: "complete journey",
      trust3n: "8 steps",
    },
    about: [
      { title: "A springboard, not a subscription", body: "3 months of intensive guidance with BMI Bewust, then together decide: continue with regular care at our partner pharmacy, or stop." },
      { title: "Three experts, one plan", body: "GP, pharmacist and dietitian work together: medical oversight, medication monitoring and nutritional advice in one line." },
      { title: "24/7 coaching", body: "Questions between appointments? Your coach is reachable day and night — you're never on your own." },
    ],
    timeline: {
      eyebrow: "The journey",
      title: "Eight steps, one clear route",
      sub: "No surprises. Every phase builds on the last, with check-ins at fixed moments.",
      steps: [
        { n: "01", title: "Registration", body: "You fill in the intake form. We schedule an appointment within 24 hours." },
        { n: "02", title: "Intake conversation", body: "We discuss lifestyle, eating habits and motivation. You set the goal." },
        { n: "03", title: "Health check", body: "Waist circumference, body fat percentage and blood values give a full picture." },
        { n: "04", title: "Treatment plan", body: "The GP determines whether medication is a suitable addition." },
        { n: "05", title: "Guidance", body: "Exercise plan, nutritional advice and medication — together, not apart." },
        { n: "06", title: "Check after 2 weeks", body: "We evaluate side effects and adjust where needed." },
        { n: "07", title: "Review after 12 weeks", body: "Results are discussed and the therapy is recalibrated." },
        { n: "08", title: "Result", body: "After 3 to 12 months, a healthier body — and a lifestyle that lasts." },
      ],
    },
    pricing: {
      eyebrow: "One package, a clear next step",
      title: "Your springboard to lasting care",
      sub: "BMI Bewust guides you through the first 3 months — medication, coaching and monitoring in one package. After that, you decide the next step together with us, through regular care at our partner pharmacy.",
      cardEyebrow: "Package price · 3 months",
      price: "€1,490",
      note: "One-time package · includes medication and coaching",
      cta: "Start your intake",
      features: [
        { title: "One package price", body: "€1,490 for the full 3-month journey, including medication and coaching. No surprises afterwards." },
        { title: "24/7 coaching", body: "Questions or doubts between appointments? Your coach is reachable day and night." },
        { title: "Fixed pharmacy", body: "Supply and pickup through our partner pharmacy — trusted medication monitoring, no anonymous shipping." },
      ],
    },
    aiSection: {
      eyebrow: "Before your first appointment",
      title: "Ask your questions, day or night",
      sub: "Our digital intake assistant answers informational questions in advance, so your conversation with the GP can go straight into depth.",
      features: [
        { icon: "?", title: "Information, not diagnosis", body: "Questions about the journey, medication and procedure are answered directly — a medical assessment stays with the GP." },
        { icon: "⏱", title: "Always available", body: "No waiting for a first answer. Wondering if this journey is right for you? Ask now." },
        { icon: "→", title: "A smooth handover", body: "What you discuss here helps you prepare — it doesn't replace the intake conversation, it strengthens it." },
      ],
    },
    chat: {
      headerTitle: "Digital intake assistant",
      headerSub: "No diagnoses · refers you to your doctor",
      greeting: "Hi, I'm BMI Bewust's digital intake assistant. I can already answer questions about the journey, medication or the procedure. I don't replace a GP and don't give medical advice — we'll schedule an appointment for a real assessment. What can I help you with?",
      placeholder: "Ask your question…",
      errorReply: "Sorry, something went wrong. Could you try again?",
      errorCatch: "Something went wrong while fetching a reply. Please try again.",
      langInstruction: "Always answer in English.",
    },
    testimonials: {
      eyebrow: "What others experienced",
      title: "Stories from practice",
      items: [
        { quote: "Extremely satisfied with the personal attention and expertise. A genuine recommendation.", name: "B. Bos" },
        { quote: "After the consultation I was started on Ozempic. Three months later I went from 80 to 69 kg at 1.70m.", name: "E. Timmermans" },
        { quote: "The pharmacy guided me well with Mounjaro. After four weeks I already felt much fitter.", name: "Anonymous" },
      ],
    },
    intakeSection: {
      eyebrow: "Ready for the first step",
      title: "Sign up for an intake",
      sub: "After signing up we'll contact you within 24 hours to schedule an appointment with the GP. No obligations, just a good conversation about what fits your situation.",
      trust1n: "24h",
      trust1: "response time",
      trust2n: "No-obligation",
      trust2: "conversation",
    },
    intakeForm: {
      eyebrow: "Plan your intake",
      title: "Sign up here",
      sub: "Fill in your details and we'll contact you within 24 hours.",
      labelNaam: "Name *",
      placeholderNaam: "Your full name",
      labelEmail: "Email *",
      placeholderEmail: "name@email.com",
      labelTelefoon: "Phone",
      placeholderTelefoon: "+31 6 12345678",
      labelLeeftijd: "Age",
      placeholderLeeftijd: "E.g. 42",
      labelGeslacht: "Gender",
      geslachtChoose: "Make a choice",
      geslachtVrouw: "Female",
      geslachtMan: "Male",
      geslachtAnders: "Other",
      geslachtZegIkNiet: "Prefer not to say",
      labelLengte: "Height (cm)",
      placeholderLengte: "E.g. 172",
      labelGewicht: "Weight (kg)",
      placeholderGewicht: "E.g. 88",
      bmiReadout: "Your BMI:",
      labelBericht: "Briefly tell us about your situation",
      placeholderBericht: "For example: what you hope to achieve, or whether you have experience with this type of journey...",
      submitSending: "Sending…",
      submitDefault: "Send application",
      disclaimer: "By submitting this form you agree that we may contact you about your application. This does not replace medical advice.",
      successTitlePre: "Thank you,",
      successTitlePost: "has been sent!",
      successFallbackName: "your application",
      successBody: "We'll contact you within 24 hours to schedule an appointment.",
      errorGeneric: "Something went wrong. Please try again.",
      errorCatch: "Something went wrong. Please try again or email us directly.",
    },
    faqSection: {
      eyebrow: "Frequently asked questions",
      title: "Before you start",
      items: [
        { q: "What does a BMI Bewust journey cost?", a: "One package price of €1,490 for the full 3-month journey — including medication and coaching. No separate invoices, no hidden costs." },
        { q: "What happens after the 3 months?", a: "We evaluate your journey together. You then choose: continue with regular care and lifestyle guidance through our partner pharmacy, or stop. BMI Bewust is the springboard to that care — not a subscription that continues automatically." },
        { q: "Where do I pick up my medication?", a: "The medication is supplied through our partner pharmacy, where you can also pick it up. This keeps medication monitoring in trusted, expert hands." },
        { q: "Is this covered by my health insurance?", a: "In the Netherlands, GLP-1 medication is only reimbursed with a medical indication such as type 2 diabetes, established by your GP. For weight loss without that indication, you pay for the package yourself. We always discuss this in advance." },
        { q: "Is this safe compared to ordering online?", a: "With us, GP, pharmacist and dietitian work together on your journey: medication monitoring, nutritional advice and monitoring of side effects in one team, with delivery through a real pharmacy. Anonymous online sales lack all of that." },
        { q: "How much weight can I lose?", a: "This varies per person. Previous journeys show results between 8 and 15% of body weight in 3 months, combined with lifestyle change." },
        { q: "Can I always reach my coach?", a: "Yes. Besides the fixed check-in moments, you can reach your coach 24/7 with questions, doubts or side effects. You're never on your own during the journey." },
      ],
    },
    finalCta: {
      title: "Ready to turn things around?",
      sub: "Sign up and we'll schedule an appointment within 24 hours to discuss your situation.",
      cta: "Sign up now",
    },
    footer: {
      contactTitle: "Contact",
      socialsTitle: "Socials",
      bottom: "© 2025–2026 BMI Bewust — Medical guidance for weight loss, through GP and pharmacy.",
    },
    bmiCalc: {
      eyebrow: "Instant result",
      title: "Calculate your BMI",
      labelLengte: "Height",
      labelGewicht: "Weight",
      disclaimer: "A BMI calculation is an indication, not a diagnosis. Only a GP can give medical advice suited to your situation.",
      categories: {
        onder: "Underweight",
        gezond: "Healthy weight",
        over: "Overweight",
        obesitas: "Obesity",
      },
      advice: {
        onder: "A weight-loss-focused journey isn't relevant here. Contact your GP for suitable advice.",
        gezond: "Your BMI falls within a healthy range. Still want to work on lifestyle or body composition? An intake can still be useful.",
        over: "At this BMI, a guided journey with lifestyle coaching can already make a big difference. Medication usually isn't the first step.",
        obesitas: "At this BMI, medical guidance is relevant. A combination of lifestyle and possibly medication can be considered, in consultation with the GP.",
      },
    },
  },

  de: {
    nav: {
      links: [
        { href: "#hoe-werkt-het", label: "So funktioniert's" },
        { href: "#ai-intake", label: "KI-Intake" },
        { href: "#verhalen", label: "Erfahrungen" },
        { href: "#faq", label: "Fragen" },
      ],
      cta: "Intake planen",
    },
    hero: {
      eyebrow: "Begleitet von Hausarzt, Apotheker & Ernährungsberater",
      titlePre: "Abnehmen als ",
      titleEm: "medizinische",
      titlePost: ", nicht ästhetische Entscheidung.",
      sub: "Übergewicht ist oft die Folge jahrelanger Dysbalance — körperlich, hormonell, mental. BMI Bewust ist Ihr Sprungbrett zu einer verantwortungsvoll verschriebenen Behandlung mit Medikamenten wie Ozempic, Wegovy und Mounjaro: 3 Monate intensive Begleitung, geliefert über unsere Partnerapotheke, danach legen wir gemeinsam die nächsten Schritte fest.",
      ctaPrimary: "Intake starten",
      ctaGhost: "BMI berechnen ↓",
      trust1: "Reaktionszeit",
      trust1n: "24h",
      trust2: "hausärztlich begleitet",
      trust2n: "100%",
      trust3: "vollständiger Ablauf",
      trust3n: "8 Schritte",
    },
    about: [
      { title: "Sprungbrett, kein Abo", body: "3 Monate intensive Begleitung bei BMI Bewust, danach gemeinsam entscheiden: Weiterführung über die reguläre Versorgung bei unserer Partnerapotheke, oder Abschluss." },
      { title: "Drei Experten, ein Plan", body: "Hausarzt, Apotheker und Ernährungsberater arbeiten zusammen: medizinische Aufsicht, Medikationsüberwachung und Ernährungsberatung aus einer Hand." },
      { title: "24/7 Coaching", body: "Fragen zwischen den Terminen? Ihr Coach ist Tag und Nacht erreichbar — Sie sind nie allein." },
    ],
    timeline: {
      eyebrow: "Der Ablauf",
      title: "Acht Schritte, ein klarer Weg",
      sub: "Keine Überraschungen. Jede Phase baut auf der vorherigen auf, mit Kontrollen zu festen Zeitpunkten.",
      steps: [
        { n: "01", title: "Anmeldung", body: "Sie füllen das Intake-Formular aus. Innerhalb von 24 Stunden vereinbaren wir einen Termin." },
        { n: "02", title: "Intake-Gespräch", body: "Wir besprechen Lebensstil, Essverhalten und Motivation. Sie legen das Ziel fest." },
        { n: "03", title: "Gesundheitscheck", body: "Taillenumfang, Körperfettanteil und Blutwerte ergeben ein vollständiges Bild." },
        { n: "04", title: "Behandlungsplan", body: "Der Hausarzt entscheidet, ob Medikamente eine passende Ergänzung sind." },
        { n: "05", title: "Begleitung", body: "Bewegungsplan, Ernährungsberatung und Medikation — gemeinsam, nicht getrennt." },
        { n: "06", title: "Kontrolle nach 2 Wochen", body: "Wir bewerten Nebenwirkungen und passen bei Bedarf an." },
        { n: "07", title: "Kontrolle nach 12 Wochen", body: "Ergebnisse werden besprochen und die Therapie wird angepasst." },
        { n: "08", title: "Ergebnis", body: "Nach 3 bis 12 Monaten ein gesünderer Körper — und ein Lebensstil, der bleibt." },
      ],
    },
    pricing: {
      eyebrow: "Ein Paket, ein klarer nächster Schritt",
      title: "Ihr Sprungbrett zu dauerhafter Versorgung",
      sub: "BMI Bewust begleitet Sie die ersten 3 Monate — Medikamente, Coaching und Monitoring in einem Paket. Danach legen Sie gemeinsam mit uns die nächsten Schritte fest, über die reguläre Versorgung bei unserer Partnerapotheke.",
      cardEyebrow: "Paketpreis · 3 Monate",
      price: "1.490 €",
      note: "Einmaliges Paket · inklusive Medikamente und Coaching",
      cta: "Intake starten",
      features: [
        { title: "Ein Paketpreis", body: "1.490 € für den gesamten 3-monatigen Ablauf, inklusive Medikamente und Coaching. Keine Überraschungen im Nachhinein." },
        { title: "24/7 Coaching", body: "Fragen oder Zweifel zwischen den Terminen? Ihr Coach ist Tag und Nacht erreichbar." },
        { title: "Feste Apotheke", body: "Lieferung und Abholung über unsere Partnerapotheke — vertrauensvolle Medikationsüberwachung, kein anonymer Versand." },
      ],
    },
    aiSection: {
      eyebrow: "Vor Ihrem ersten Termin",
      title: "Stellen Sie Ihre Fragen, Tag und Nacht",
      sub: "Unser digitaler Intake-Assistent beantwortet Informationsfragen im Voraus, damit Ihr Gespräch mit dem Hausarzt direkt in die Tiefe gehen kann.",
      features: [
        { icon: "?", title: "Information, keine Diagnose", body: "Fragen zum Ablauf, zur Medikation und zum Verfahren werden direkt beantwortet — eine medizinische Beurteilung bleibt beim Hausarzt." },
        { icon: "⏱", title: "Immer verfügbar", body: "Keine Wartezeit auf eine erste Antwort. Unsicher, ob dieser Ablauf zu Ihnen passt? Fragen Sie jetzt." },
        { icon: "→", title: "Nahtloser Übergang", body: "Was Sie hier besprechen, hilft Ihnen bei der Vorbereitung — es ersetzt das Intake-Gespräch nicht, es stärkt es." },
      ],
    },
    chat: {
      headerTitle: "Digitaler Intake-Assistent",
      headerSub: "Stellt keine Diagnose · verweist an Ihren Arzt",
      greeting: "Hallo, ich bin der digitale Intake-Assistent von BMI Bewust. Ich kann Ihnen bereits Fragen zum Ablauf, zur Medikation oder zum Verfahren beantworten. Ich ersetze keinen Hausarzt und gebe keinen medizinischen Rat — für eine echte Beurteilung vereinbaren wir einen Termin. Womit kann ich Ihnen helfen?",
      placeholder: "Stellen Sie Ihre Frage…",
      errorReply: "Entschuldigung, da ist etwas schiefgelaufen. Können Sie es erneut versuchen?",
      errorCatch: "Beim Abrufen einer Antwort ist etwas schiefgelaufen. Bitte versuchen Sie es erneut.",
      langInstruction: "Antworten Sie immer auf Deutsch.",
    },
    testimonials: {
      eyebrow: "Was andere erlebt haben",
      title: "Erfahrungsberichte aus der Praxis",
      items: [
        { quote: "Sehr zufrieden mit der persönlichen Aufmerksamkeit und Fachkompetenz. Eine echte Empfehlung.", name: "B. Bos" },
        { quote: "Nach dem Konsultationsgespräch wurde ich auf Ozempic eingestellt. Drei Monate später von 80 auf 69 kg bei 1,70 m.", name: "E. Timmermans" },
        { quote: "Die Apotheke hat mich bei Mounjaro gut begleitet. Nach vier Wochen fühlte ich mich schon viel fitter.", name: "Anonym" },
      ],
    },
    intakeSection: {
      eyebrow: "Bereit für den ersten Schritt",
      title: "Melden Sie sich für ein Intake an",
      sub: "Nach Ihrer Anmeldung nehmen wir innerhalb von 24 Stunden Kontakt mit Ihnen auf, um einen Termin mit dem Hausarzt zu vereinbaren. Keine Verpflichtungen, einfach ein gutes Gespräch darüber, was zu Ihrer Situation passt.",
      trust1n: "24h",
      trust1: "Reaktionszeit",
      trust2n: "Unverbindliches",
      trust2: "Gespräch",
    },
    intakeForm: {
      eyebrow: "Intake planen",
      title: "Hier anmelden",
      sub: "Füllen Sie Ihre Daten aus, wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      labelNaam: "Name *",
      placeholderNaam: "Ihr vollständiger Name",
      labelEmail: "E-Mail *",
      placeholderEmail: "name@email.de",
      labelTelefoon: "Telefon",
      placeholderTelefoon: "+49 151 23456789",
      labelLeeftijd: "Alter",
      placeholderLeeftijd: "Z.B. 42",
      labelGeslacht: "Geschlecht",
      geslachtChoose: "Bitte wählen",
      geslachtVrouw: "Weiblich",
      geslachtMan: "Männlich",
      geslachtAnders: "Divers",
      geslachtZegIkNiet: "Möchte ich nicht angeben",
      labelLengte: "Größe (cm)",
      placeholderLengte: "Z.B. 172",
      labelGewicht: "Gewicht (kg)",
      placeholderGewicht: "Z.B. 88",
      bmiReadout: "Ihr BMI:",
      labelBericht: "Erzählen Sie kurz von Ihrer Situation",
      placeholderBericht: "Zum Beispiel: was Sie erreichen möchten, oder ob Sie bereits Erfahrung mit dieser Art von Behandlung haben...",
      submitSending: "Wird gesendet…",
      submitDefault: "Anmeldung senden",
      disclaimer: "Mit dem Absenden dieses Formulars stimmen Sie zu, dass wir Sie bezüglich Ihrer Anmeldung kontaktieren. Dies ersetzt keine medizinische Beratung.",
      successTitlePre: "Danke,",
      successTitlePost: "wurde gesendet!",
      successFallbackName: "Ihre Anmeldung",
      successBody: "Wir nehmen innerhalb von 24 Stunden Kontakt mit Ihnen auf, um einen Termin zu vereinbaren.",
      errorGeneric: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      errorCatch: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt eine E-Mail.",
    },
    faqSection: {
      eyebrow: "Häufig gestellte Fragen",
      title: "Bevor Sie beginnen",
      items: [
        { q: "Was kostet eine Behandlung bei BMI Bewust?", a: "Ein Paketpreis von 1.490 € für den gesamten 3-monatigen Ablauf — inklusive Medikamente und Coaching. Keine separaten Rechnungen, keine versteckten Kosten." },
        { q: "Was passiert nach den 3 Monaten?", a: "Wir bewerten Ihren Ablauf gemeinsam. Sie entscheiden dann selbst: Weiterführung mit regulärer Versorgung und Lebensstilbegleitung über unsere Partnerapotheke, oder Abschluss. BMI Bewust ist das Sprungbrett zu dieser Versorgung — kein Abo, das automatisch weiterläuft." },
        { q: "Wo hole ich meine Medikamente ab?", a: "Die Medikamente werden über unsere Partnerapotheke geliefert, wo Sie sie auch abholen können. So bleibt die Medikationsüberwachung in vertrauensvollen, fachkundigen Händen." },
        { q: "Wird dies von meiner Krankenkasse übernommen?", a: "In den Niederlanden werden GLP-1-Medikamente nur bei einer medizinischen Indikation wie Typ-2-Diabetes erstattet, festgestellt durch Ihren Hausarzt. Bei Gewichtsverlust ohne diese Indikation zahlen Sie das Paket selbst. Wir besprechen dies immer im Voraus." },
        { q: "Ist dies sicherer als eine Online-Bestellung?", a: "Bei uns arbeiten Hausarzt, Apotheker und Ernährungsberater gemeinsam an Ihrem Ablauf: Medikationsüberwachung, Ernährungsberatung und Überwachung von Nebenwirkungen aus einer Hand, mit Lieferung über eine echte Apotheke. Bei anonymen Online-Verkäufen fehlt das alles." },
        { q: "Wie viel kann ich abnehmen?", a: "Das ist von Person zu Person unterschiedlich. Frühere Behandlungen zeigen Ergebnisse zwischen 8 und 15 % des Körpergewichts in 3 Monaten, in Kombination mit einer Lebensstiländerung." },
        { q: "Kann ich meinen Coach immer erreichen?", a: "Ja. Neben den festen Kontrollterminen können Sie Ihren Coach rund um die Uhr bei Fragen, Zweifeln oder Nebenwirkungen erreichen. Sie sind während der Behandlung nie allein." },
      ],
    },
    finalCta: {
      title: "Bereit für den Neuanfang?",
      sub: "Melden Sie sich an, und wir vereinbaren innerhalb von 24 Stunden einen Termin, um Ihre Situation zu besprechen.",
      cta: "Jetzt anmelden",
    },
    footer: {
      contactTitle: "Kontakt",
      socialsTitle: "Soziale Medien",
      bottom: "© 2025–2026 BMI Bewust — Medizinische Begleitung bei Gewichtsverlust, über Hausarzt und Apotheke.",
    },
    bmiCalc: {
      eyebrow: "Sofortiges Ergebnis",
      title: "BMI berechnen",
      labelLengte: "Größe",
      labelGewicht: "Gewicht",
      disclaimer: "Eine BMI-Berechnung ist eine Orientierung, keine Diagnose. Nur ein Hausarzt kann eine medizinische Beratung geben, die zu Ihrer Situation passt.",
      categories: {
        onder: "Untergewicht",
        gezond: "Gesundes Gewicht",
        over: "Übergewicht",
        obesitas: "Adipositas",
      },
      advice: {
        onder: "Ein auf Gewichtsverlust ausgerichteter Ablauf ist hier nicht relevant. Wenden Sie sich an Ihren Hausarzt für passende Beratung.",
        gezond: "Ihr BMI liegt im gesunden Bereich. Möchten Sie dennoch an Lebensstil oder Körperzusammensetzung arbeiten? Ein Intake-Gespräch kann trotzdem nützlich sein.",
        over: "Bei diesem BMI kann ein begleiteter Ablauf mit Lebensstil-Coaching bereits viel bewirken. Medikamente sind meist nicht der erste Schritt.",
        obesitas: "Bei diesem BMI ist medizinische Begleitung relevant. Eine Kombination aus Lebensstil und gegebenenfalls Medikamenten kann in Absprache mit dem Hausarzt erwogen werden.",
      },
    },
  },
};

/* ====================================================================
   LANGUAGE CONTEXT
==================================================================== */

const LangContext = createContext({ lang: "nl", setLang: () => {}, t: CONTENT.nl });

function useLang() {
  return useContext(LangContext);
}

function LangProvider({ children }) {
  const [lang, setLang] = useState("nl");
  const t = CONTENT[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

function LangSwitcher({ className = "" }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang-switcher ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={`lang-btn ${lang === l.code ? "lang-btn-active" : ""}`}
          onClick={() => setLang(l.code)}
          aria-label={`Switch to ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

/* ====================================================================
   SHARED HOOKS / COMPONENTS
==================================================================== */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- BMI Calculator (live, functional) ---------------- */
function BmiCalculator() {
  const { t } = useLang();
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(88);
  const bmi = weight / Math.pow(height / 100, 2);
  const bmiRounded = Math.round(bmi * 10) / 10;

  let categoryKey, color, adviceKey;
  if (bmi < 18.5) {
    categoryKey = "onder"; color = "#8A9A8E"; adviceKey = "onder";
  } else if (bmi < 25) {
    categoryKey = "gezond"; color = "#1B3A34"; adviceKey = "gezond";
  } else if (bmi < 30) {
    categoryKey = "over"; color = "#C8754B"; adviceKey = "over";
  } else {
    categoryKey = "obesitas"; color = "#A84B2A"; adviceKey = "obesitas";
  }

  const pct = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));

  return (
    <div className="bmi-card">
      <p className="bmi-eyebrow">{t.bmiCalc.eyebrow}</p>
      <h3 className="bmi-title">{t.bmiCalc.title}</h3>

      <div className="bmi-sliders">
        <label className="bmi-label">
          <span>{t.bmiCalc.labelLengte}</span>
          <span className="bmi-value">{height} cm</span>
        </label>
        <input
          type="range"
          min="140"
          max="220"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className="bmi-range"
        />

        <label className="bmi-label" style={{ marginTop: "1.1rem" }}>
          <span>{t.bmiCalc.labelGewicht}</span>
          <span className="bmi-value">{weight} kg</span>
        </label>
        <input
          type="range"
          min="40"
          max="180"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="bmi-range"
        />
      </div>

      <div className="bmi-result">
        <div className="bmi-gauge">
          <div className="bmi-gauge-track">
            <div className="bmi-gauge-fill" style={{ width: `${pct}%`, background: color }} />
          </div>
        </div>
        <div className="bmi-readout">
          <span className="bmi-number" style={{ color }}>{bmiRounded}</span>
          <span className="bmi-category" style={{ color }}>{t.bmiCalc.categories[categoryKey]}</span>
        </div>
      </div>

      <p className="bmi-advice">{t.bmiCalc.advice[adviceKey]}</p>
      <p className="bmi-disclaimer">{t.bmiCalc.disclaimer}</p>
    </div>
  );
}

/* ---------------- AI Intake Chat (functional, calls Claude API) ---------------- */
function AiIntakeChat() {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState([{ role: "assistant", text: t.chat.greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const prevLang = useRef(lang);

  // Reset greeting when language changes, so the assistant's opener matches the UI language.
  useEffect(() => {
    if (prevLang.current !== lang) {
      setMessages([{ role: "assistant", text: t.chat.greeting }]);
      prevLang.current = lang;
    }
  }, [lang, t]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Roept onze eigen backend-route aan (/app/api/chat/route.js).
      // De Anthropic API-key blijft daar op de server, nooit in deze browsercode.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, langInstruction: t.chat.langInstruction }),
      });
      const data = await response.json();
      const reply = data.reply || data.error || t.chat.errorReply;
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: t.chat.errorCatch }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-card">
      <div className="chat-header">
        <div className="chat-dot" />
        <div>
          <p className="chat-header-title">{t.chat.headerTitle}</p>
          <p className="chat-header-sub">{t.chat.headerSub}</p>
        </div>
      </div>

      <div className="chat-body" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-bubble-assistant chat-typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder={t.chat.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="chat-send" onClick={sendMessage} disabled={loading} aria-label="Send">
          →
        </button>
      </div>
    </div>
  );
}

/* ---------------- FAQ Accordion ---------------- */
function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {t.faqSection.items.map((item, i) => (
        <div key={i} className="faq-item">
          <button className="faq-question" onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{item.q}</span>
            <span className="faq-icon">{open === i ? "−" : "+"}</span>
          </button>
          <div className="faq-answer" style={{ maxHeight: open === i ? "240px" : "0px" }}>
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Intake Form ---------------- */
function IntakeForm() {
  const { t } = useLang();
  const [form, setForm] = useState({
    naam: "",
    email: "",
    telefoon: "",
    leeftijd: "",
    geslacht: "",
    lengte: "",
    gewicht: "",
    bericht: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const bmi =
    form.lengte && form.gewicht
      ? (Number(form.gewicht) / Math.pow(Number(form.lengte) / 100, 2)).toFixed(1)
      : null;

  async function submit(e) {
    e.preventDefault();
    if (!form.naam || !form.email) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bmi }),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        setErrorMsg(data.error || t.intakeForm.errorGeneric);
        return;
      }
      setStatus("success");
      setForm({
        naam: "",
        email: "",
        telefoon: "",
        leeftijd: "",
        geslacht: "",
        lengte: "",
        gewicht: "",
        bericht: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMsg(t.intakeForm.errorCatch);
    }
  }

  if (status === "success") {
    return (
      <div className="intake-card intake-success">
        <div className="intake-success-icon">✓</div>
        <h3>
          {t.intakeForm.successTitlePre} {form.naam || t.intakeForm.successFallbackName} {t.intakeForm.successTitlePost}
        </h3>
        <p>{t.intakeForm.successBody}</p>
      </div>
    );
  }

  return (
    <form className="intake-card" onSubmit={submit} id="intake-form">
      <p className="bmi-eyebrow" style={{ color: "var(--copper)" }}>{t.intakeForm.eyebrow}</p>
      <h3 className="intake-title">{t.intakeForm.title}</h3>
      <p className="intake-sub">{t.intakeForm.sub}</p>

      <div className="intake-row">
        <label className="intake-label">
          {t.intakeForm.labelNaam}
          <input
            required
            type="text"
            value={form.naam}
            onChange={(e) => update("naam", e.target.value)}
            className="intake-input"
            placeholder={t.intakeForm.placeholderNaam}
          />
        </label>
      </div>

      <div className="intake-row intake-row-split">
        <label className="intake-label">
          {t.intakeForm.labelEmail}
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="intake-input"
            placeholder={t.intakeForm.placeholderEmail}
          />
        </label>
        <label className="intake-label">
          {t.intakeForm.labelTelefoon}
          <input
            type="tel"
            value={form.telefoon}
            onChange={(e) => update("telefoon", e.target.value)}
            className="intake-input"
            placeholder={t.intakeForm.placeholderTelefoon}
          />
        </label>
      </div>

      <div className="intake-row intake-row-split">
        <label className="intake-label">
          {t.intakeForm.labelLeeftijd}
          <input
            type="number"
            min="18"
            max="100"
            value={form.leeftijd}
            onChange={(e) => update("leeftijd", e.target.value)}
            className="intake-input"
            placeholder={t.intakeForm.placeholderLeeftijd}
          />
        </label>
        <label className="intake-label">
          {t.intakeForm.labelGeslacht}
          <select
            value={form.geslacht}
            onChange={(e) => update("geslacht", e.target.value)}
            className="intake-input"
          >
            <option value="">{t.intakeForm.geslachtChoose}</option>
            <option value="Vrouw">{t.intakeForm.geslachtVrouw}</option>
            <option value="Man">{t.intakeForm.geslachtMan}</option>
            <option value="Anders">{t.intakeForm.geslachtAnders}</option>
            <option value="Zeg ik liever niet">{t.intakeForm.geslachtZegIkNiet}</option>
          </select>
        </label>
      </div>

      <div className="intake-row intake-row-split">
        <label className="intake-label">
          {t.intakeForm.labelLengte}
          <input
            type="number"
            min="120"
            max="230"
            value={form.lengte}
            onChange={(e) => update("lengte", e.target.value)}
            className="intake-input"
            placeholder={t.intakeForm.placeholderLengte}
          />
        </label>
        <label className="intake-label">
          {t.intakeForm.labelGewicht}
          <input
            type="number"
            min="40"
            max="250"
            value={form.gewicht}
            onChange={(e) => update("gewicht", e.target.value)}
            className="intake-input"
            placeholder={t.intakeForm.placeholderGewicht}
          />
        </label>
      </div>

      {bmi && (
        <p className="intake-bmi-readout">
          {t.intakeForm.bmiReadout} <strong>{bmi}</strong>
        </p>
      )}

      <div className="intake-row">
        <label className="intake-label">
          {t.intakeForm.labelBericht}
          <textarea
            value={form.bericht}
            onChange={(e) => update("bericht", e.target.value)}
            className="intake-textarea"
            rows={4}
            placeholder={t.intakeForm.placeholderBericht}
          />
        </label>
      </div>

      {status === "error" && <p className="intake-error">{errorMsg}</p>}

      <button type="submit" className="btn-primary intake-submit" disabled={status === "sending"}>
        {status === "sending" ? t.intakeForm.submitSending : t.intakeForm.submitDefault}
      </button>
      <p className="intake-disclaimer">{t.intakeForm.disclaimer}</p>
    </form>
  );
}

/* ---------------- Main Page (inner, has access to lang context) ---------------- */
function PageInner() {
  const { t } = useLang();
  const [activeStep, setActiveStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }
        html { overflow-x: hidden; }
        .page {
          --ink: #2B2B26;
          --forest: #1B3A34;
          --forest-2: #234A42;
          --ivory: #F7F4ED;
          --copper: #C8754B;
          --copper-dark: #A84B2A;
          --sage: #8A9A8E;
          font-family: 'Inter', sans-serif;
          background: var(--ivory);
          color: var(--ink);
          min-height: 100vh;
          line-height: 1.5;
          overflow-x: hidden;
          width: 100%;
        }
        h1, h2, h3, .display {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--forest);
        }
        a { color: inherit; }
        button { font-family: 'Inter', sans-serif; cursor: pointer; }
        img, svg { max-width: 100%; }

        /* ---------- Language switcher ---------- */
        .lang-switcher { display: flex; gap: 0.3rem; align-items: center; }
        .lang-btn {
          background: none; border: 1px solid rgba(27,58,52,0.2); color: var(--forest);
          font-size: 0.72rem; font-weight: 600; padding: 0.3rem 0.55rem; border-radius: 100px;
          transition: background 0.2s, color 0.2s, border-color 0.2s; letter-spacing: 0.02em;
        }
        .lang-btn:hover { border-color: var(--copper); }
        .lang-btn-active { background: var(--forest); color: var(--ivory); border-color: var(--forest); }
        .footer .lang-btn { border-color: rgba(247,244,237,0.3); color: var(--ivory); }
        .footer .lang-btn-active { background: var(--copper); border-color: var(--copper); color: var(--ivory); }

        /* ---------- Nav ---------- */
        .nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          gap: 0.75rem;
          padding: 1.1rem clamp(1rem, 5vw, 4rem);
          background: rgba(247,244,237,0.92);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(27,58,52,0.08);
        }
        .nav-logo {
          font-family: 'Fraunces', serif; font-size: clamp(1.05rem, 3.4vw, 1.3rem); font-weight: 700;
          color: var(--forest); display:flex; align-items:center; gap:0.5rem; white-space: nowrap; flex-shrink: 0;
        }
        .nav-logo-mark { width: 10px; height: 10px; border-radius: 50%; background: var(--copper); display:inline-block; flex-shrink: 0; }
        .nav-links { display: flex; gap: 1.6rem; font-size: 0.92rem; font-weight: 500; }
        .nav-links a { text-decoration: none; opacity: 0.8; transition: opacity 0.2s; white-space: nowrap; }
        .nav-links a:hover { opacity: 1; color: var(--copper); }
        .nav-right { display: flex; align-items: center; gap: 0.9rem; flex-shrink: 0; }
        .nav-cta {
          background: var(--forest); color: var(--ivory); border: none;
          padding: 0.6rem 1.1rem; border-radius: 100px; font-size: 0.85rem; font-weight: 600;
          transition: background 0.2s; white-space: nowrap;
        }
        .nav-cta:hover { background: var(--copper); }
        @media (max-width: 860px) {
          .nav-links { display: none; }
        }
        @media (max-width: 520px) {
          .nav { padding: 0.85rem 1rem; }
          .nav-cta { padding: 0.55rem 0.85rem; font-size: 0.78rem; }
          .lang-btn { font-size: 0.66rem; padding: 0.26rem 0.45rem; }
        }

        /* ---------- Hero ---------- */
        .hero {
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem;
          padding: clamp(2rem,6vw,5rem) clamp(1rem,5vw,4rem) 4rem;
          align-items: center;
          max-width: 100%;
        }
        @media (max-width: 980px) { .hero { grid-template-columns: 1fr; } }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--copper-dark); margin-bottom: 1.1rem;
        }
        .hero-eyebrow::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--copper); flex-shrink: 0; }
        .hero h1 { font-size: clamp(2rem, 4.6vw, 3.7rem); line-height: 1.08; margin: 0 0 1.3rem; word-wrap: break-word; }
        .hero h1 em { color: var(--copper); font-style: normal; }
        .hero-sub { font-size: 1.02rem; color: rgba(43,43,38,0.78); max-width: 540px; margin-bottom: 1.8rem; }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary {
          background: var(--forest); color: var(--ivory); border: none;
          padding: 0.95rem 1.9rem; border-radius: 100px; font-weight: 600; font-size: 0.96rem;
          transition: transform 0.2s, background 0.2s; display: inline-block; text-align: center;
        }
        .btn-primary:hover { background: var(--copper); transform: translateY(-1px); }
        .btn-ghost {
          background: none; border: 1.5px solid rgba(27,58,52,0.25); color: var(--forest);
          padding: 0.95rem 1.9rem; border-radius: 100px; font-weight: 600; font-size: 0.96rem;
          transition: border-color 0.2s, background 0.2s; display: inline-block; text-align: center;
        }
        .btn-ghost:hover { border-color: var(--forest); background: rgba(27,58,52,0.04); }
        .hero-trust { display:flex; gap: 1.4rem; margin-top: 2.2rem; flex-wrap: wrap; }
        .hero-trust-item { font-size: 0.8rem; color: rgba(43,43,38,0.65); display:flex; align-items:center; gap:0.4rem; }
        .hero-trust-item strong { color: var(--forest); font-weight: 700; }

        /* ---------- BMI Card ---------- */
        .bmi-card {
          background: var(--forest); color: var(--ivory); border-radius: 22px;
          padding: clamp(1.4rem, 3vw, 2.3rem);
          box-shadow: 0 30px 60px -20px rgba(27,58,52,0.45);
          max-width: 100%;
        }
        .bmi-eyebrow { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--copper); font-weight: 700; margin: 0 0 0.3rem; }
        .bmi-title { color: var(--ivory); font-size: 1.5rem; margin: 0 0 1.4rem; }
        .bmi-label { display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.4rem; opacity: 0.85; }
        .bmi-value { font-weight: 700; color: var(--copper); }
        .bmi-range { width: 100%; accent-color: var(--copper); height: 4px; }
        .bmi-result { display: flex; align-items: center; gap: 1.2rem; margin: 1.8rem 0 1rem; }
        .bmi-gauge { flex: 1; min-width: 0; }
        .bmi-gauge-track { height: 8px; border-radius: 100px; background: rgba(247,244,237,0.15); overflow: hidden; }
        .bmi-gauge-fill { height: 100%; border-radius: 100px; transition: width 0.4s ease; }
        .bmi-readout { display: flex; flex-direction: column; align-items: flex-end; min-width: 80px; flex-shrink: 0; }
        .bmi-number { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 700; line-height: 1; }
        .bmi-category { font-size: 0.74rem; font-weight: 600; text-align: right; }
        .bmi-advice { font-size: 0.86rem; opacity: 0.9; margin: 0.6rem 0 1rem; min-height: 3.6em; }
        .bmi-disclaimer { font-size: 0.7rem; opacity: 0.55; border-top: 1px solid rgba(247,244,237,0.15); padding-top: 0.8rem; margin: 0; }

        /* ---------- Section shells ---------- */
        .section { padding: clamp(3rem, 6vw, 6rem) clamp(1rem, 5vw, 4rem); max-width: 100%; }
        .section-forest { background: var(--forest); color: var(--ivory); }
        .section-forest h2 { color: var(--ivory); }
        .section-eyebrow {
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--copper); margin-bottom: 0.8rem;
        }
        .section-head { max-width: 680px; margin-bottom: 2.6rem; }
        .section h2 { font-size: clamp(1.6rem, 3.2vw, 2.6rem); margin: 0 0 0.8rem; }
        .section-head p { color: rgba(43,43,38,0.7); font-size: 1.02rem; }
        .section-forest .section-head p { color: rgba(247,244,237,0.75); }

        /* ---------- About strip ---------- */
        .about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        @media (max-width: 860px) { .about-grid { grid-template-columns: 1fr; } }
        .about-card { border-top: 2px solid var(--copper); padding-top: 1.2rem; }
        .about-card h3 { font-size: 1.15rem; margin: 0 0 0.5rem; }
        .about-card p { font-size: 0.92rem; color: rgba(43,43,38,0.7); margin: 0; }

        /* ---------- Timeline (signature element) ---------- */
        .timeline-wrap { position: relative; max-width: 100%; }
        .timeline-track {
          display: flex; overflow-x: auto; gap: 0; padding-bottom: 1rem;
          scroll-snap-type: x proximity;
        }
        .timeline-track::-webkit-scrollbar { height: 5px; }
        .timeline-track::-webkit-scrollbar-thumb { background: rgba(247,244,237,0.3); border-radius: 10px; }
        .timeline-node {
          flex: 0 0 200px; scroll-snap-align: start; padding: 0 1.3rem 0 0; position: relative; cursor: pointer;
        }
        .timeline-rail { height: 2px; background: rgba(247,244,237,0.2); position: relative; margin-bottom: 1.4rem; }
        .timeline-rail-fill { position: absolute; top:0; left:0; height: 100%; background: var(--copper); transition: width 0.5s ease; }
        .timeline-dot {
          width: 13px; height: 13px; border-radius: 50%; background: var(--ivory); border: 2px solid var(--forest);
          position: absolute; top: -5.5px; transition: background 0.3s, border-color 0.3s, transform 0.3s;
        }
        .timeline-dot.active { background: var(--copper); border-color: var(--copper); transform: scale(1.25); }
        .timeline-num { font-family: 'Fraunces', serif; font-size: 0.85rem; color: var(--copper); font-weight: 700; }
        .timeline-node h3 { color: var(--ivory); font-size: 1.05rem; margin: 0.3rem 0 0.4rem; }
        .timeline-node p { font-size: 0.85rem; color: rgba(247,244,237,0.65); margin: 0; min-height: 4.4em; }
        .timeline-node.active h3 { color: var(--copper); }

        /* ---------- Pricing ---------- */
        .pricing-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 2.5rem; align-items: stretch; }
        @media (max-width: 920px) { .pricing-grid { grid-template-columns: 1fr; } }
        .pricing-card {
          background: var(--forest); color: var(--ivory); border-radius: 22px;
          padding: clamp(1.6rem, 3vw, 2.6rem); display: flex; flex-direction: column;
          box-shadow: 0 30px 60px -20px rgba(27,58,52,0.4);
        }
        .pricing-eyebrow { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--copper); font-weight: 700; margin: 0 0 0.8rem; }
        .pricing-amount { display: flex; align-items: baseline; gap: 0.4rem; margin-bottom: 0.6rem; flex-wrap: wrap; }
        .pricing-number { font-family: 'Fraunces', serif; font-size: clamp(2.4rem, 6vw, 3.4rem); font-weight: 700; line-height: 1; }
        .pricing-period { font-size: 1.05rem; opacity: 0.7; }
        .pricing-note { font-size: 0.86rem; opacity: 0.75; margin: 0 0 1.8rem; }
        .pricing-cta { margin-top: auto; background: var(--copper); text-align: center; }
        .pricing-cta:hover { background: var(--ivory); color: var(--forest); }
        .pricing-features { display: flex; flex-direction: column; gap: 1.4rem; justify-content: center; }
        .pricing-feature { border-top: 2px solid var(--copper); padding-top: 1rem; }
        .pricing-feature h4 { font-size: 1.05rem; color: var(--forest); margin: 0 0 0.4rem; }
        .pricing-feature p { font-size: 0.9rem; color: rgba(43,43,38,0.68); margin: 0; }

        /* ---------- AI section ---------- */
        .ai-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
        @media (max-width: 920px) { .ai-grid { grid-template-columns: 1fr; } }
        .ai-feature { display: flex; gap: 1rem; margin-bottom: 1.6rem; }
        .ai-feature-icon {
          width: 38px; height: 38px; border-radius: 10px; background: rgba(200,117,75,0.12);
          display:flex; align-items:center; justify-content:center; flex-shrink: 0; color: var(--copper); font-weight: 700;
        }
        .ai-feature h4 { margin: 0 0 0.3rem; font-size: 1rem; color: var(--forest); }
        .ai-feature p { margin: 0; font-size: 0.88rem; color: rgba(43,43,38,0.68); }

        /* Chat widget */
        .chat-card {
          background: #fff; border-radius: 20px; border: 1px solid rgba(27,58,52,0.08);
          box-shadow: 0 24px 50px -24px rgba(27,58,52,0.25); overflow: hidden;
          display: flex; flex-direction: column; height: 480px; max-width: 100%;
        }
        .chat-header { display: flex; align-items: center; gap: 0.7rem; padding: 1rem 1.3rem; border-bottom: 1px solid rgba(27,58,52,0.08); }
        .chat-dot { width: 9px; height: 9px; border-radius: 50%; background: #4caf6b; flex-shrink: 0; }
        .chat-header-title { margin: 0; font-weight: 700; font-size: 0.9rem; color: var(--forest); }
        .chat-header-sub { margin: 0; font-size: 0.74rem; color: rgba(43,43,38,0.5); }
        .chat-body { flex: 1; overflow-y: auto; padding: 1.1rem 1.3rem; display: flex; flex-direction: column; gap: 0.7rem; }
        .chat-bubble { max-width: 84%; padding: 0.65rem 0.95rem; border-radius: 14px; font-size: 0.87rem; line-height: 1.45; word-wrap: break-word; }
        .chat-bubble-assistant { background: var(--ivory); color: var(--ink); align-self: flex-start; border-bottom-left-radius: 4px; }
        .chat-bubble-user { background: var(--forest); color: var(--ivory); align-self: flex-end; border-bottom-right-radius: 4px; }
        .chat-typing { display: flex; gap: 4px; padding: 0.85rem 1rem; }
        .chat-typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--sage); animation: blink 1.2s infinite ease-in-out; }
        .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
        .chat-input-row { display: flex; gap: 0.6rem; padding: 0.9rem; border-top: 1px solid rgba(27,58,52,0.08); }
        .chat-input {
          flex: 1; min-width: 0; border: 1px solid rgba(27,58,52,0.15); border-radius: 100px; padding: 0.65rem 1.1rem;
          font-size: 0.87rem; font-family: 'Inter', sans-serif; outline: none;
        }
        .chat-input:focus { border-color: var(--copper); }
        .chat-send {
          width: 38px; height: 38px; border-radius: 50%; border: none; background: var(--forest);
          color: var(--ivory); font-size: 1rem; flex-shrink: 0;
        }
        .chat-send:hover { background: var(--copper); }
        .chat-send:disabled { opacity: 0.5; }

        /* ---------- Testimonials ---------- */
        .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.6rem; }
        @media (max-width: 920px) { .testi-grid { grid-template-columns: 1fr; } }
        .testi-card { background: #fff; border-radius: 16px; padding: 1.8rem; border: 1px solid rgba(27,58,52,0.07); }
        .testi-quote { font-family: 'Fraunces', serif; font-size: 1.05rem; color: var(--forest); margin: 0 0 1rem; line-height: 1.4; }
        .testi-name { font-size: 0.82rem; font-weight: 700; color: var(--copper-dark); }
        .testi-stars { color: var(--copper); margin-bottom: 0.6rem; font-size: 0.85rem; }

        /* ---------- FAQ ---------- */
        .faq-list { max-width: 740px; }
        .faq-item { border-bottom: 1px solid rgba(27,58,52,0.1); }
        .faq-question {
          width: 100%; background: none; border: none; display: flex; justify-content: space-between; align-items: center;
          padding: 1.2rem 0; font-size: 1rem; font-weight: 600; color: var(--forest); text-align: left; gap: 1rem;
        }
        .faq-icon { color: var(--copper); font-size: 1.3rem; font-weight: 400; flex-shrink: 0; margin-left: 1rem; }
        .faq-answer { overflow: hidden; transition: max-height 0.35s ease; }
        .faq-answer p { font-size: 0.92rem; color: rgba(43,43,38,0.72); padding-bottom: 1.2rem; margin: 0; max-width: 620px; }

        /* ---------- Intake Form ---------- */
        .intake-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3rem; align-items: start; }
        @media (max-width: 920px) { .intake-grid { grid-template-columns: 1fr; } }
        .intake-card {
          background: #fff; border-radius: 20px; padding: clamp(1.4rem, 3vw, 2.3rem);
          border: 1px solid rgba(27,58,52,0.08); box-shadow: 0 24px 50px -24px rgba(27,58,52,0.2);
          max-width: 100%;
        }
        .intake-title { font-size: 1.5rem; margin: 0 0 0.4rem; }
        .intake-sub { font-size: 0.9rem; color: rgba(43,43,38,0.65); margin: 0 0 1.6rem; }
        .intake-row { margin-bottom: 1.1rem; }
        .intake-row-split { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 520px) { .intake-row-split { grid-template-columns: 1fr; } }
        .intake-label { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; color: var(--forest); }
        .intake-input, .intake-textarea {
          font-family: 'Inter', sans-serif; font-size: 0.92rem; padding: 0.7rem 0.9rem;
          border: 1px solid rgba(27,58,52,0.18); border-radius: 10px; outline: none; resize: none;
          font-weight: 400; color: var(--ink); background: var(--ivory); width: 100%; min-width: 0;
        }
        select.intake-input { appearance: none; cursor: pointer; }
        .intake-input:focus, .intake-textarea:focus { border-color: var(--copper); background: #fff; }
        .intake-bmi-readout {
          font-size: 0.85rem; color: var(--forest); background: rgba(200,117,75,0.1);
          border-radius: 8px; padding: 0.55rem 0.8rem; margin: -0.2rem 0 1.1rem; display: inline-block;
        }
        .intake-bmi-readout strong { color: var(--copper-dark); }
        .intake-submit { width: 100%; border: none; margin-top: 0.4rem; }
        .intake-submit:disabled { opacity: 0.6; cursor: default; }
        .intake-disclaimer { font-size: 0.74rem; color: rgba(43,43,38,0.5); margin-top: 0.9rem; text-align: center; }
        .intake-error { color: var(--copper-dark); font-size: 0.85rem; margin: 0 0 0.8rem; }
        .intake-success { text-align: center; padding: 3rem 1.5rem; }
        .intake-success-icon {
          width: 52px; height: 52px; border-radius: 50%; background: var(--forest); color: var(--ivory);
          display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin: 0 auto 1.2rem;
        }
        .intake-success h3 { font-size: 1.3rem; margin: 0 0 0.6rem; }
        .intake-success p { color: rgba(43,43,38,0.65); font-size: 0.92rem; margin: 0; }

        /* ---------- Final CTA ---------- */
        .cta-final {
          background: var(--copper); color: var(--ivory); border-radius: 24px;
          padding: clamp(2.2rem, 5vw, 4rem); text-align: center; margin: 0 clamp(1rem,5vw,4rem) 0;
        }
        .cta-final h2 { color: var(--ivory); }
        .cta-final p { color: rgba(247,244,237,0.85); max-width: 480px; margin: 0 auto 1.6rem; }
        .cta-final .btn-primary { background: var(--forest); }
        .cta-final .btn-primary:hover { background: var(--ink); }

        /* ---------- Footer ---------- */
        .footer {
          padding: 3rem clamp(1rem,5vw,4rem) 2rem; background: var(--forest); color: rgba(247,244,237,0.7);
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; font-size: 0.85rem;
          margin-top: 3rem;
        }
        .footer-logo { font-family: 'Fraunces', serif; font-size: 1.2rem; color: var(--ivory); margin-bottom: 0.5rem; }
        .footer-col h5 { color: var(--ivory); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.7rem; }
        .footer-col a { display: block; text-decoration: none; opacity: 0.8; margin-bottom: 0.4rem; }
        .footer-col a:hover { color: var(--copper); opacity: 1; }
        .footer-bottom { text-align: center; font-size: 0.75rem; opacity: 0.5; margin-top: 2rem; width: 100%; }
        .footer-lang { display: flex; flex-direction: column; gap: 0.7rem; }

        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo"><span className="nav-logo-mark" />BMI Bewust</div>
        <div className="nav-links">
          {t.nav.links.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </div>
        <div className="nav-right">
          <LangSwitcher />
          <a href="#intake-form" className="nav-cta">{t.nav.cta}</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <Reveal>
            <span className="hero-eyebrow">{t.hero.eyebrow}</span>
            <h1>{t.hero.titlePre}<em>{t.hero.titleEm}</em>{t.hero.titlePost}</h1>
            <p className="hero-sub">{t.hero.sub}</p>
            <div className="hero-actions">
              <a href="#intake-form" className="btn-primary">{t.hero.ctaPrimary}</a>
              <a href="#hero-bmi" className="btn-ghost">{t.hero.ctaGhost}</a>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-item"><strong>{t.hero.trust1n}</strong> {t.hero.trust1}</span>
              <span className="hero-trust-item"><strong>{t.hero.trust2n}</strong> {t.hero.trust2}</span>
              <span className="hero-trust-item"><strong>{t.hero.trust3n}</strong> {t.hero.trust3}</span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <div id="hero-bmi">
            <BmiCalculator />
          </div>
        </Reveal>
      </section>

      {/* ABOUT STRIP */}
      <section className="section" style={{ paddingTop: "1rem" }}>
        <Reveal>
          <div className="about-grid">
            {t.about.map((card) => (
              <div className="about-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* TIMELINE */}
      <section className="section section-forest" id="hoe-werkt-het">
        <Reveal>
          <div className="section-head">
            <p className="section-eyebrow">{t.timeline.eyebrow}</p>
            <h2>{t.timeline.title}</h2>
            <p>{t.timeline.sub}</p>
          </div>
        </Reveal>
        <div className="timeline-wrap">
          <div className="timeline-track">
            {t.timeline.steps.map((s, i) => (
              <div
                key={s.n}
                className={`timeline-node ${i === activeStep ? "active" : ""}`}
                onMouseEnter={() => setActiveStep(i)}
              >
                <div className="timeline-rail">
                  <div className="timeline-rail-fill" style={{ width: i <= activeStep ? "100%" : "0%" }} />
                  <div className={`timeline-dot ${i === activeStep ? "active" : ""}`} style={{ left: "0%" }} />
                </div>
                <span className="timeline-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="prijzen">
        <Reveal>
          <div className="section-head">
            <p className="section-eyebrow">{t.pricing.eyebrow}</p>
            <h2>{t.pricing.title}</h2>
            <p>{t.pricing.sub}</p>
          </div>
        </Reveal>
        <div className="pricing-grid">
          <Reveal>
            <div className="pricing-card">
              <p className="pricing-eyebrow">{t.pricing.cardEyebrow}</p>
              <div className="pricing-amount">
                <span className="pricing-number">{t.pricing.price}</span>
              </div>
              <p className="pricing-note">{t.pricing.note}</p>
              <a href="#intake-form" className="btn-primary pricing-cta">{t.pricing.cta}</a>
            </div>
          </Reveal>
          <div className="pricing-features">
            {t.pricing.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="pricing-feature">
                  <h4>{f.title}</h4>
                  <p>{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AI INTAKE */}
      <section className="section" id="ai-intake">
        <Reveal>
          <div className="section-head">
            <p className="section-eyebrow">{t.aiSection.eyebrow}</p>
            <h2>{t.aiSection.title}</h2>
            <p>{t.aiSection.sub}</p>
          </div>
        </Reveal>
        <div className="ai-grid">
          <Reveal>
            <div>
              {t.aiSection.features.map((f) => (
                <div className="ai-feature" key={f.title}>
                  <div className="ai-feature-icon">{f.icon}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <AiIntakeChat />
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="verhalen">
        <Reveal>
          <div className="section-head">
            <p className="section-eyebrow">{t.testimonials.eyebrow}</p>
            <h2>{t.testimonials.title}</h2>
          </div>
        </Reveal>
        <div className="testi-grid">
          {t.testimonials.items.map((item, i) => (
            <Reveal key={item.name + i} delay={i * 100}>
              <div className="testi-card">
                <div className="testi-stars">★★★★★</div>
                <p className="testi-quote">&ldquo;{item.quote}&rdquo;</p>
                <p className="testi-name">{item.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* INTAKE FORM */}
      <section className="section">
        <div className="intake-grid">
          <Reveal>
            <div>
              <p className="section-eyebrow">{t.intakeSection.eyebrow}</p>
              <h2 style={{ marginBottom: "1rem" }}>{t.intakeSection.title}</h2>
              <p style={{ color: "rgba(43,43,38,0.7)", marginBottom: "1.6rem", maxWidth: 420 }}>
                {t.intakeSection.sub}
              </p>
              <div className="hero-trust">
                <span className="hero-trust-item"><strong>{t.intakeSection.trust1n}</strong> {t.intakeSection.trust1}</span>
                <span className="hero-trust-item"><strong>{t.intakeSection.trust2n}</strong> {t.intakeSection.trust2}</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <IntakeForm />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <Reveal>
          <div className="section-head">
            <p className="section-eyebrow">{t.faqSection.eyebrow}</p>
            <h2>{t.faqSection.title}</h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <Faq />
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "0 0 4rem" }}>
        <Reveal>
          <div className="cta-final">
            <h2>{t.finalCta.title}</h2>
            <p>{t.finalCta.sub}</p>
            <a href="#intake-form" className="btn-primary">{t.finalCta.cta}</a>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <div className="footer-logo">BMI Bewust</div>
        </div>
        <div className="footer-col">
          <h5>{t.footer.contactTitle}</h5>
          <a href="mailto:info@bmibewust.nl">info@bmibewust.nl</a>
          <a href="https://api.whatsapp.com/send?phone=%2B31623475784">06-23475784</a>
        </div>
        <div className="footer-col">
          <h5>{t.footer.socialsTitle}</h5>
          <a href="https://instagram.com/bmibewust">Instagram</a>
          <a href="https://facebook.com/bmibewust">Facebook</a>
        </div>
        <div className="footer-col footer-lang">
          <h5>Language</h5>
          <LangSwitcher />
        </div>
        <p className="footer-bottom">{t.footer.bottom}</p>
      </footer>
    </div>
  );
}

/* ---------------- Exported root: wraps page in the language provider ---------------- */
export default function BmiBewustSite() {
  return (
    <LangProvider>
      <PageInner />
    </LangProvider>
  );
}
