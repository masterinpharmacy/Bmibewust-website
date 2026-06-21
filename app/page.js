"use client";

import React, { useState, useRef, useEffect } from "react";

/* ---------- Design tokens ----------
  ink:      #2B2B26  (near-black text)
  forest:   #1B3A34  (deep clinical green)
  ivory:    #F7F4ED  (background)
  copper:   #C8754B  (signature accent)
  sage:     #8A9A8E  (secondary / muted)
  forest-2: #234A42  (lighter forest for hover states)
-------------------------------------- */

const STEPS = [
  { n: "01", title: "Aanmelding", body: "Je vult het intakeformulier in. Binnen 24 uur plannen we een afspraak." },
  { n: "02", title: "Intakegesprek", body: "We bespreken leefstijl, eetpatroon en motivatie. Jij stelt het doel." },
  { n: "03", title: "Gezondheidscheck", body: "Buikomvang, vetpercentage en bloedwaarden geven een volledig beeld." },
  { n: "04", title: "Behandelplan", body: "De huisarts bepaalt of medicatie een passende aanvulling is." },
  { n: "05", title: "Begeleiding", body: "Beweegplan, voedingsadvies en medicatie — samen, niet los van elkaar." },
  { n: "06", title: "Check na 2 weken", body: "We evalueren bijwerkingen en stellen bij waar nodig." },
  { n: "07", title: "Controle na 12 weken", body: "Resultaten worden besproken en de therapie wordt herijkt." },
  { n: "08", title: "Resultaat", body: "Na 3 tot 12 maanden een gezonder lichaam — en een leefstijl die blijft." },
];

const FAQ_SEED = [
  { q: "Wat kost een traject bij BMI Bewust?", a: "De intake en gezondheidscheck zijn vast geprijsd; medicatiekosten zijn apart en hangen af van het voorschrift. Tijdens het intakegesprek krijg je een volledig kostenoverzicht voordat je iets beslist." },
  { q: "Wordt dit vergoed door mijn zorgverzekering?", a: "GLP-1 medicatie wordt in Nederland alleen vergoed bij een medische indicatie zoals diabetes type 2, vastgesteld door je huisarts. Bij gewichtsverlies zonder die indicatie betaal je zelf. We bespreken dit altijd vooraf." },
  { q: "Is dit veilig in vergelijking met online bestellen?", a: "Bij ons krijg je medicatiebewaking door een apotheker, monitoring van bijwerkingen door een huisarts en een plan dat past bij je bloedwaarden. Bij anonieme onlineverkoop ontbreekt dat volledig." },
  { q: "Hoeveel kan ik kwijtraken?", a: "Dat verschilt per persoon. Eerdere trajecten laten resultaten zien tussen 8 en 15% lichaamsgewicht in 3 tot 12 maanden, in combinatie met leefstijlverandering." },
];

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
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(88);
  const bmi = weight / Math.pow(height / 100, 2);
  const bmiRounded = Math.round(bmi * 10) / 10;

  let category, color, advice;
  if (bmi < 18.5) {
    category = "Ondergewicht";
    color = "#8A9A8E";
    advice = "Een traject gericht op gewichtsverlies is hier niet aan de orde. Neem contact op met je huisarts voor passend advies.";
  } else if (bmi < 25) {
    category = "Gezond gewicht";
    color = "#1B3A34";
    advice = "Je BMI valt binnen een gezonde marge. Wil je toch werken aan leefstijl of lichaamssamenstelling? Een intake kan nog steeds nuttig zijn.";
  } else if (bmi < 30) {
    category = "Overgewicht";
    color = "#C8754B";
    advice = "Bij deze BMI kan een begeleid traject met leefstijlcoaching al veel betekenen. Medicatie is meestal niet de eerste stap.";
  } else {
    category = "Obesitas";
    color = "#A84B2A";
    advice = "Bij deze BMI is medische begeleiding relevant. Een combinatie van leefstijl en eventueel medicatie kan worden overwogen, in overleg met de huisarts.";
  }

  const pct = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));

  return (
    <div className="bmi-card">
      <p className="bmi-eyebrow">Direct resultaat</p>
      <h3 className="bmi-title">Bereken je BMI</h3>

      <div className="bmi-sliders">
        <label className="bmi-label">
          <span>Lengte</span>
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
          <span>Gewicht</span>
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
          <span className="bmi-category" style={{ color }}>{category}</span>
        </div>
      </div>

      <p className="bmi-advice">{advice}</p>
      <p className="bmi-disclaimer">
        Een BMI-berekening is een indicatie, geen diagnose. Alleen een huisarts kan een medisch advies geven dat past bij jouw situatie.
      </p>
    </div>
  );
}

