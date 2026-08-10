import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/quiz")({
  component: IolaQuiz,
  head: () => ({
    meta: [
      { title: "iola Speak: English Practice — Desbloquea tu potencial en inglés" },
      { name: "description", content: "Obtén un plan de aprendizaje de inglés personalizado con IA. Cuestionario de 3 minutos." },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    ],
  }),
});

// ─── Types ───────────────────────────────────────────────────────────────────
interface QuizState {
  language: string;
  name: string;
  level: string;
  studyMethod: string[];
  goal: string;
  difficulties: string[];
  topics: string[];
  practiceTime: string;
  vocabA1: string[];
  vocabB1: string[];
  vocabC1: string[];
  email: string;
  selectedPlan: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const GREEN = "#AEEA00";
const DARK = "#0A0A0F";
const CARD = "#12121A";
const TEXT = "#FFFFFF";
const MUTED = "#888899";

const LANGUAGES = [
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "pt", flag: "🇧🇷", name: "Português" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "it", flag: "🇮🇹", name: "Italiano" },
  { code: "zh", flag: "🇨🇳", name: "Chinese" },
  { code: "uk", flag: "🇺🇦", name: "Українська" },
  { code: "pl", flag: "🇵🇱", name: "Polish" },
  { code: "ro", flag: "🇷🇴", name: "Romanian" },
  { code: "tr", flag: "🇹🇷", name: "Turkish" },
  { code: "ar", flag: "🇸🇦", name: "العربية" },
  { code: "ja", flag: "🇯🇵", name: "日本語" },
];

const TOPICS = [
  { icon: "🪂", label: "Aventura" },
  { icon: "🎨", label: "Arte" },
  { icon: "👠", label: "Belleza y estilo" },
  { icon: "💰", label: "Negocios" },
  { icon: "💼", label: "Carrera profesional" },
  { icon: "👋", label: "Vida diaria" },
  { icon: "🏥", label: "Medicina" },
  { icon: "🗽", label: "Viajes" },
  { icon: "🥑", label: "Comida" },
  { icon: "🏋️", label: "Deporte y fitness" },
  { icon: "📱", label: "Redes sociales" },
  { icon: "💻", label: "Negocios digitales" },
];

const VOCAB_A1 = ["because", "booking", "excellent", "pay", "strawberry", "usual", "wife", "yesterday"];
const VOCAB_B1 = ["avoid", "charisma", "emphasize", "excitement", "impact", "maintain", "stunning", "trustworthy"];
const VOCAB_C1 = ["ascertain", "frolic", "opaque", "opulent", "proprietary", "scrutinize", "tranquility", "viability"];

const GRAMMAR_QUESTIONS = [
  {
    question: 'My brother ___ eleven years old.',
    options: ["are", "is", "be", "am"],
    correct: "is",
  },
  {
    question: 'We ___ to school every morning.',
    options: ["go", "goes", "is going", "gone"],
    correct: "go",
  },
  {
    question: 'Look! The children ___ football in the yard.',
    options: ["played", "have played", "play", "are playing"],
    correct: "are playing",
  },
];

const PLANS = [
  {
    id: "week",
    label: "1 semana",
    save: "AHORRA 40%",
    originalTotal: "$14.99",
    saleTotal: "$8.99",
    perDay: "$1.28",
    popular: false,
  },
  {
    id: "month",
    label: "1 mes",
    save: "AHORRA 50%",
    originalTotal: "$29.99",
    saleTotal: "$14.99",
    perDay: "$0.50",
    popular: true,
  },
  {
    id: "quarter",
    label: "3 meses",
    save: "AHORRA 49%",
    originalTotal: "$69.99",
    saleTotal: "$34.99",
    perDay: "$0.39",
    popular: false,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getLevelLabel(level: string) {
  if (level === "beginner") return "A2";
  if (level === "intermediate") return "B1";
  return "B2";
}

function getNextLevel(level: string) {
  if (level === "beginner") return "B1";
  if (level === "intermediate") return "B2";
  return "C1";
}

function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}

// ─── Small components ─────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: i <= current ? 24 : 10,
              height: 10,
              borderRadius: 5,
              background: i <= current ? GREEN : "#333",
              transition: "all .3s",
            }}
          />
          {i < total - 1 && <div style={{ width: 20, height: 2, background: i < current ? GREEN : "#333" }} />}
        </div>
      ))}
    </div>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  style,
  secondary,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  secondary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "16px 0",
        borderRadius: 50,
        border: "none",
        fontWeight: 700,
        fontSize: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "#333" : secondary ? "transparent" : GREEN,
        color: disabled ? MUTED : secondary ? MUTED : "#000",
        transition: "all .2s",
        outline: secondary ? `1px solid ${MUTED}` : "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function OptionCard({
  selected,
  onClick,
  children,
  style,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "14px 18px",
        borderRadius: 16,
        border: `1.5px solid ${selected ? GREEN : "#2a2a3a"}`,
        background: selected ? "rgba(174,234,0,0.08)" : CARD,
        color: TEXT,
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "all .2s",
        fontWeight: 500,
        fontSize: 15,
        ...style,
      }}
    >
      {children}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: `2px solid ${selected ? GREEN : "#444"}`,
          background: selected ? GREEN : "transparent",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && <span style={{ color: "#000", fontSize: 11, fontWeight: 700 }}>✓</span>}
      </div>
    </button>
  );
}

function CountdownTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(remaining / 60).toString().padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");
  return (
    <span style={{ color: "#FF4444", fontWeight: 700 }}>
      {m}:{s}
    </span>
  );
}

// ─── Screens ─────────────────────────────────────────────────────────────────

function ScreenIntro({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      {/* Logo */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${GREEN}, #00D4FF)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 20,
            color: "#000",
          }}
        >
          i
        </div>
        <span style={{ fontSize: 20, fontWeight: 700 }}>iola Speak</span>
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.25, marginBottom: 14 }}>
        Desbloquea tu potencial en inglés
      </h1>
      <p style={{ color: GREEN, fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
        Obtén un plan de aprendizaje personalizado adaptado a tus objetivos
      </p>
      <div
        style={{
          display: "inline-block",
          background: "rgba(174,234,0,0.1)",
          border: `1px solid ${GREEN}`,
          borderRadius: 20,
          padding: "6px 16px",
          fontSize: 12,
          fontWeight: 700,
          color: GREEN,
          marginBottom: 32,
          letterSpacing: 1,
        }}
      >
        CUESTIONARIO DE 3 MINUTOS
      </div>

      {/* Avatar illustration */}
      <div
        style={{
          position: "relative",
          width: "80%",
          maxWidth: 280,
          margin: "0 auto 32px",
          borderRadius: 24,
          overflow: "hidden",
          background: "linear-gradient(180deg, #1a1a2e 0%, #12121A 100%)",
          padding: 24,
          border: "1px solid #2a2a3a",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 12 }}>🤖</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          <div
            style={{
              background: "#2a2a3a",
              borderRadius: "16px 16px 16px 4px",
              padding: "10px 16px",
              fontSize: 14,
              alignSelf: "flex-end",
            }}
          >
            Hi! How are you? 👋
          </div>
          <div
            style={{
              background: GREEN,
              color: "#000",
              borderRadius: "16px 16px 4px 16px",
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Ready to learn! 🎯
          </div>
        </div>
      </div>

      <Btn onClick={onNext}>Comenzar ahora →</Btn>
    </div>
  );
}

function ScreenLanguage({
  selected,
  onSelect,
  onNext,
}: {
  selected: string;
  onSelect: (l: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <ProgressDots total={4} current={0} />
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
        ¿Cuál es tu idioma nativo?
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            style={{
              padding: "14px 8px",
              borderRadius: 14,
              border: `1.5px solid ${selected === lang.code ? GREEN : "#2a2a3a"}`,
              background: selected === lang.code ? "rgba(174,234,0,0.1)" : CARD,
              cursor: "pointer",
              textAlign: "center",
              transition: "all .2s",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 4 }}>{lang.flag}</div>
            <div style={{ fontSize: 12, color: TEXT, fontWeight: 500 }}>{lang.name}</div>
            {selected === lang.code && (
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: GREEN,
                  color: "#000",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✓
              </div>
            )}
          </button>
        ))}
      </div>
      <Btn onClick={onNext} disabled={!selected}>
        Siguiente
      </Btn>
    </div>
  );
}

function ScreenName({
  name,
  onName,
  onNext,
  onSkip,
}: {
  name: string;
  onName: (n: string) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div>
      <ProgressDots total={4} current={0} />
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>¿Cómo te llamas?</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => onName(e.target.value)}
        style={{
          width: "100%",
          padding: "16px 18px",
          borderRadius: 14,
          border: `1.5px solid ${name ? GREEN : "#2a2a3a"}`,
          background: CARD,
          color: TEXT,
          fontSize: 16,
          outline: "none",
          marginBottom: 16,
          boxSizing: "border-box",
        }}
      />
      <Btn onClick={onNext} disabled={!name.trim()}>
        Siguiente
      </Btn>
      <button
        onClick={onSkip}
        style={{
          width: "100%",
          marginTop: 12,
          background: "none",
          border: "none",
          color: MUTED,
          fontSize: 14,
          cursor: "pointer",
          padding: "8px 0",
        }}
      >
        Saltar
      </button>
    </div>
  );
}