/* ---------------- AI Intake Chat (functional, calls Claude API) ---------------- */
function AiIntakeChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hoi, ik ben de digitale intake-assistent van BMI Bewust. Ik kan je alvast vragen beantwoorden over het traject, medicatie of de procedure. Ik vervang geen huisarts en geef geen medisch advies — voor een echte beoordeling plannen we een afspraak. Waarmee kan ik je op weg helpen?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

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
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      const reply = data.reply || data.error || "Sorry, daar ging iets mis. Kun je het opnieuw proberen?";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Er ging iets mis bij het ophalen van een antwoord. Probeer het nog eens." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-card">
      <div className="chat-header">
        <div className="chat-dot" />
        <div>
          <p className="chat-header-title">Digitale intake-assistent</p>
          <p className="chat-header-sub">Stelt geen diagnose · verwijst naar je arts</p>
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
          placeholder="Stel je vraag…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="chat-send" onClick={sendMessage} disabled={loading} aria-label="Verstuur">
          →
        </button>
      </div>
    </div>
  );
}

/* ---------------- FAQ Accordion ---------------- */
function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {FAQ_SEED.map((item, i) => (
        <div key={i} className="faq-item">
          <button className="faq-question" onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{item.q}</span>
            <span className="faq-icon">{open === i ? "−" : "+"}</span>
          </button>
          <div className="faq-answer" style={{ maxHeight: open === i ? "200px" : "0px" }}>
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Intake Form ---------------- */
function IntakeForm() {
  const [form, setForm] = useState({ naam: "", email: "", telefoon: "", bericht: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.naam || !form.email) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Er ging iets mis. Probeer het opnieuw.");
        return;
      }
      setStatus("success");
      setForm({ naam: "", email: "", telefoon: "", bericht: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg("Er ging iets mis. Probeer het opnieuw of mail ons direct.");
    }
  }

  if (status === "success") {
    return (
      <div className="intake-card intake-success">
        <div className="intake-success-icon">✓</div>
        <h3>Bedankt, {form.naam || "je aanmelding"} is verzonden!</h3>
        <p>We nemen binnen 24 uur contact met je op om een afspraak in te plannen.</p>
      </div>
    );
  }

  return (
    <form className="intake-card" onSubmit={submit} id="intake-form">
      <p className="bmi-eyebrow" style={{ color: "var(--copper)" }}>Plan je intake</p>
      <h3 className="intake-title">Meld je hier aan</h3>
      <p className="intake-sub">Vul je gegevens in, dan nemen we binnen 24 uur contact met je op.</p>

      <div className="intake-row">
        <label className="intake-label">
          Naam *
          <input
            required
            type="text"
            value={form.naam}
            onChange={(e) => update("naam", e.target.value)}
            className="intake-input"
            placeholder="Jouw volledige naam"
          />
        </label>
      </div>

      <div className="intake-row intake-row-split">
        <label className="intake-label">
          E-mail *
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="intake-input"
            placeholder="naam@email.nl"
          />
        </label>
        <label className="intake-label">
          Telefoon
          <input
            type="tel"
            value={form.telefoon}
            onChange={(e) => update("telefoon", e.target.value)}
            className="intake-input"
            placeholder="06 12345678"
          />
        </label>
      </div>

      <div className="intake-row">
        <label className="intake-label">
          Vertel kort over je situatie
          <textarea
            value={form.bericht}
            onChange={(e) => update("bericht", e.target.value)}
            className="intake-textarea"
            rows={4}
            placeholder="Bijvoorbeeld: wat je hoopt te bereiken, of je al ervaring hebt met dit type traject..."
          />
        </label>
      </div>

      {status === "error" && <p className="intake-error">{errorMsg}</p>}

      <button type="submit" className="btn-primary intake-submit" disabled={status === "sending"}>
        {status === "sending" ? "Versturen…" : "Verstuur aanmelding"}
      </button>
      <p className="intake-disclaimer">
        Door dit formulier te versturen ga je akkoord dat we contact met je opnemen over je aanmelding. Dit vervangt geen medisch advies.
      </p>
    </form>
  );
}

/* ---------------- Main Page ---------------- */
export default function BmiBewustSite() {
  const [activeStep, setActiveStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }
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
        }
        h1, h2, h3, .display {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--forest);
        }
        a { color: inherit; }
        button { font-family: 'Inter', sans-serif; cursor: pointer; }

        /* ---------- Nav ---------- */
        .nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem clamp(1.25rem, 5vw, 4rem);
          background: rgba(247,244,237,0.92);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(27,58,52,0.08);
        }
        .nav-logo { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 700; color: var(--forest); display:flex; align-items:center; gap:0.5rem;}
        .nav-logo-mark { width: 10px; height: 10px; border-radius: 50%; background: var(--copper); display:inline-block; }
        .nav-links { display: flex; gap: 2rem; font-size: 0.92rem; font-weight: 500; }
        .nav-links a { text-decoration: none; opacity: 0.8; transition: opacity 0.2s; }
        .nav-links a:hover { opacity: 1; color: var(--copper); }
        .nav-cta {
          background: var(--forest); color: var(--ivory); border: none;
          padding: 0.65rem 1.4rem; border-radius: 100px; font-size: 0.88rem; font-weight: 600;
          transition: background 0.2s;
        }
        .nav-cta:hover { background: var(--copper); }
        .nav-burger { display: none; background: none; border: none; font-size: 1.5rem; color: var(--forest); }
        @media (max-width: 860px) {
          .nav-links { display: none; }
          .nav-burger { display: block; }
        }

        /* ---------- Hero ---------- */
        .hero {
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem;
          padding: clamp(2.5rem,6vw,5rem) clamp(1.25rem,5vw,4rem) 4rem;
          align-items: center;
        }
        @media (max-width: 980px) { .hero { grid-template-columns: 1fr; } }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--copper-dark); margin-bottom: 1.1rem;
        }
        .hero-eyebrow::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--copper); }
        .hero h1 { font-size: clamp(2.4rem, 4.6vw, 3.7rem); line-height: 1.05; margin: 0 0 1.3rem; }
        .hero h1 em { color: var(--copper); font-style: normal; }
        .hero-sub { font-size: 1.08rem; color: rgba(43,43,38,0.78); max-width: 540px; margin-bottom: 1.8rem; }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary {
          background: var(--forest); color: var(--ivory); border: none;
          padding: 0.95rem 1.9rem; border-radius: 100px; font-weight: 600; font-size: 0.96rem;
          transition: transform 0.2s, background 0.2s;
        }
        .btn-primary:hover { background: var(--copper); transform: translateY(-1px); }
        .btn-ghost {
          background: none; border: 1.5px solid rgba(27,58,52,0.25); color: var(--forest);
          padding: 0.95rem 1.9rem; border-radius: 100px; font-weight: 600; font-size: 0.96rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-ghost:hover { border-color: var(--forest); background: rgba(27,58,52,0.04); }
        .hero-trust { display:flex; gap: 1.8rem; margin-top: 2.2rem; flex-wrap: wrap; }
        .hero-trust-item { font-size: 0.82rem; color: rgba(43,43,38,0.65); display:flex; align-items:center; gap:0.4rem; }
        .hero-trust-item strong { color: var(--forest); font-weight: 700; }

        /* ---------- BMI Card ---------- */
        .bmi-card {
          background: var(--forest); color: var(--ivory); border-radius: 22px;
          padding: clamp(1.6rem, 3vw, 2.3rem);
          box-shadow: 0 30px 60px -20px rgba(27,58,52,0.45);
        }
        .bmi-eyebrow { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--copper); font-weight: 700; margin: 0 0 0.3rem; }
        .bmi-title { color: var(--ivory); font-size: 1.5rem; margin: 0 0 1.4rem; }
        .bmi-label { display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.4rem; opacity: 0.85; }
        .bmi-value { font-weight: 700; color: var(--copper); }
        .bmi-range {
          width: 100%; accent-color: var(--copper); height: 4px;
        }
        .bmi-result { display: flex; align-items: center; gap: 1.2rem; margin: 1.8rem 0 1rem; }
        .bmi-gauge { flex: 1; }
        .bmi-gauge-track { height: 8px; border-radius: 100px; background: rgba(247,244,237,0.15); overflow: hidden; }
        .bmi-gauge-fill { height: 100%; border-radius: 100px; transition: width 0.4s ease; }
        .bmi-readout { display: flex; flex-direction: column; align-items: flex-end; min-width: 92px; }
        .bmi-number { font-family: 'Fraunces', serif; font-size: 2.1rem; font-weight: 700; line-height: 1; }
        .bmi-category { font-size: 0.78rem; font-weight: 600; }
        .bmi-advice { font-size: 0.88rem; opacity: 0.9; margin: 0.6rem 0 1rem; min-height: 3.6em; }
        .bmi-disclaimer { font-size: 0.72rem; opacity: 0.55; border-top: 1px solid rgba(247,244,237,0.15); padding-top: 0.8rem; margin: 0; }

        /* ---------- Section shells ---------- */
        .section { padding: clamp(3rem, 6vw, 6rem) clamp(1.25rem, 5vw, 4rem); }
        .section-forest { background: var(--forest); color: var(--ivory); }
        .section-forest h2 { color: var(--ivory); }
        .section-eyebrow {
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--copper); margin-bottom: 0.8rem;
        }
        .section-head { max-width: 680px; margin-bottom: 2.6rem; }
        .section h2 { font-size: clamp(1.8rem, 3.2vw, 2.6rem); margin: 0 0 0.8rem; }
        .section-head p { color: rgba(43,43,38,0.7); font-size: 1.02rem; }
        .section-forest .section-head p { color: rgba(247,244,237,0.75); }

        /* ---------- About strip ---------- */
        .about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        @media (max-width: 860px) { .about-grid { grid-template-columns: 1fr; } }
        .about-card { border-top: 2px solid var(--copper); padding-top: 1.2rem; }
        .about-card h3 { font-size: 1.15rem; margin: 0 0 0.5rem; }
        .about-card p { font-size: 0.92rem; color: rgba(43,43,38,0.7); margin: 0; }

        /* ---------- Timeline (signature element) ---------- */
        .timeline-wrap { position: relative; }
        .timeline-track {
          display: flex; overflow-x: auto; gap: 0; padding-bottom: 1rem;
          scroll-snap-type: x proximity;
        }
        .timeline-track::-webkit-scrollbar { height: 5px; }
        .timeline-track::-webkit-scrollbar-thumb { background: rgba(247,244,237,0.3); border-radius: 10px; }
        .timeline-node {
          flex: 0 0 220px; scroll-snap-align: start; padding: 0 1.3rem 0 0; position: relative; cursor: pointer;
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
          display: flex; flex-direction: column; height: 480px;
        }
        .chat-header { display: flex; align-items: center; gap: 0.7rem; padding: 1rem 1.3rem; border-bottom: 1px solid rgba(27,58,52,0.08); }
        .chat-dot { width: 9px; height: 9px; border-radius: 50%; background: #4caf6b; }
        .chat-header-title { margin: 0; font-weight: 700; font-size: 0.9rem; color: var(--forest); }
        .chat-header-sub { margin: 0; font-size: 0.74rem; color: rgba(43,43,38,0.5); }
        .chat-body { flex: 1; overflow-y: auto; padding: 1.1rem 1.3rem; display: flex; flex-direction: column; gap: 0.7rem; }
        .chat-bubble { max-width: 84%; padding: 0.65rem 0.95rem; border-radius: 14px; font-size: 0.87rem; line-height: 1.45; }
        .chat-bubble-assistant { background: var(--ivory); color: var(--ink); align-self: flex-start; border-bottom-left-radius: 4px; }
        .chat-bubble-user { background: var(--forest); color: var(--ivory); align-self: flex-end; border-bottom-right-radius: 4px; }
        .chat-typing { display: flex; gap: 4px; padding: 0.85rem 1rem; }
        .chat-typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--sage); animation: blink 1.2s infinite ease-in-out; }
        .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
        .chat-input-row { display: flex; gap: 0.6rem; padding: 0.9rem; border-top: 1px solid rgba(27,58,52,0.08); }
        .chat-input {
          flex: 1; border: 1px solid rgba(27,58,52,0.15); border-radius: 100px; padding: 0.65rem 1.1rem;
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
        .testi-card {
          background: #fff; border-radius: 16px; padding: 1.8rem; border: 1px solid rgba(27,58,52,0.07);
        }
        .testi-quote { font-family: 'Fraunces', serif; font-size: 1.05rem; color: var(--forest); margin: 0 0 1rem; line-height: 1.4; }
        .testi-name { font-size: 0.82rem; font-weight: 700; color: var(--copper-dark); }
        .testi-stars { color: var(--copper); margin-bottom: 0.6rem; font-size: 0.85rem; }

        /* ---------- FAQ ---------- */
        .faq-list { max-width: 740px; }
        .faq-item { border-bottom: 1px solid rgba(27,58,52,0.1); }
        .faq-question {
          width: 100%; background: none; border: none; display: flex; justify-content: space-between; align-items: center;
          padding: 1.2rem 0; font-size: 1rem; font-weight: 600; color: var(--forest); text-align: left;
        }
        .faq-icon { color: var(--copper); font-size: 1.3rem; font-weight: 400; flex-shrink: 0; margin-left: 1rem; }
        .faq-answer { overflow: hidden; transition: max-height 0.35s ease; }
        .faq-answer p { font-size: 0.92rem; color: rgba(43,43,38,0.72); padding-bottom: 1.2rem; margin: 0; max-width: 620px; }

        /* ---------- Intake Form ---------- */
        .intake-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3rem; align-items: start; }
        @media (max-width: 920px) { .intake-grid { grid-template-columns: 1fr; } }
        .intake-card {
          background: #fff; border-radius: 20px; padding: clamp(1.6rem, 3vw, 2.3rem);
          border: 1px solid rgba(27,58,52,0.08); box-shadow: 0 24px 50px -24px rgba(27,58,52,0.2);
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
          font-weight: 400; color: var(--ink); background: var(--ivory);
        }
        .intake-input:focus, .intake-textarea:focus { border-color: var(--copper); background: #fff; }
        .intake-submit { width: 100%; border: none; margin-top: 0.4rem; }
        .intake-submit:disabled { opacity: 0.6; cursor: default; }
        .intake-disclaimer { font-size: 0.74rem; color: rgba(43,43,38,0.5); margin-top: 0.9rem; text-align: center; }
        .intake-error { color: var(--copper-dark); font-size: 0.85rem; margin: 0 0 0.8rem; }
        .intake-success { text-align: center; padding: 3rem 2rem; }
        .intake-success-icon {
          width: 52px; height: 52px; border-radius: 50%; background: var(--forest); color: var(--ivory);
          display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin: 0 auto 1.2rem;
        }
        .intake-success h3 { font-size: 1.3rem; margin: 0 0 0.6rem; }
        .intake-success p { color: rgba(43,43,38,0.65); font-size: 0.92rem; margin: 0; }

        /* ---------- Final CTA ---------- */
        .cta-final {
          background: var(--copper); color: var(--ivory); border-radius: 24px;
          padding: clamp(2.4rem, 5vw, 4rem); text-align: center; margin: 0 clamp(1.25rem,5vw,4rem) 0;
        }
        .cta-final h2 { color: var(--ivory); }
        .cta-final p { color: rgba(247,244,237,0.85); max-width: 480px; margin: 0 auto 1.6rem; }
        .cta-final .btn-primary { background: var(--forest); }
        .cta-final .btn-primary:hover { background: var(--ink); }

        /* ---------- Footer ---------- */
        .footer {
          padding: 3rem clamp(1.25rem,5vw,4rem) 2rem; background: var(--forest); color: rgba(247,244,237,0.7);
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; font-size: 0.85rem;
          margin-top: 3rem;
        }
        .footer-logo { font-family: 'Fraunces', serif; font-size: 1.2rem; color: var(--ivory); margin-bottom: 0.5rem; }
        .footer-col h5 { color: var(--ivory); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.7rem; }
        .footer-col a { display: block; text-decoration: none; opacity: 0.8; margin-bottom: 0.4rem; }
        .footer-col a:hover { color: var(--copper); opacity: 1; }
        .footer-bottom { text-align: center; font-size: 0.75rem; opacity: 0.5; margin-top: 2rem; width: 100%; }

        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo"><span className="nav-logo-mark" />BMI Bewust</div>
        <div className="nav-links">
          <a href="#hoe-werkt-het">Hoe het werkt</a>
          <a href="#ai-intake">AI-intake</a>
          <a href="#verhalen">Ervaringen</a>
          <a href="#faq">Vragen</a>
        </div>
        <a href="#intake-form" className="nav-cta">Plan intake</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <Reveal>
            <span className="hero-eyebrow">Onder begeleiding van huisarts &amp; apotheker</span>
            <h1>Afvallen als <em>medische</em>, niet als esthetische keuze.</h1>
            <p className="hero-sub">
              Overgewicht is vaak het gevolg van jaren disbalans — lichamelijk, hormonaal, mentaal.
              Wij combineren leefstijlbegeleiding met verantwoord voorgeschreven medicatie zoals Ozempic,
              Wegovy en Mounjaro, met medicatiebewaking die je online nergens anders krijgt.
            </p>
            <div className="hero-actions">
              <a href="#intake-form" className="btn-primary">Start je intake</a>
              <a href="#hero-bmi" className="btn-ghost">Bereken je BMI ↓</a>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-item"><strong>24u</strong> reactietijd</span>
              <span className="hero-trust-item"><strong>100%</strong> huisarts-gemonitord</span>
              <span className="hero-trust-item"><strong>8 stappen</strong> volledig traject</span>
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
            <div className="about-card">
              <h3>Niet de symptomen, de oorzaak</h3>
              <p>We behandelen gewicht als signaal van onderliggende disbalans — niet als uiterlijk vraagstuk.</p>
            </div>
            <div className="about-card">
              <h3>Apotheker én huisarts</h3>
              <p>Elk traject loopt via de reguliere zorg: medicatiebewaking, bijwerkingencontrole, een vast aanspreekpunt.</p>
            </div>
            <div className="about-card">
              <h3>Resultaat met motivatie</h3>
              <p>Medicatie ondersteunt. Gedragsverandering en jouw inzet bepalen of het resultaat blijft.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* TIMELINE */}
      <section className="section section-forest" id="hoe-werkt-het">
        <Reveal>
          <div className="section-head">
            <p className="section-eyebrow">Het traject</p>
            <h2>Acht stappen, één duidelijke route</h2>
            <p>Geen verrassingen. Elke fase bouwt voort op de vorige, met controle op vaste momenten.</p>
          </div>
        </Reveal>
        <div className="timeline-wrap">
          <div className="timeline-track">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className={`timeline-node ${i === activeStep ? "active" : ""}`}
                onMouseEnter={() => setActiveStep(i)}
              >
                <div className="timeline-rail">
                  <div
                    className="timeline-rail-fill"
                    style={{ width: i <= activeStep ? "100%" : "0%" }}
                  />
                  <div
                    className={`timeline-dot ${i === activeStep ? "active" : ""}`}
                    style={{ left: i === 0 ? "0%" : "0%" }}
                  />
                </div>
                <span className="timeline-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI INTAKE */}
      <section className="section" id="ai-intake">
        <Reveal>
          <div className="section-head">
            <p className="section-eyebrow">Voor je eerste afspraak</p>
            <h2>Stel je vragen, dag en nacht</h2>
            <p>Onze digitale intake-assistent beantwoordt voorlichtingsvragen vooraf, zodat je gesprek met de huisarts direct de diepte in kan.</p>
          </div>
        </Reveal>
        <div className="ai-grid">
          <Reveal>
            <div>
              <div className="ai-feature">
                <div className="ai-feature-icon">?</div>
                <div>
                  <h4>Voorlichting, geen diagnose</h4>
                  <p>Vragen over het traject, medicatie en procedure worden direct beantwoord — een medische beoordeling blijft bij de huisarts.</p>
                </div>
              </div>
              <div className="ai-feature">
                <div className="ai-feature-icon">⏱</div>
                <div>
                  <h4>Altijd beschikbaar</h4>
                  <p>Geen wachttijd voor een eerste antwoord. Twijfel je of dit traject iets voor je is? Vraag het nu.</p>
                </div>
              </div>
              <div className="ai-feature">
                <div className="ai-feature-icon">→</div>
                <div>
                  <h4>Vloeiende overdracht</h4>
                  <p>Wat je hier bespreekt, helpt je voorbereiden — het vervangt het intakegesprek niet, het versterkt het.</p>
                </div>
              </div>
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
            <p className="section-eyebrow">Wat anderen ervaarden</p>
            <h2>Verhalen uit de praktijk</h2>
          </div>
        </Reveal>
        <div className="testi-grid">
          <Reveal>
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">"Uitermate tevreden over de persoonlijke aandacht en deskundigheid. Een echte aanrader."</p>
              <p className="testi-name">B. Bos</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">"Na het consult werd ik ingesteld op Ozempic. Drie maanden later van 80 naar 69 kg bij 1,70m."</p>
              <p className="testi-name">E. Timmermans</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">"De apotheek begeleidde me goed bij Mounjaro. Na vier weken voelde ik me al veel fitter."</p>
              <p className="testi-name">Anoniem</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTAKE FORM */}
      <section className="section">
        <div className="intake-grid">
          <Reveal>
            <div>
              <p className="section-eyebrow">Klaar voor de eerste stap</p>
              <h2 style={{ marginBottom: "1rem" }}>Meld je aan voor een intake</h2>
              <p style={{ color: "rgba(43,43,38,0.7)", marginBottom: "1.6rem", maxWidth: 420 }}>
                Na je aanmelding nemen we binnen 24 uur contact met je op om een afspraak te plannen
                met de huisarts. Geen verplichtingen, gewoon een goed gesprek over wat bij jouw situatie past.
              </p>
              <div className="hero-trust">
                <span className="hero-trust-item"><strong>24u</strong> reactietijd</span>
                <span className="hero-trust-item"><strong>Vrijblijvend</strong> gesprek</span>
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
            <p className="section-eyebrow">Veelgestelde vragen</p>
            <h2>Voordat je begint</h2>
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
            <h2>Klaar om het roer om te gooien?</h2>
            <p>Meld je aan en we plannen binnen 24 uur een afspraak om jouw situatie te bespreken.</p>
            <a href="#intake-form" className="btn-primary">Meld je nu aan</a>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <div className="footer-logo">BMI Bewust</div>
          <p style={{ maxWidth: 260, fontSize: "0.82rem" }}>Burg. de Zeeuwstraat 22, 3281AJ Numansdorp</p>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <a href="mailto:info@bmibewust.nl">info@bmibewust.nl</a>
          <a href="https://api.whatsapp.com/send?phone=%2B31623475784">06-23475784</a>
        </div>
        <div className="footer-col">
          <h5>Socials</h5>
          <a href="https://instagram.com/bmibewust">Instagram</a>
          <a href="https://facebook.com/bmibewust">Facebook</a>
        </div>
        <p className="footer-bottom">© 2025–2026 BMI Bewust — Medische begeleiding bij gewichtsverlies, via huisarts en apotheek.</p>
      </footer>
    </div>
  );
}