function ScreenTransition({ name, onNext }: { name: string; onNext: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: GREEN, fontWeight: 600, marginBottom: 8 }}>
        {name ? `¡Bienvenido, ${name}!` : "¡Bienvenido a bordo!"}
      </p>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>
        Vamos a crear tu <span style={{ color: GREEN }}>plan personal</span>
      </h2>
      {/* S-curve animation */}
      <svg viewBox="0 0 280 160" style={{ width: "100%", maxWidth: 280, margin: "0 auto 32px", display: "block" }}>
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={GREEN} />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
        <path
          d="M 20 140 C 60 140 80 100 140 80 C 180 65 220 30 260 20"
          fill="none"
          stroke="url(#curveGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="140" cy="80" r="8" fill={GREEN} />
        <rect x="0" y="0" width="280" height="160" fill="none" stroke="#2a2a3a" strokeWidth="1" rx="4" />
        <line x1="0" y1="53" x2="280" y2="53" stroke="#2a2a3a" strokeWidth="0.5" />
        <line x1="0" y1="106" x2="280" y2="106" stroke="#2a2a3a" strokeWidth="0.5" />
        <line x1="93" y1="0" x2="93" y2="160" stroke="#2a2a3a" strokeWidth="0.5" />
        <line x1="186" y1="0" x2="186" y2="160" stroke="#2a2a3a" strokeWidth="0.5" />
      </svg>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenLevel({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  const opts = [
    { value: "beginner", icon: "🔴", label: "Sé un poco" },
    { value: "intermediate", icon: "🟡", label: "Puedo tener una conversación sencilla" },
    { value: "advanced", icon: "🟢", label: "Hablo con confianza" },
  ];
  return (
    <div>
      <ProgressDots total={4} current={1} />
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
        ¿Qué tan bien dominas el inglés?
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {opts.map((o) => (
          <OptionCard key={o.value} selected={selected === o.value} onClick={() => onSelect(o.value)}>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>{o.icon}</span>
              {o.label}
            </span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function ScreenStudyMethod({
  selected,
  onToggle,
  onNext,
}: {
  selected: string[];
  onToggle: (v: string) => void;
  onNext: () => void;
}) {
  const opts = [
    { icon: "🎒", label: "En la escuela" },
    { icon: "🎓", label: "En la universidad" },
    { icon: "🌍", label: "Estudiar en el extranjero" },
    { icon: "✏️", label: "Con un tutor" },
    { icon: "💻", label: "Con aplicaciones" },
  ];
  return (
    <div>
      <ProgressDots total={4} current={1} />
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
        ¿Cómo has estudiado inglés?
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {opts.map((o) => (
          <OptionCard
            key={o.label}
            selected={selected.includes(o.label)}
            onClick={() => onToggle(o.label)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>{o.icon}</span>
              {o.label}
            </span>
          </OptionCard>
        ))}
      </div>
      <Btn onClick={onNext} disabled={selected.length === 0}>
        Siguiente
      </Btn>
    </div>
  );
}

function ScreenBrainScience({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        Aprender idiomas ejercita el cerebro
      </h2>
      <div
        style={{
          background: CARD,
          borderRadius: 20,
          padding: "28px 24px",
          marginBottom: 24,
          border: "1px solid #2a2a3a",
        }}
      >
        <div style={{ fontSize: 60, marginBottom: 16 }}>💡</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
          <div>
            <div style={{ color: GREEN, fontSize: 28, fontWeight: 800 }}>+35%</div>
            <div style={{ color: MUTED, fontSize: 13 }}>Enfoque y<br />flexibilidad</div>
          </div>
          <div>
            <div style={{ color: GREEN, fontSize: 28, fontWeight: 800 }}>+50%</div>
            <div style={{ color: MUTED, fontSize: 13 }}>Memoria</div>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: MUTED }}>
          📊 Fuente: Linck et al., 2014 / Bialystock & Martin, 2014
        </div>
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenGoal({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  const opts = [
    { icon: "✈️", label: "Vacaciones" },
    { icon: "💼", label: "Trabajo" },
    { icon: "🗽", label: "Planes de vivir en el extranjero" },
    { icon: "🐱", label: "Hacer amigos" },
    { icon: "🍿", label: "Diversión" },
    { icon: "✅", label: "Aprobar un examen" },
  ];
  return (
    <div>
      <ProgressDots total={4} current={1} />
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
        ¿Por qué quieres aprender inglés?
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {opts.map((o) => (
          <OptionCard key={o.label} selected={selected === o.label} onClick={() => onSelect(o.label)}>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>{o.icon}</span>
              {o.label}
            </span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function ScreenTrust({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Estás en buenas manos</h2>
      <div style={{ position: "relative", height: 200, marginBottom: 24 }}>
        {/* Venn diagram */}
        <svg viewBox="0 0 280 200" style={{ width: "100%", height: "100%" }}>
          <circle cx="140" cy="80" r="65" fill="rgba(174,234,0,0.08)" stroke={GREEN} strokeWidth="1.5" />
          <circle cx="95" cy="145" r="65" fill="rgba(0,212,255,0.06)" stroke="#00D4FF" strokeWidth="1.5" />
          <circle cx="185" cy="145" r="65" fill="rgba(155,93,229,0.06)" stroke="#9B5DE5" strokeWidth="1.5" />
          <text x="140" y="55" textAnchor="middle" fill={TEXT} fontSize="10" fontWeight="600">Lecciones</text>
          <text x="140" y="68" textAnchor="middle" fill={TEXT} fontSize="10" fontWeight="600">de video</text>
          <text x="60" y="170" textAnchor="middle" fill={TEXT} fontSize="10" fontWeight="600">Inteligencia</text>
          <text x="60" y="183" textAnchor="middle" fill={TEXT} fontSize="10" fontWeight="600">Artificial</text>
          <text x="220" y="170" textAnchor="middle" fill={TEXT} fontSize="10" fontWeight="600">Método</text>
          <text x="220" y="183" textAnchor="middle" fill={TEXT} fontSize="10" fontWeight="600">científico</text>
          {/* Center logo */}
          <circle cx="140" cy="118" r="22" fill="#1a1a2e" stroke={GREEN} strokeWidth="1.5" />
          <text x="140" y="123" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="900">iola</text>
        </svg>
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenDifficulties({
  selected,
  onToggle,
  onNext,
}: {
  selected: string[];
  onToggle: (v: string) => void;
  onNext: () => void;
}) {
  const opts = [
    { icon: "🗿", label: "Falta de práctica" },
    { icon: "🎙️", label: "Miedo a hablar" },
    { icon: "👄", label: "Pronunciación" },
    { icon: "🎧", label: "Escucha y comprensión" },
    { icon: "📖", label: "Vocabulario" },
  ];
  return (
    <div>
      <ProgressDots total={4} current={2} />
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Dificultades</h2>
      <p style={{ color: MUTED, textAlign: "center", marginBottom: 20, fontSize: 14 }}>
        Selecciona las que apliquen
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {opts.map((o) => (
          <OptionCard
            key={o.label}
            selected={selected.includes(o.label)}
            onClick={() => onToggle(o.label)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>{o.icon}</span>
              {o.label}
            </span>
          </OptionCard>
        ))}
      </div>
      <Btn onClick={onNext} disabled={selected.length === 0}>
        Siguiente
      </Btn>
    </div>
  );
}

function ScreenDifficultyExplanation({
  difficulty,
  onNext,
}: {
  difficulty: string;
  onNext: () => void;
}) {
  const explanations: Record<string, { title: string; body: string }> = {
    "Miedo a hablar": {
      title: "Miedo a hablar",
      body: "¿Sabes inglés pero te cuesta hablarlo? Practica cualquier tema con nuestros compañeros virtuales de IA y recibe comentarios inmediatos sobre tu gramática y pronunciación. Sin juicios, sin presión.",
    },
    Pronunciación: {
      title: "Pronunciación",
      body: "Nuestra IA analiza cada sonido que produces y te da retroalimentación fonética instantánea. Compara tu pronunciación con hablantes nativos y mejora rápidamente.",
    },
    "Falta de práctica": {
      title: "Falta de práctica",
      body: "Con solo 15 minutos al día, iola te mantiene en práctica constante. Lecciones cortas, situaciones reales, y una IA que se adapta a tu ritmo.",
    },
    "Escucha y comprensión": {
      title: "Escucha y comprensión",
      body: "Entrena tu oído con videos auténticos de hablantes nativos en diferentes contextos. Tu cerebro aprende a procesar el inglés real, no el de los libros.",
    },
    Vocabulario: {
      title: "Vocabulario",
      body: "Aprende más de 8.500 palabras con repetición espaciada. El sistema recuerda qué palabras necesitas repasar y las presenta en el momento perfecto para que no las olvides.",
    },
  };
  const exp = explanations[difficulty] || {
    title: difficulty,
    body: "iola Speak te ayuda a superar este obstáculo con ejercicios personalizados y retroalimentación de IA en tiempo real.",
  };
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🤖</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: GREEN }}>{exp.title}</h2>
      <p style={{ color: MUTED, lineHeight: 1.7, marginBottom: 32, fontSize: 15 }}>{exp.body}</p>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenSpacedRepetition({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Cómo aprende tu cerebro</h2>
      <div
        style={{
          background: CARD,
          borderRadius: 20,
          padding: "28px 24px",
          marginBottom: 24,
          border: "1px solid #2a2a3a",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 24, alignItems: "flex-end", marginBottom: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>🧠</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>Estudio<br />regular</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64 }}>🧠</div>
            <div
              style={{
                fontSize: 12,
                color: GREEN,
                marginTop: 6,
                fontWeight: 600,
              }}
            >
              Repetición<br />espaciada
            </div>
          </div>
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: GREEN }}>2x</div>
        <div style={{ fontWeight: 600, marginTop: 4 }}>Retención a largo plazo del material</div>
        <div style={{ marginTop: 12, fontSize: 11, color: MUTED }}>
          📊 Fuente: Linck et al., 2014 / Bialystock & Martin, 2014
        </div>
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenTopics({
  selected,
  onToggle,
  onNext,
}: {
  selected: string[];
  onToggle: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <ProgressDots total={4} current={2} />
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
        Elige los temas que te interesen
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
        {TOPICS.map((t) => (
          <button
            key={t.label}
            onClick={() => onToggle(t.label)}
            style={{
              padding: "14px 8px",
              borderRadius: 14,
              border: `1.5px solid ${selected.includes(t.label) ? GREEN : "#2a2a3a"}`,
              background: selected.includes(t.label) ? "rgba(174,234,0,0.1)" : CARD,
              cursor: "pointer",
              textAlign: "center",
              transition: "all .2s",
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 4 }}>{t.icon}</div>
            <div style={{ fontSize: 11, color: TEXT, fontWeight: 500, lineHeight: 1.3 }}>{t.label}</div>
          </button>
        ))}
      </div>
      <Btn onClick={onNext} disabled={selected.length === 0}>
        Siguiente
      </Btn>
    </div>
  );
}

function ScreenSocialProof({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28 }}>¡Estás en buena compañía!</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {[
          { value: "500k+", label: "Estudiantes" },
          { value: "10,000+", label: "★★★★★ valoraciones" },
          { value: "4.8", label: "Promedio de calificación" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              background: CARD,
              borderRadius: 16,
              padding: "18px 24px",
              border: "1px solid #2a2a3a",
            }}
          >
            <span style={{ fontSize: 28 }}>🏆</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: GREEN }}>{item.value}</div>
              <div style={{ fontSize: 13, color: MUTED }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenPracticeTime({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}) {
  const opts = [
    { value: "30", label: "30 minutos por día" },
    { value: "15", label: "15 minutos por día" },
    { value: "5", label: "5 minutos por día" },
  ];
  return (
    <div>
      <ProgressDots total={4} current={2} />
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
        ¿Cuál es tu objetivo de práctica diaria?
      </h2>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <svg viewBox="0 0 280 100" style={{ width: "100%", maxWidth: 280, margin: "0 auto" }}>
          <path d="M 20 90 C 80 90 120 20 260 10" fill="none" stroke={GREEN} strokeWidth="2" />
          <path d="M 20 90 C 80 85 130 40 260 20" fill="none" stroke="#00D4FF" strokeWidth="2" opacity="0.6" />
          <path d="M 20 90 C 100 88 160 60 260 40" fill="none" stroke="#9B5DE5" strokeWidth="2" opacity="0.4" />
          <text x="20" y="98" fill={MUTED} fontSize="10">Hoy</text>
          <text x="230" y="98" fill={MUTED} fontSize="10">1 mes</text>
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {opts.map((o) => (
          <OptionCard key={o.value} selected={selected === o.value} onClick={() => onSelect(o.value)}>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>⏱️</span>
              {o.label}
            </span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function ScreenReadyForTest({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <ProgressDots total={4} current={3} />
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
        ¿Listo para una prueba rápida?
      </h2>
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(174,234,0,0.2) 0%, transparent 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: 64,
        }}
      >
        🧠
      </div>
      <p style={{ color: MUTED, marginBottom: 32, lineHeight: 1.6 }}>
        Obtén una estimación de tu nivel de vocabulario y gramática
      </p>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenVocabTest({
  words,
  selected,
  onToggle,
  onNext,
  level,
}: {
  words: string[];
  selected: string[];
  onToggle: (w: string) => void;
  onNext: () => void;
  level: string;
}) {
  return (
    <div>
      <ProgressDots total={4} current={3} />
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, textAlign: "center" }}>
        Selecciona las palabras que conozcas
      </h2>
      <p style={{ color: GREEN, textAlign: "center", marginBottom: 20, fontWeight: 600, fontSize: 14 }}>
        {level}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
        {words.map((w) => (
          <button
            key={w}
            onClick={() => onToggle(w)}
            style={{
              padding: "10px 18px",
              borderRadius: 50,
              border: `1.5px solid ${selected.includes(w) ? GREEN : "#2a2a3a"}`,
              background: selected.includes(w) ? "rgba(174,234,0,0.15)" : CARD,
              color: selected.includes(w) ? GREEN : TEXT,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              transition: "all .2s",
            }}
          >
            {w}
          </button>
        ))}
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenGrammar({
  q,
  qIndex,
  total,
  onAnswer,
}: {
  q: { question: string; options: string[]; correct: string };
  qIndex: number;
  total: number;
  onAnswer: (ans: string) => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  const handleSelect = (opt: string) => {
    if (chosen) return;
    setChosen(opt);
    setTimeout(() => onAnswer(opt), 600);
  };

  const sentence = q.question.split("___");

  return (
    <div>
      <ProgressDots total={4} current={3} />
      <p style={{ color: MUTED, textAlign: "center", marginBottom: 16, fontSize: 13 }}>
        Pregunta {qIndex + 1} de {total}
      </p>
      <div
        style={{
          background: CARD,
          borderRadius: 16,
          padding: "20px",
          marginBottom: 24,
          textAlign: "center",
          lineHeight: 1.8,
          fontSize: 16,
        }}
      >
        {sentence[0]}
        <span
          style={{
            display: "inline-block",
            minWidth: 100,
            borderBottom: `2px solid ${GREEN}`,
            margin: "0 4px",
            height: 20,
          }}
        />
        {sentence[1]}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt) => {
          const isCorrect = opt === q.correct;
          const isChosen = opt === chosen;
          let bg = CARD;
          let border = "#2a2a3a";
          let color = TEXT;
          if (chosen) {
            if (isCorrect) { bg = "rgba(174,234,0,0.15)"; border = GREEN; color = GREEN; }
            else if (isChosen) { bg = "rgba(255,68,68,0.1)"; border = "#FF4444"; color = "#FF4444"; }
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: 14,
                border: `1.5px solid ${border}`,
                background: bg,
                color,
                textAlign: "center",
                cursor: chosen ? "default" : "pointer",
                fontWeight: 600,
                fontSize: 15,
                transition: "all .2s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScreenTestComplete({
  level,
  onNext,
}: {
  level: string;
  onNext: () => void;
}) {
  const currentLevel = getLevelLabel(level);
  const nextLevel = getNextLevel(level);
  const targetDate = addDays(30);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 8, letterSpacing: 1 }}>
        🎉 ¡PRUEBA COMPLETADA!
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Tu nivel estimado</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 24 }}>
        <div>
          <div style={{ color: MUTED, fontSize: 12, marginBottom: 4 }}>Tu nivel estimado</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: TEXT }}>{currentLevel}</div>
        </div>
        <div>
          <div style={{ color: MUTED, fontSize: 12, marginBottom: 4 }}>Próximo hito</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: GREEN }}>{nextLevel}</div>
        </div>
      </div>
      {/* Progress chart */}
      <div
        style={{
          background: CARD,
          borderRadius: 16,
          padding: "20px",
          marginBottom: 28,
          border: "1px solid #2a2a3a",
        }}
      >
        <svg viewBox="0 0 260 100" style={{ width: "100%" }}>
          <path d="M 30 80 C 80 78 130 50 230 20" fill="none" stroke="#2a2a3a" strokeWidth="2" strokeDasharray="4" />
          <path d="M 30 80 C 80 78 130 50 230 20" fill="none" stroke={GREEN} strokeWidth="3" strokeDasharray="200" strokeDashoffset="100" />
          <circle cx="30" cy="80" r="8" fill={GREEN} />
          <text x="30" y="96" textAnchor="middle" fill={MUTED} fontSize="9">Hoy</text>
          <circle cx="230" cy="20" r="8" fill="#00D4FF" />
          <text x="230" y="14" textAnchor="middle" fill="#00D4FF" fontSize="9">{targetDate}</text>
        </svg>
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenWhatToExpect({ slide, onNext }: { slide: number; onNext: () => void }) {
  const slides = [
    { period: "Semana 1", value: "120", unit: "nuevas palabras", emoji: "👋", scenario: "Conocer gente nueva" },
    { period: "Semana 4", value: "24", unit: "nuevas frases", emoji: "🍽️", scenario: "Realizar un pedido en un restaurante" },
    { period: "Mes 12", value: "", unit: "Habla con fluidez", emoji: "🌎", scenario: "Hablar en diferentes situaciones" },
  ];
  const s = slides[slide % slides.length];
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Qué puedes esperar</h2>
      <div
        style={{
          background: CARD,
          borderRadius: 20,
          padding: "28px 24px",
          marginBottom: 24,
          border: "1px solid #2a2a3a",
        }}
      >
        <div style={{ color: GREEN, fontWeight: 700, marginBottom: 8, fontSize: 14 }}>{s.period}</div>
        {s.value && <div style={{ fontSize: 48, fontWeight: 800, color: TEXT, marginBottom: 4 }}>{s.value}</div>}
        <div style={{ color: MUTED, marginBottom: 20, fontSize: 15 }}>{s.unit}</div>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{s.emoji}</div>
        <div style={{ color: GREEN, fontSize: 12, marginBottom: 4 }}>Aprende a</div>
        <div style={{ fontWeight: 600 }}>{s.scenario}</div>
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenAIChat({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);
  const messages = [
    "📈 Impulsor de confianza. Una miniserie original muestra cómo mantener la calma y el control incluso cuando la palabra correcta se escapa.",
    "🎯 Mejora de gramática — próximo hito. Lecciones breves con teoría, práctica y chats con compañeros de IA te llevan sin esfuerzo al siguiente nivel.",
    "⏱️ ¡A continuación, dividiremos tu programa en sesiones diarias de práctica de 15 minutos!",
  ];

  useEffect(() => {
    if (step < messages.length) {
      const timer = setTimeout(() => setStep((s) => s + 1), 1400);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const ready = step >= messages.length;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>Toques finales</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24, minHeight: 200 }}>
        {messages.slice(0, step).map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${GREEN}, #00D4FF)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              🤖
            </div>
            <div
              style={{
                background: CARD,
                borderRadius: "16px 16px 16px 4px",
                padding: "12px 16px",
                fontSize: 14,
                lineHeight: 1.6,
                color: TEXT,
                border: "1px solid #2a2a3a",
                animation: "fadeIn .4s ease-out",
              }}
            >
              {msg}
            </div>
          </div>
        ))}
        {step < messages.length && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${GREEN}, #00D4FF)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              🤖
            </div>
            <div
              style={{
                background: CARD,
                borderRadius: "16px 16px 16px 4px",
                padding: "12px 20px",
                border: "1px solid #2a2a3a",
              }}
            >
              <div style={{ display: "flex", gap: 5, alignItems: "center", height: 20 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: GREEN,
                      animation: `bounce .9s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Btn onClick={onNext} disabled={!ready}>
        {ready ? "Siguiente" : "Cargando..."}
      </Btn>
    </div>
  );
}

function ScreenEmail({
  email,
  onEmail,
  onNext,
}: {
  email: string;
  onEmail: (e: string) => void;
  onNext: () => void;
}) {
  const code = useRef(
    Math.random().toString(36).substring(2, 7).toUpperCase()
  ).current;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
        ¡Tu plan <span style={{ color: GREEN }}>#{code}</span> está listo!
      </div>
      <p style={{ color: MUTED, marginBottom: 24, fontSize: 14 }}>
        Introduce tu correo para recibir tu plan personal
      </p>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 18,
          }}
        >
          ✉️
        </span>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "16px 18px 16px 46px",
            borderRadius: 14,
            border: `1.5px solid ${email ? GREEN : "#2a2a3a"}`,
            background: CARD,
            color: TEXT,
            fontSize: 16,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      <Btn onClick={onNext} disabled={!email.includes("@")}>
        Siguiente
      </Btn>
      <p style={{ color: MUTED, fontSize: 11, marginTop: 12, lineHeight: 1.6 }}>
        Al continuar, aceptas los{" "}
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>Términos de uso</span> y{" "}
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>Política de privacidad</span> de iola Speak
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginTop: 20,
          color: MUTED,
          fontSize: 13,
        }}
      >
        <span>👥 500k+ Estudiantes</span>
        <span>🤖 IA & Video</span>
      </div>
    </div>
  );
}

function ScreenPaywall({
  selectedPlan,
  onSelectPlan,
}: {
  selectedPlan: string;
  onSelectPlan: (id: string) => void;
}) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 8, lineHeight: 1.3 }}>
        ¡Obtén tu plan personal antes de que desaparezca!
      </h2>
      <p style={{ textAlign: "center", marginBottom: 20, fontSize: 14 }}>
        Esta oferta termina en{" "}
        <CountdownTimer seconds={600} />
      </p>

      {/* Plans */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onSelectPlan(plan.id)}
            style={{
              borderRadius: 16,
              border: `2px solid ${selectedPlan === plan.id ? GREEN : "#2a2a3a"}`,
              background: selectedPlan === plan.id ? "rgba(174,234,0,0.06)" : CARD,
              padding: "16px 18px",
              cursor: "pointer",
              transition: "all .2s",
              position: "relative",
            }}
          >
            {plan.popular && (
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: GREEN,
                  color: "#000",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 14px",
                  borderRadius: 20,
                  letterSpacing: 0.5,
                }}
              >
                EL MÁS POPULAR
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${selectedPlan === plan.id ? GREEN : "#444"}`,
                    background: selectedPlan === plan.id ? GREEN : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {selectedPlan === plan.id && (
                    <span style={{ color: "#000", fontSize: 10, fontWeight: 700 }}>✓</span>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{plan.label}</div>
                  <div
                    style={{
                      display: "inline-block",
                      background: "rgba(174,234,0,0.15)",
                      color: GREEN,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 10,
                      marginTop: 3,
                    }}
                  >
                    {plan.save}
                  </div>
                  <div style={{ color: MUTED, fontSize: 12, marginTop: 3 }}>
                    <s>{plan.originalTotal}</s> {plan.saleTotal}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: MUTED, fontSize: 12, textDecoration: "line-through" }}>
                  ${plan.id === "week" ? "2.14" : plan.id === "month" ? "1.00" : "0.78"}
                </div>
                <div style={{ fontWeight: 800, fontSize: 22, color: TEXT }}>
                  {plan.perDay}
                </div>
                <div style={{ color: MUTED, fontSize: 11 }}>Por día</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span style={{ color: GREEN, fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
          Garantía de devolución de dinero de 14 días
        </span>
      </div>

      <button
        style={{
          width: "100%",
          padding: "18px 0",
          borderRadius: 50,
          border: "none",
          background: GREEN,
          color: "#000",
          fontWeight: 800,
          fontSize: 17,
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        Obtener mi plan
      </button>

      <div
        style={{
          textAlign: "center",
          color: MUTED,
          fontSize: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          marginBottom: 16,
        }}
      >
        🔒 Your payment is secured
      </div>

      <p style={{ color: MUTED, fontSize: 11, textAlign: "center", lineHeight: 1.6 }}>
        ¡Descuento aplicado! La suscripción se renovará automáticamente a $29.99 a menos que se cancele 24 horas antes de que finalice el periodo elegido.
      </p>

      {/* What you get */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: GREEN }}>
          Qué obtienes con iola Speak
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            "Habla en lecciones de video interactivas",
            "Recibe retroalimentación de la IA",
            "Mejora tu pronunciación",
            "Amplía tu vocabulario (más de 8.500 palabras)",
            "Mira videos con hablantes nativos",
            "Sigue tu plan personalizado",
            "Conviértete en un hablante seguro",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14 }}>
              <span style={{ color: GREEN, flexShrink: 0, marginTop: 2 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, textAlign: "center" }}>
          más barato que un tutor
        </h3>
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #2a2a3a",
            marginTop: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "#1a1a2e",
              padding: "10px 16px",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            <span style={{ color: GREEN }}>iola Speak</span>
            <span style={{ textAlign: "right", color: MUTED }}>Tutor</span>
          </div>
          {[
            ["Retroalimentación instantánea", "Retroalimentación instantánea"],
            ["Practica en cualquier momento", "Programa con anticipación ❌"],
            ["Diferentes voces y acentos", "Poca variedad ❌"],
            ["Sin estrés", "Difícil de dejar ❌"],
            ["50 veces más barato", "Caro ❌"],
          ].map(([a, b], i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                padding: "10px 16px",
                borderTop: "1px solid #2a2a3a",
                fontSize: 12,
              }}
            >
              <span>✅ {a}</span>
              <span style={{ textAlign: "right", color: MUTED }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginTop: 28,
          marginBottom: 8,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 20, color: GREEN }}>500k+</div>
          <div style={{ fontSize: 11, color: MUTED }}>Estudiantes</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 20, color: GREEN }}>10,000+</div>
          <div style={{ fontSize: 11, color: MUTED }}>★★★★★</div>
        </div>
      </div>

      {/* Second CTA */}
      <button
        style={{
          width: "100%",
          padding: "18px 0",
          borderRadius: 50,
          border: "none",
          background: GREEN,
          color: "#000",
          fontWeight: 800,
          fontSize: 17,
          cursor: "pointer",
          marginTop: 20,
        }}
      >
        Obtener mi plan
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function IolaQuiz() {
  const [screen, setScreen] = useState(0);
  const [grammarIdx, setGrammarIdx] = useState(0);
  const [whatToExpectSlide, setWhatToExpectSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<QuizState>({
    language: "es",
    name: "",
    level: "",
    studyMethod: [],
    goal: "",
    difficulties: [],
    topics: [],
    practiceTime: "",
    vocabA1: [],
    vocabB1: [],
    vocabC1: [],
    email: "",
    selectedPlan: "month",
  });

  const next = () => {
    setScreen((s) => s + 1);
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleArr = (key: keyof QuizState, val: string) => {
    setState((s) => {
      const arr = s[key] as string[];
      return {
        ...s,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  };

  const set = (key: keyof QuizState, val: string) => setState((s) => ({ ...s, [key]: val }));

  // Screen definitions
  const screens: React.ReactNode[] = [
    // 0 - Intro
    <ScreenIntro onNext={next} />,
    // 1 - Language
    <ScreenLanguage
      selected={state.language}
      onSelect={(v) => set("language", v)}
      onNext={next}
    />,
    // 2 - Name
    <ScreenName
      name={state.name}
      onName={(v) => set("name", v)}
      onNext={next}
      onSkip={next}
    />,
    // 3 - Transition
    <ScreenTransition name={state.name} onNext={next} />,
    // 4 - Level
    <ScreenLevel
      selected={state.level}
      onSelect={(v) => { set("level", v); setTimeout(next, 300); }}
    />,
    // 5 - Study method
    <ScreenStudyMethod
      selected={state.studyMethod}
      onToggle={(v) => toggleArr("studyMethod", v)}
      onNext={next}
    />,
    // 6 - Brain science
    <ScreenBrainScience onNext={next} />,
    // 7 - Goal
    <ScreenGoal
      selected={state.goal}
      onSelect={(v) => { set("goal", v); setTimeout(next, 300); }}
    />,
    // 8 - Trust
    <ScreenTrust onNext={next} />,
    // 9 - Difficulties
    <ScreenDifficulties
      selected={state.difficulties}
      onToggle={(v) => toggleArr("difficulties", v)}
      onNext={next}
    />,
    // 10 - Difficulty explanation
    <ScreenDifficultyExplanation
      difficulty={state.difficulties[0] || "Falta de práctica"}
      onNext={next}
    />,
    // 11 - Spaced repetition
    <ScreenSpacedRepetition onNext={next} />,
    // 12 - Topics
    <ScreenTopics
      selected={state.topics}
      onToggle={(v) => toggleArr("topics", v)}
      onNext={next}
    />,
    // 13 - Social proof
    <ScreenSocialProof onNext={next} />,
    // 14 - Practice time
    <ScreenPracticeTime
      selected={state.practiceTime}
      onSelect={(v) => { set("practiceTime", v); setTimeout(next, 300); }}
    />,
    // 15 - Ready for test
    <ScreenReadyForTest onNext={next} />,
    // 16 - Vocab A1
    <ScreenVocabTest
      words={VOCAB_A1}
      selected={state.vocabA1}
      onToggle={(w) => toggleArr("vocabA1", w)}
      onNext={next}
      level="A1-A2 Nivel principiante"
    />,
    // 17 - Vocab B1
    <ScreenVocabTest
      words={VOCAB_B1}
      selected={state.vocabB1}
      onToggle={(w) => toggleArr("vocabB1", w)}
      onNext={next}
      level="B1-B2 Nivel intermedio"
    />,
    // 18 - Vocab C1
    <ScreenVocabTest
      words={VOCAB_C1}
      selected={state.vocabC1}
      onToggle={(w) => toggleArr("vocabC1", w)}
      onNext={next}
      level="C1-C2 Nivel avanzado"
    />,
    // 19-21 - Grammar questions
    ...GRAMMAR_QUESTIONS.map((q, i) => (
      <ScreenGrammar
        key={`grammar-${i}`}
        q={q}
        qIndex={i}
        total={GRAMMAR_QUESTIONS.length}
        onAnswer={() => next()}
      />
    )),
    // 22 - Test complete
    <ScreenTestComplete level={state.level} onNext={next} />,
    // 23-25 - What to expect (3 slides)
    <ScreenWhatToExpect slide={0} onNext={next} />,
    <ScreenWhatToExpect slide={1} onNext={next} />,
    <ScreenWhatToExpect slide={2} onNext={next} />,
    // 26 - AI Chat
    <ScreenAIChat onNext={next} />,
    // 27 - Email
    <ScreenEmail email={state.email} onEmail={(v) => set("email", v)} onNext={next} />,
    // 28 - Paywall
    <ScreenPaywall selectedPlan={state.selectedPlan} onSelectPlan={(v) => set("selectedPlan", v)} />,
  ];

  const currentScreen = screens[Math.min(screen, screens.length - 1)];

  return (
    <div
      style={{
        background: DARK,
        color: TEXT,
        minHeight: "100vh",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        * { box-sizing: border-box; }
        input { font-family: inherit; }
        button { font-family: inherit; }
      `}</style>

      <div
        ref={containerRef}
        style={{
          maxWidth: 430,
          margin: "0 auto",
          padding: "24px 20px 40px",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <div
          key={screen}
          style={{ animation: "fadeIn .35s ease-out" }}
        >
          {currentScreen}
        </div>
      </div>
    </div>
  );
}
