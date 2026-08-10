import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/quiz")({
  component: IolaQuiz,
  head: () => ({
    meta: [
      { title: "iola Speak: English Practice" },
      { name: "description", content: "Tu plan personalizado de inglés con IA. Quiz de 3 minutos." },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    ],
  }),
});

// ─── Theme ────────────────────────────────────────────────────────────────────
const G = "#AEEA00";          // lime green accent
const DARK = "#09090F";
const CARD = "#111118";
const CARD2 = "#16161F";
const MUTED = "#6B6B80";
const TEXT = "#FFFFFF";

// ─── Imágenes del CDN de Lola Speak (mismas que usan ellos) ───────────────────
const CDN = "https://cdn-eu.lolaenglish.com/web-images%2F";
const IMG = {
  hero:         CDN + "hero.webp",
  brain:        CDN + "startBrain.webp",
  brains:       CDN + "Brains.webp",
  lamp:         CDN + "Lamp.webp",
  twoX:         CDN + "2x.webp",
  remember:     CDN + "remember.webp",
  hands:        CDN + "hands.webp",
  imgPlan:      CDN + "img-plan.webp",
  finding:      CDN + "finding.svg",
  creating:     CDN + "creating.svg",
  // Level icons
  beginner:     CDN + "Beginner.svg",
  intermediate: CDN + "Intermediate.svg",
  advanced:     CDN + "Advansed.svg",
  // Practice time
  time30:       CDN + "30.webp",
  time15:       CDN + "15.webp",
  time5:        CDN + "5.webp",
  // What to expect
  week1:        CDN + "week1.webp",
  week4:        CDN + "week4.webp",
  month12:      CDN + "month12.webp",
  // AI / features
  aiImg:        CDN + "ai.webp",
  pronunciation:CDN + "pronunciation.webp",
  watch:        CDN + "watch.webp",
  fluency:      CDN + "fluency.webp",
  vocab:        CDN + "vocab.webp",
  pickUp:       CDN + "pickUp.webp",
  situations:   CDN + "situations.webp",
  // Progress steps (paywall)
  prog1:        CDN + "prog_step_1.webp",
  prog2:        CDN + "prog_step_2.webp",
  prog3:        CDN + "prog_step_3.webp",
  prog4:        CDN + "prog_step_4.webp",
  prog5:        CDN + "prog_step_5.webp",
  prog6:        CDN + "prog_step_6.webp",
  // Avatars personas reales (Unsplash — Lola no expone las suyas)
  tutor: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&fit=crop&crop=face",
  av1:   "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80&fit=crop&crop=face",
  av2:   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&fit=crop&crop=face",
  av3:   "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&fit=crop&crop=face",
  av4:   "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&fit=crop&crop=face",
  av5:   "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80&fit=crop&crop=face",
  av6:   "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&fit=crop&crop=face",
  // Topics (Unsplash — Lola tampoco expone estas)
  topAdventura: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=200&q=75&fit=crop",
  topArte:      "https://images.unsplash.com/photo-1547826039-bdbebb989f68?w=200&q=75&fit=crop",
  topSocial:    "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200&q=75&fit=crop",
  topNegocios:  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=75&fit=crop",
  topCarrera:   "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=75&fit=crop",
  topDiario:    "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=200&q=75&fit=crop",
  topMedicina:  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&q=75&fit=crop",
  topViajes:    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=200&q=75&fit=crop",
  topComida:    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=75&fit=crop",
  topDeporte:   "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&q=75&fit=crop",
  topRedes:     "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&q=75&fit=crop",
  topDigital:   "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&q=75&fit=crop",
  // Video thumbnail
  videoThumb:   "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=700&q=80&fit=crop",
};

// Cloudflare Stream video ID (mismo video que usa Lola Speak)
const CF_VIDEO_ID = "75b2bc08bf7b942ba7c1d5582f937ab0";

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Data ─────────────────────────────────────────────────────────────────────
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
  { img: IMG.topAdventura, label: "Aventura" },
  { img: IMG.topArte,      label: "Arte & Cultura" },
  { img: IMG.topSocial,    label: "Vida social" },
  { img: IMG.topNegocios,  label: "Negocios" },
  { img: IMG.topCarrera,   label: "Carrera" },
  { img: IMG.topDiario,    label: "Vida diaria" },
  { img: IMG.topMedicina,  label: "Medicina" },
  { img: IMG.topViajes,    label: "Viajes" },
  { img: IMG.topComida,    label: "Comida" },
  { img: IMG.topDeporte,   label: "Deporte" },
  { img: IMG.topRedes,     label: "Redes sociales" },
  { img: IMG.topDigital,   label: "Negocios digitales" },
];

const VOCAB_A1 = ["because","booking","excellent","pay","strawberry","usual","wife","yesterday"];
const VOCAB_B1 = ["avoid","charisma","emphasize","excitement","impact","maintain","stunning","trustworthy"];
const VOCAB_C1 = ["ascertain","frolic","opaque","opulent","proprietary","scrutinize","tranquility","viability"];

const GRAMMAR_QUESTIONS = [
  { question: 'My brother ___ eleven years old.', options: ["are","is","be","am"], correct: "is" },
  { question: 'We ___ to school every morning.', options: ["go","goes","is going","gone"], correct: "go" },
  { question: 'Look! The children ___ football in the yard.', options: ["played","have played","play","are playing"], correct: "are playing" },
];

const PLANS = [
  { id:"week",    label:"1 semana",  save:"AHORRA 40%", originalTotal:"$14.99", saleTotal:"$8.99",  perDay:"$1.28", popular:false },
  { id:"month",   label:"1 mes",     save:"AHORRA 50%", originalTotal:"$29.99", saleTotal:"$14.99", perDay:"$0.50", popular:true  },
  { id:"quarter", label:"3 meses",   save:"AHORRA 49%", originalTotal:"$69.99", saleTotal:"$34.99", perDay:"$0.39", popular:false },
];

const TESTIMONIALS = [
  { av: IMG.av1, name: "María G.", text: "En 3 semanas ya podía hablar en reuniones de trabajo en inglés. Increíble.", stars: 5 },
  { av: IMG.av2, name: "Carlos M.", text: "Lo intenté con Duolingo años. Con iola Speak en 1 mes noté la diferencia real.", stars: 5 },
  { av: IMG.av3, name: "Sofía R.", text: "La IA me corrige la pronunciación al instante. No hay nada igual.", stars: 5 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getLevelLabel(l: string) { return l==="beginner"?"A2":l==="intermediate"?"B1":"B2"; }
function getNextLevel(l: string)  { return l==="beginner"?"B1":l==="intermediate"?"B2":"C1"; }
function addDays(n: number) {
  const d = new Date(); d.setDate(d.getDate()+n);
  return d.toLocaleDateString("es-ES",{day:"numeric",month:"long"});
}
function stars(n: number) { return "★".repeat(n)+"☆".repeat(5-n); }

// ─── Shared components ────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{
        width:36,height:36,borderRadius:10,
        background:`linear-gradient(135deg,${G},#00D4FF)`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontWeight:900,fontSize:18,color:"#000",
      }}>i</div>
      <span style={{fontWeight:700,fontSize:17,letterSpacing:.3}}>iola Speak</span>
    </div>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div style={{height:3,background:"#1e1e2e",borderRadius:2,margin:"0 0 28px",overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,background:G,borderRadius:2,transition:"width .4s ease"}} />
    </div>
  );
}

function Btn({ children, onClick, disabled, secondary, style }: {
  children: React.ReactNode; onClick?: ()=>void; disabled?: boolean; secondary?: boolean; style?: React.CSSProperties;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%",padding:"17px 0",borderRadius:50,border:"none",
      fontWeight:800,fontSize:16,cursor:disabled?"not-allowed":"pointer",
      background: disabled?"#222":secondary?"transparent":G,
      color: disabled?MUTED:secondary?MUTED:"#000",
      outline: secondary?`1px solid #333`:"none",
      transition:"all .15s",opacity:disabled?.6:1,
      ...style,
    }}>{children}</button>
  );
}

function OptionCard({ selected, onClick, children, style }: {
  selected?: boolean; onClick?: ()=>void; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <button onClick={onClick} style={{
      width:"100%",padding:"14px 16px",borderRadius:14,
      border:`1.5px solid ${selected?G:"#222"}`,
      background:selected?"rgba(174,234,0,0.07)":CARD,
      color:TEXT,textAlign:"left",
      display:"flex",alignItems:"center",justifyContent:"space-between",
      cursor:"pointer",transition:"all .15s",fontWeight:500,fontSize:15,
      ...style,
    }}>
      {children}
      <div style={{
        width:20,height:20,borderRadius:"50%",flexShrink:0,
        border:`2px solid ${selected?G:"#444"}`,
        background:selected?G:"transparent",
        display:"flex",alignItems:"center",justifyContent:"center",
      }}>
        {selected && <span style={{color:"#000",fontSize:10,fontWeight:800}}>✓</span>}
      </div>
    </button>
  );
}

function AvatarRow({ avatars }: { avatars: string[] }) {
  return (
    <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
      {avatars.map((src,i)=>(
        <img key={i} src={src} alt="" style={{
          width:32,height:32,borderRadius:"50%",objectFit:"cover",
          border:"2px solid #09090F",marginLeft:i>0?-8:0,
        }}/>
      ))}
    </div>
  );
}

function CountdownTimer({ seconds }: { seconds: number }) {
  const [rem, setRem] = useState(seconds);
  useEffect(()=>{
    if(rem<=0) return;
    const id = setInterval(()=>setRem(r=>r-1),1000);
    return ()=>clearInterval(id);
  },[]);
  const m = Math.floor(rem/60).toString().padStart(2,"0");
  const s = (rem%60).toString().padStart(2,"0");
  return <span style={{color:"#FF4444",fontWeight:800}}>{m}:{s}</span>;
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function ScreenIntro({ onNext }: { onNext: ()=>void }) {
  return (
    <div>
      {/* Hero photo */}
      <div style={{
        position:"relative",width:"100%",height:260,borderRadius:24,overflow:"hidden",
        marginBottom:24,
      }}>
        <img src={IMG.hero} alt="iola Speak" style={{
          width:"100%",height:"100%",objectFit:"cover",
        }}/>
        {/* Dark overlay */}
        <div style={{
          position:"absolute",inset:0,
          background:"linear-gradient(to bottom, rgba(9,9,15,0.2) 0%, rgba(9,9,15,0.7) 100%)",
        }}/>
        {/* Chat bubbles overlay */}
        <div style={{position:"absolute",bottom:16,left:16,right:16}}>
          <div style={{
            background:"rgba(255,255,255,0.95)",color:"#111",
            borderRadius:"18px 18px 18px 4px",padding:"10px 14px",
            fontSize:13,fontWeight:600,maxWidth:200,marginBottom:8,
          }}>
            Hi! Can you help me practice? 👋
          </div>
          <div style={{
            background:G,color:"#000",
            borderRadius:"18px 18px 4px 18px",padding:"10px 14px",
            fontSize:13,fontWeight:700,maxWidth:200,marginLeft:"auto",
          }}>
            Of course! Let's start! 🎯
          </div>
        </div>
        {/* Tutor avatar */}
        <div style={{position:"absolute",top:16,right:16}}>
          <img src={IMG.tutor} alt="iola AI" style={{
            width:50,height:50,borderRadius:"50%",objectFit:"cover",
            border:`2px solid ${G}`,
          }}/>
          <div style={{
            position:"absolute",bottom:0,right:0,
            width:14,height:14,borderRadius:"50%",
            background:"#22C55E",border:"2px solid #09090F",
          }}/>
        </div>
      </div>

      <Logo />
      <h1 style={{fontSize:28,fontWeight:900,lineHeight:1.2,margin:"16px 0 10px"}}>
        Desbloquea tu inglés<br/>
        <span style={{color:G}}>con IA</span> en semanas
      </h1>
      <p style={{color:MUTED,fontSize:14,marginBottom:20,lineHeight:1.6}}>
        Habla con confianza. La IA te corrige en tiempo real y adapta tu plan cada día.
      </p>

      {/* Social proof mini */}
      <AvatarRow avatars={[IMG.av1,IMG.av2,IMG.av3,IMG.av4,IMG.av5,IMG.av6]}/>
      <p style={{textAlign:"center",fontSize:12,color:MUTED,marginBottom:24}}>
        <span style={{color:G,fontWeight:700}}>500,000+</span> estudiantes ya hablan inglés
      </p>

      <div style={{background:"rgba(174,234,0,0.07)",border:`1px solid rgba(174,234,0,0.2)`,
        borderRadius:12,padding:"10px 14px",marginBottom:24,
        display:"flex",alignItems:"center",gap:10,fontSize:13,}}>
        <span>⏱️</span>
        <span><strong style={{color:G}}>Solo 3 minutos</strong> para crear tu plan personalizado</span>
      </div>

      <Btn onClick={onNext}>Crear mi plan gratis →</Btn>
    </div>
  );
}

function ScreenLanguage({ selected, onSelect, onNext }: {
  selected: string; onSelect:(l:string)=>void; onNext:()=>void;
}) {
  return (
    <div>
      <ProgressBar pct={5}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:6,textAlign:"center"}}>¿Cuál es tu idioma nativo?</h2>
      <p style={{color:MUTED,textAlign:"center",fontSize:13,marginBottom:20}}>Elegimos el mejor método según tu idioma</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>
        {LANGUAGES.map(lang=>(
          <button key={lang.code} onClick={()=>onSelect(lang.code)} style={{
            padding:"14px 8px",borderRadius:14,textAlign:"center",cursor:"pointer",
            border:`1.5px solid ${selected===lang.code?G:"#222"}`,
            background:selected===lang.code?"rgba(174,234,0,0.08)":CARD,
            transition:"all .15s",
          }}>
            <div style={{fontSize:30,marginBottom:4}}>{lang.flag}</div>
            <div style={{fontSize:11,color:TEXT,fontWeight:500}}>{lang.name}</div>
            {selected===lang.code&&(
              <div style={{
                marginTop:4,fontSize:10,color:G,fontWeight:700,
              }}>✓ Seleccionado</div>
            )}
          </button>
        ))}
      </div>
      <Btn onClick={onNext} disabled={!selected}>Siguiente</Btn>
    </div>
  );
}

function ScreenName({ name, onName, onNext, onSkip }: {
  name:string; onName:(n:string)=>void; onNext:()=>void; onSkip:()=>void;
}) {
  return (
    <div>
      <ProgressBar pct={10}/>
      <div style={{textAlign:"center",marginBottom:24}}>
        <img src={IMG.tutor} alt="" style={{
          width:72,height:72,borderRadius:"50%",objectFit:"cover",
          border:`3px solid ${G}`,margin:"0 auto 12px",display:"block",
        }}/>
        <h2 style={{fontSize:22,fontWeight:800,marginBottom:6}}>¿Cómo te llamas?</h2>
        <p style={{color:MUTED,fontSize:13}}>Tu tutora iola personalizará cada lección</p>
      </div>
      <input
        type="text" placeholder="Tu nombre" value={name} onChange={e=>onName(e.target.value)}
        style={{
          width:"100%",padding:"16px 18px",borderRadius:14,
          border:`1.5px solid ${name?G:"#2a2a3a"}`,
          background:CARD,color:TEXT,fontSize:16,outline:"none",
          marginBottom:16,boxSizing:"border-box",fontFamily:"inherit",
        }}
      />
      <Btn onClick={onNext} disabled={!name.trim()}>Siguiente</Btn>
      <button onClick={onSkip} style={{
        width:"100%",marginTop:10,background:"none",border:"none",
        color:MUTED,fontSize:14,cursor:"pointer",padding:"8px 0",
      }}>Saltar</button>
    </div>
  );
}

function ScreenTransition({ name, onNext }: { name:string; onNext:()=>void }) {
  const [pct, setPct] = useState(0);
  useEffect(()=>{
    const t = setTimeout(()=>setPct(100),100);
    return ()=>clearTimeout(t);
  },[]);
  return (
    <div style={{textAlign:"center"}}>
      <div style={{
        width:80,height:80,borderRadius:"50%",margin:"0 auto 20px",
        background:`conic-gradient(${G} ${pct*3.6}deg, #1e1e2e 0deg)`,
        display:"flex",alignItems:"center",justifyContent:"center",
        transition:"background 1.5s ease",
      }}>
        <div style={{
          width:64,height:64,borderRadius:"50%",background:DARK,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:28,
        }}>🧠</div>
      </div>
      <p style={{color:G,fontWeight:700,marginBottom:6,fontSize:13,letterSpacing:1}}>
        CREANDO TU PLAN PERSONAL
      </p>
      <h2 style={{fontSize:24,fontWeight:800,marginBottom:24,lineHeight:1.3}}>
        {name?`¡Hola, ${name}! `:"¡Perfecto! "}
        Tu plan<br/>de inglés te espera
      </h2>

      {/* S-curve progress illustration */}
      <div style={{
        background:CARD,borderRadius:20,padding:20,marginBottom:24,
        border:"1px solid #1e1e2e",
      }}>
        <svg viewBox="0 0 280 140" style={{width:"100%"}}>
          <defs>
            <linearGradient id="gc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={G}/>
              <stop offset="100%" stopColor="#00D4FF"/>
            </linearGradient>
          </defs>
          {/* Grid */}
          {[35,70,105].map(y=><line key={y} x1="30" y1={y} x2="260" y2={y} stroke="#1e1e2e" strokeWidth="1"/>)}
          {/* Labels Y */}
          <text x="22" y="38" fill={MUTED} fontSize="9" textAnchor="end">C1</text>
          <text x="22" y="73" fill={MUTED} fontSize="9" textAnchor="end">B1</text>
          <text x="22" y="108" fill={MUTED} fontSize="9" textAnchor="end">A1</text>
          {/* Curve */}
          <path d="M 30 120 C 80 118 130 70 260 15" fill="none" stroke="url(#gc)" strokeWidth="3" strokeLinecap="round"/>
          {/* Dot now */}
          <circle cx="30" cy="120" r="7" fill={G}/>
          <text x="30" y="135" textAnchor="middle" fill={MUTED} fontSize="9">Hoy</text>
          {/* Dot goal */}
          <circle cx="260" cy="15" r="7" fill="#00D4FF" stroke={DARK} strokeWidth="2"/>
          <text x="260" y="10" textAnchor="middle" fill="#00D4FF" fontSize="9">+30 días</text>
        </svg>
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenLevel({ selected, onSelect }: { selected:string; onSelect:(v:string)=>void }) {
  const opts = [
    { value:"beginner",     img:IMG.beginner,     label:"Principiante",  sub:"Sé muy poco inglés" },
    { value:"intermediate", img:IMG.intermediate, label:"Intermedio",    sub:"Puedo mantener conversaciones básicas" },
    { value:"advanced",     img:IMG.advanced,     label:"Avanzado",      sub:"Hablo con bastante confianza" },
  ];
  return (
    <div>
      <ProgressBar pct={18}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:6,textAlign:"center"}}>¿Qué tan bien hablas inglés?</h2>
      <p style={{color:MUTED,textAlign:"center",fontSize:13,marginBottom:20}}>Sé honesto para obtener el plan correcto</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {opts.map(o=>(
          <button key={o.value} onClick={()=>onSelect(o.value)} style={{
            width:"100%",padding:"16px",borderRadius:14,textAlign:"left",cursor:"pointer",
            border:`1.5px solid ${selected===o.value?G:"#222"}`,
            background:selected===o.value?"rgba(174,234,0,0.07)":CARD,
            transition:"all .15s",display:"flex",alignItems:"center",gap:14,
          }}>
            <img src={o.img} alt={o.label} style={{width:40,height:40,objectFit:"contain",flexShrink:0}}/>
            <div>
              <div style={{fontWeight:700,fontSize:15,color:TEXT}}>{o.label}</div>
              <div style={{fontSize:12,color:MUTED,marginTop:2}}>{o.sub}</div>
            </div>
            {selected===o.value&&(
              <div style={{
                marginLeft:"auto",width:22,height:22,borderRadius:"50%",
                background:G,display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,fontWeight:800,color:"#000",flexShrink:0,
              }}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScreenStudyMethod({ selected, onToggle, onNext }: {
  selected:string[]; onToggle:(v:string)=>void; onNext:()=>void;
}) {
  const opts = [
    { icon:"🎒", label:"En la escuela" },
    { icon:"🎓", label:"En la universidad" },
    { icon:"🌍", label:"Estudiando en el extranjero" },
    { icon:"✏️", label:"Con un tutor privado" },
    { icon:"📱", label:"Con aplicaciones" },
  ];
  return (
    <div>
      <ProgressBar pct={26}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:6,textAlign:"center"}}>¿Cómo has estudiado inglés?</h2>
      <p style={{color:MUTED,textAlign:"center",fontSize:13,marginBottom:20}}>Puedes elegir más de uno</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {opts.map(o=>(
          <OptionCard key={o.label} selected={selected.includes(o.label)} onClick={()=>onToggle(o.label)}>
            <span style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:22}}>{o.icon}</span>{o.label}
            </span>
          </OptionCard>
        ))}
      </div>
      <Btn onClick={onNext} disabled={selected.length===0}>Siguiente</Btn>
    </div>
  );
}

function ScreenBrainScience({ onNext }: { onNext:()=>void }) {
  return (
    <div>
      <ProgressBar pct={33}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:20,textAlign:"center",lineHeight:1.3}}>
        Aprender inglés ejercita<br/>tu cerebro
      </h2>

      {/* Brain photo with stats overlay */}
      <div style={{position:"relative",borderRadius:20,overflow:"hidden",marginBottom:20}}>
        <img src={IMG.brains} alt="Brain" style={{width:"100%",height:200,objectFit:"cover"}}/>
        <div style={{
          position:"absolute",inset:0,
          background:"linear-gradient(to bottom, rgba(9,9,15,0.1) 0%, rgba(9,9,15,0.85) 100%)",
        }}/>
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,
          display:"flex",justifyContent:"space-around",padding:"16px 12px",
        }}>
          <div style={{textAlign:"center"}}>
            <div style={{color:G,fontSize:32,fontWeight:900,lineHeight:1}}>+35%</div>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,marginTop:4}}>Enfoque</div>
          </div>
          <div style={{width:1,background:"rgba(255,255,255,0.1)"}}/>
          <div style={{textAlign:"center"}}>
            <div style={{color:G,fontSize:32,fontWeight:900,lineHeight:1}}>+50%</div>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,marginTop:4}}>Memoria</div>
          </div>
          <div style={{width:1,background:"rgba(255,255,255,0.1)"}}/>
          <div style={{textAlign:"center"}}>
            <div style={{color:G,fontSize:32,fontWeight:900,lineHeight:1}}>2x</div>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,marginTop:4}}>Retención</div>
          </div>
        </div>
      </div>

      <div style={{
        background:CARD,borderRadius:14,padding:"14px 16px",marginBottom:20,
        border:"1px solid #1e1e2e",fontSize:12,color:MUTED,textAlign:"center",
      }}>
        📊 Fuente: Linck et al., 2014 · Bialystok & Martin, 2014
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenGoal({ selected, onSelect }: { selected:string; onSelect:(v:string)=>void }) {
  const opts = [
    { icon:"✈️", label:"Vacaciones y viajes" },
    { icon:"💼", label:"Trabajo y carrera" },
    { icon:"🗽", label:"Vivir en el extranjero" },
    { icon:"👥", label:"Hacer amigos" },
    { icon:"🎬", label:"Entretenimiento (series, música)" },
    { icon:"📝", label:"Aprobar un examen" },
  ];
  return (
    <div>
      <ProgressBar pct={40}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:20,textAlign:"center"}}>¿Por qué quieres aprender inglés?</h2>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {opts.map(o=>(
          <OptionCard key={o.label} selected={selected===o.label} onClick={()=>onSelect(o.label)}>
            <span style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:22}}>{o.icon}</span>{o.label}
            </span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function ScreenTrust({ onNext }: { onNext:()=>void }) {
  return (
    <div style={{textAlign:"center"}}>
      <ProgressBar pct={45}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:6}}>Estás en buenas manos</h2>
      <p style={{color:MUTED,fontSize:13,marginBottom:20}}>Tecnología de punta + método científico</p>

      {/* 3 pillars with images */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
        {[
          { img:IMG.aiImg,       icon:"🤖", label:"IA en tiempo real" },
          { img:IMG.watch,      icon:"🎬", label:"Videos nativos" },
          { img:IMG.remember,   icon:"🧪", label:"Método científico" },
        ].map(p=>(
          <div key={p.label} style={{borderRadius:14,overflow:"hidden",border:"1px solid #1e1e2e"}}>
            <div style={{position:"relative",height:80}}>
              <img src={p.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"rgba(9,9,15,0.55)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}
              >{p.icon}</div>
            </div>
            <div style={{padding:"8px 6px",background:CARD,fontSize:11,fontWeight:600,textAlign:"center"}}>
              {p.label}
            </div>
          </div>
        ))}
      </div>

      {/* iola center logo */}
      <div style={{
        display:"inline-flex",alignItems:"center",gap:10,
        background:`linear-gradient(135deg,rgba(174,234,0,0.1),rgba(0,212,255,0.07))`,
        border:`1px solid rgba(174,234,0,0.2)`,borderRadius:50,
        padding:"10px 24px",marginBottom:24,
      }}>
        <div style={{
          width:32,height:32,borderRadius:8,
          background:`linear-gradient(135deg,${G},#00D4FF)`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontWeight:900,fontSize:16,color:"#000",
        }}>i</div>
        <span style={{fontWeight:700}}>iola Speak</span>
      </div>

      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenDifficulties({ selected, onToggle, onNext }: {
  selected:string[]; onToggle:(v:string)=>void; onNext:()=>void;
}) {
  const opts = [
    { icon:"😰", label:"Miedo a hablar" },
    { icon:"👄", label:"Pronunciación" },
    { icon:"🧱", label:"Falta de práctica" },
    { icon:"👂", label:"Comprensión auditiva" },
    { icon:"📖", label:"Vocabulario limitado" },
  ];
  return (
    <div>
      <ProgressBar pct={52}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:6,textAlign:"center"}}>¿Qué te cuesta más?</h2>
      <p style={{color:MUTED,textAlign:"center",fontSize:13,marginBottom:20}}>Elige todos los que apliquen</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {opts.map(o=>(
          <OptionCard key={o.label} selected={selected.includes(o.label)} onClick={()=>onToggle(o.label)}>
            <span style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:22}}>{o.icon}</span>{o.label}
            </span>
          </OptionCard>
        ))}
      </div>
      <Btn onClick={onNext} disabled={selected.length===0}>Siguiente</Btn>
    </div>
  );
}

function ScreenDifficultyExplanation({ difficulty, onNext }: { difficulty:string; onNext:()=>void }) {
  const map: Record<string, { emoji:string; title:string; body:string; img:string }> = {
    "Miedo a hablar":      { emoji:"🎙️", img:IMG.fluency,      title:"Habla sin miedo",            body:"Practica con nuestra IA en cualquier momento, sin juicios. Cada conversación te da retroalimentación instantánea para ganar confianza rápidamente." },
    "Pronunciación":        { emoji:"👄", img:IMG.pronunciation, title:"Pronunciación perfecta",     body:"La IA analiza cada sonido que produces y te compara con hablantes nativos en tiempo real. Mejoras fonema por fonema." },
    "Falta de práctica":    { emoji:"⏱️", img:IMG.pickUp,       title:"15 min al día es suficiente",body:"Con solo 15 minutos diarios, iola te mantiene en constante progreso. Lecciones cortas diseñadas para tu agenda real." },
    "Comprensión auditiva": { emoji:"🎧", img:IMG.watch,        title:"Entrena tu oído",            body:"Videos auténticos de hablantes nativos en diferentes contextos. Tu cerebro aprende el inglés real, no el de los libros." },
    "Vocabulario limitado": { emoji:"📖", img:IMG.vocab,        title:"Más de 8.500 palabras",      body:"Repetición espaciada científicamente probada. El sistema recuerda qué palabras necesitas y las presenta en el momento perfecto." },
  };
  const exp = map[difficulty] || { emoji:"🤖", img:IMG.situations, title:difficulty, body:"iola Speak te ayuda a superar este obstáculo con ejercicios de IA personalizados." };
  return (
    <div>
      <ProgressBar pct={58}/>
      {/* Photo with overlay */}
      <div style={{position:"relative",borderRadius:20,overflow:"hidden",marginBottom:20,height:180}}>
        <img src={exp.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",inset:0,background:"rgba(9,9,15,0.6)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:52}}
        >{exp.emoji}</div>
      </div>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:12,color:G}}>{exp.title}</h2>
      <p style={{color:MUTED,lineHeight:1.7,marginBottom:28,fontSize:15}}>{exp.body}</p>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenTopics({ selected, onToggle, onNext }: {
  selected:string[]; onToggle:(v:string)=>void; onNext:()=>void;
}) {
  return (
    <div>
      <ProgressBar pct={65}/>
      <h2 style={{fontSize:20,fontWeight:800,marginBottom:6,textAlign:"center"}}>Elige tus temas favoritos</h2>
      <p style={{color:MUTED,textAlign:"center",fontSize:13,marginBottom:20}}>Aprenderás vocabulario que usarás de verdad</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:24}}>
        {TOPICS.map(t=>{
          const isSelected = selected.includes(t.label);
          return (
            <button key={t.label} onClick={()=>onToggle(t.label)} style={{
              borderRadius:14,overflow:"hidden",border:`2px solid ${isSelected?G:"transparent"}`,
              cursor:"pointer",transition:"all .15s",background:"none",padding:0,
            }}>
              <div style={{position:"relative",height:70}}>
                <img src={t.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{
                  position:"absolute",inset:0,
                  background:isSelected?"rgba(174,234,0,0.2)":"rgba(9,9,15,0.4)",
                  transition:"all .15s",
                }}/>
                {isSelected&&(
                  <div style={{
                    position:"absolute",top:4,right:4,width:18,height:18,borderRadius:"50%",
                    background:G,display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:10,fontWeight:800,color:"#000",
                  }}>✓</div>
                )}
              </div>
              <div style={{
                padding:"6px 4px",background:isSelected?"rgba(174,234,0,0.1)":CARD,
                fontSize:10,fontWeight:600,textAlign:"center",color:isSelected?G:TEXT,
              }}>{t.label}</div>
            </button>
          );
        })}
      </div>
      <Btn onClick={onNext} disabled={selected.length===0}>Siguiente</Btn>
    </div>
  );
}

function ScreenSocialProof({ onNext }: { onNext:()=>void }) {
  return (
    <div>
      <ProgressBar pct={70}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:6,textAlign:"center"}}>Estás en buena compañía</h2>
      <p style={{color:MUTED,textAlign:"center",fontSize:13,marginBottom:20}}>Miles ya hablan inglés con iola</p>

      {/* Group photo */}
      <div style={{position:"relative",borderRadius:20,overflow:"hidden",marginBottom:20,height:160}}>
        <img src={IMG.hands} alt="Students" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",inset:0,background:"rgba(9,9,15,0.5)"}}/>
        <div style={{
          position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"space-around",
          padding:"0 16px",
        }}>
          {[["500k+","Estudiantes"],["4.8★","Rating"],["10k+","Reseñas"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{color:G,fontWeight:900,fontSize:24,lineHeight:1}}>{v}</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {TESTIMONIALS.map((t,i)=>(
          <div key={i} style={{
            background:CARD,borderRadius:14,padding:"14px 16px",
            border:"1px solid #1e1e2e",display:"flex",gap:12,alignItems:"flex-start",
          }}>
            <img src={t.av} alt={t.name} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontWeight:700,fontSize:13}}>{t.name}</span>
                <span style={{color:"#FFB800",fontSize:11}}>{stars(t.stars)}</span>
              </div>
              <p style={{color:MUTED,fontSize:12,lineHeight:1.5,margin:0}}>{t.text}</p>
            </div>
          </div>
        ))}
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenPracticeTime({ selected, onSelect }: { selected:string; onSelect:(v:string)=>void }) {
  const opts = [
    { value:"30", img:IMG.time30, label:"30 minutos al día", sub:"Progreso intensivo",           recommended:false },
    { value:"15", img:IMG.time15, label:"15 minutos al día", sub:"Recomendado para comenzar ⭐", recommended:true  },
    { value:"5",  img:IMG.time5,  label:"5 minutos al día",  sub:"Progreso gradual",             recommended:false },
  ];
  return (
    <div>
      <ProgressBar pct={75}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:6,textAlign:"center"}}>¿Cuánto tiempo al día?</h2>
      <p style={{color:MUTED,textAlign:"center",fontSize:13,marginBottom:20}}>Elige algo que puedas mantener</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {opts.map(o=>(
          <button key={o.value} onClick={()=>onSelect(o.value)} style={{
            width:"100%",padding:"16px",borderRadius:14,textAlign:"left",cursor:"pointer",
            border:`1.5px solid ${selected===o.value?G:o.recommended?"rgba(174,234,0,0.3)":"#222"}`,
            background:selected===o.value?"rgba(174,234,0,0.07)":CARD,
            transition:"all .15s",display:"flex",alignItems:"center",gap:14,
          }}>
            <img src={o.img} alt={o.label} style={{width:44,height:44,objectFit:"contain",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:TEXT}}>{o.label}</div>
              <div style={{fontSize:12,color:o.recommended?G:MUTED,marginTop:2}}>{o.sub}</div>
            </div>
            {selected===o.value&&(
              <div style={{
                width:22,height:22,borderRadius:"50%",background:G,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,fontWeight:800,color:"#000",flexShrink:0,
              }}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScreenReadyForTest({ onNext }: { onNext:()=>void }) {
  return (
    <div style={{textAlign:"center"}}>
      <ProgressBar pct={80}/>
      <div style={{
        width:100,height:100,borderRadius:"50%",margin:"0 auto 20px",
        background:`radial-gradient(circle, rgba(174,234,0,0.15) 0%, transparent 70%)`,
        border:`2px solid rgba(174,234,0,0.3)`,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,
      }}>🧠</div>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:12}}>¿Listo para una prueba rápida?</h2>
      <p style={{color:MUTED,marginBottom:20,lineHeight:1.6,fontSize:14}}>
        Identificaremos tu nivel real de vocabulario y gramática.<br/>
        Solo toma 2 minutos y mejora mucho la precisión de tu plan.
      </p>
      <div style={{
        background:"rgba(174,234,0,0.06)",border:"1px solid rgba(174,234,0,0.2)",
        borderRadius:12,padding:"12px 16px",marginBottom:24,
        display:"flex",alignItems:"center",gap:10,fontSize:13,textAlign:"left",
      }}>
        <span>💡</span>
        <span>No te preocupes si no sabes todo — ese es el punto</span>
      </div>
      <Btn onClick={onNext}>Comenzar prueba</Btn>
    </div>
  );
}

function ScreenVocabTest({ words, selected, onToggle, onNext, level, pct }: {
  words:string[]; selected:string[]; onToggle:(w:string)=>void; onNext:()=>void; level:string; pct:number;
}) {
  return (
    <div>
      <ProgressBar pct={pct}/>
      <h2 style={{fontSize:20,fontWeight:800,marginBottom:4,textAlign:"center"}}>Selecciona las palabras que conozcas</h2>
      <p style={{color:G,textAlign:"center",marginBottom:20,fontWeight:700,fontSize:13}}>{level}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24}}>
        {words.map(w=>(
          <button key={w} onClick={()=>onToggle(w)} style={{
            padding:"10px 18px",borderRadius:50,cursor:"pointer",fontWeight:600,fontSize:14,
            border:`1.5px solid ${selected.includes(w)?G:"#2a2a3a"}`,
            background:selected.includes(w)?"rgba(174,234,0,0.12)":CARD,
            color:selected.includes(w)?G:TEXT,transition:"all .15s",
          }}>{w}</button>
        ))}
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenGrammar({ q, qIndex, total, onAnswer }: {
  q:{question:string;options:string[];correct:string}; qIndex:number; total:number; onAnswer:(a:string)=>void;
}) {
  const [chosen, setChosen] = useState<string|null>(null);
  const handle = (opt:string)=>{ if(chosen) return; setChosen(opt); setTimeout(()=>onAnswer(opt),700); };
  const sentence = q.question.split("___");
  return (
    <div>
      <ProgressBar pct={88+qIndex*2}/>
      <p style={{color:MUTED,textAlign:"center",marginBottom:16,fontSize:13}}>Gramática · Pregunta {qIndex+1} de {total}</p>
      <div style={{
        background:CARD,borderRadius:16,padding:"20px",marginBottom:24,
        textAlign:"center",lineHeight:2,fontSize:16,border:"1px solid #1e1e2e",
      }}>
        {sentence[0]}
        <span style={{
          display:"inline-block",minWidth:90,borderBottom:`2px solid ${G}`,
          margin:"0 4px",color:chosen||"transparent",fontWeight:700,color:G,
        }}>{chosen||"    "}</span>
        {sentence[1]}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {q.options.map(opt=>{
          const isCorrect = opt===q.correct, isChosen = opt===chosen;
          let bg=CARD, border="#222", color=TEXT;
          if(chosen){
            if(isCorrect){bg="rgba(174,234,0,0.1)";border=G;color=G;}
            else if(isChosen){bg="rgba(255,68,68,0.08)";border="#FF4444";color="#FF4444";}
          }
          return (
            <button key={opt} onClick={()=>handle(opt)} style={{
              width:"100%",padding:"14px",borderRadius:14,
              border:`1.5px solid ${border}`,background:bg,color,
              textAlign:"center",cursor:chosen?"default":"pointer",
              fontWeight:600,fontSize:15,transition:"all .2s",
            }}>
              {chosen&&isCorrect&&"✓ "}{opt}{chosen&&isChosen&&!isCorrect&&" ✗"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScreenTestComplete({ level, onNext }: { level:string; onNext:()=>void }) {
  const cur = getLevelLabel(level), nxt = getNextLevel(level);
  return (
    <div style={{textAlign:"center"}}>
      <div style={{
        display:"inline-block",background:"rgba(174,234,0,0.1)",border:`1px solid ${G}`,
        borderRadius:50,padding:"6px 18px",fontSize:12,fontWeight:800,color:G,
        marginBottom:16,letterSpacing:1,
      }}>🎉 ¡PRUEBA COMPLETADA!</div>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:20}}>Tu nivel estimado</h2>

      <div style={{
        background:CARD,borderRadius:20,padding:24,marginBottom:20,
        border:"1px solid #1e1e2e",
      }}>
        <div style={{display:"flex",justifyContent:"center",gap:40,marginBottom:20}}>
          <div>
            <div style={{color:MUTED,fontSize:11,marginBottom:4}}>Nivel actual</div>
            <div style={{fontSize:48,fontWeight:900,color:TEXT}}>{cur}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",fontSize:24}}>→</div>
          <div>
            <div style={{color:MUTED,fontSize:11,marginBottom:4}}>Tu objetivo</div>
            <div style={{fontSize:48,fontWeight:900,color:G}}>{nxt}</div>
          </div>
        </div>
        <div style={{
          background:"rgba(174,234,0,0.06)",borderRadius:10,padding:"10px 14px",
          fontSize:13,color:MUTED,
        }}>
          Con iola Speak llegarás a <strong style={{color:G}}>{nxt}</strong> el <strong style={{color:TEXT}}>{addDays(30)}</strong>
        </div>
      </div>

      <svg viewBox="0 0 280 80" style={{width:"100%",marginBottom:20}}>
        <path d="M 20 70 C 80 68 140 35 260 10" fill="none" stroke="#1e1e2e" strokeWidth="2"/>
        <path d="M 20 70 C 80 68 140 35 260 10" fill="none" stroke={G} strokeWidth="3" strokeDasharray="300" strokeDashoffset="80"/>
        <circle cx="20" cy="70" r="7" fill={G}/>
        <text x="20" y="80" textAnchor="middle" fill={MUTED} fontSize="9">Hoy</text>
        <circle cx="260" cy="10" r="7" fill="#00D4FF"/>
        <text x="260" y="8" textAnchor="middle" fill="#00D4FF" fontSize="9">{addDays(30)}</text>
      </svg>

      <Btn onClick={onNext}>Ver mi plan completo</Btn>
    </div>
  );
}

function ScreenWhatToExpect({ slide, onNext }: { slide:number; onNext:()=>void }) {
  const slides = [
    { period:"Semana 1", value:"120", unit:"nuevas palabras",       scenario:"Presentarte en inglés",                     img:IMG.week1   },
    { period:"Semana 4", value:"24",  unit:"situaciones dominadas", scenario:"Hacer un pedido en un restaurante",          img:IMG.week4   },
    { period:"Mes 12",   value:"",    unit:"Fluidez natural",       scenario:"Hablar con confianza en cualquier situación",img:IMG.month12 },
  ];
  const s = slides[slide];
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:20,textAlign:"center"}}>Qué puedes esperar</h2>
      {/* Photo card */}
      <div style={{position:"relative",borderRadius:20,overflow:"hidden",marginBottom:20,height:200}}>
        <img src={s.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{
          position:"absolute",inset:0,
          background:"linear-gradient(to bottom, rgba(9,9,15,0) 30%, rgba(9,9,15,0.9) 100%)",
        }}/>
        <div style={{position:"absolute",top:14,left:14}}>
          <span style={{
            background:G,color:"#000",fontWeight:800,fontSize:12,
            padding:"4px 12px",borderRadius:50,
          }}>{s.period}</span>
        </div>
        <div style={{position:"absolute",bottom:16,left:16,right:16,textAlign:"center"}}>
          {s.value&&<div style={{fontSize:52,fontWeight:900,color:TEXT,lineHeight:1}}>{s.value}</div>}
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:14,marginTop:4}}>{s.unit}</div>
        </div>
      </div>
      <div style={{
        background:CARD,borderRadius:14,padding:"14px 16px",marginBottom:24,
        border:"1px solid #1e1e2e",display:"flex",alignItems:"center",gap:10,
      }}>
        <span style={{fontSize:20}}>🎯</span>
        <div>
          <div style={{color:G,fontSize:11,fontWeight:700,marginBottom:2}}>APRENDE A</div>
          <div style={{fontWeight:700,fontSize:14}}>{s.scenario}</div>
        </div>
      </div>
      {/* Dot indicators */}
      <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:20}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{
            width:i===slide?24:8,height:8,borderRadius:4,
            background:i===slide?G:"#222",transition:"all .3s",
          }}/>
        ))}
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenVideoTestimonial({ onNext }: { onNext:()=>void }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:6,textAlign:"center"}}>Escucha a nuestros estudiantes</h2>
      <p style={{color:MUTED,textAlign:"center",fontSize:13,marginBottom:20}}>Resultados reales en semanas</p>

      {/* Video embed */}
      <div style={{
        position:"relative",borderRadius:20,overflow:"hidden",marginBottom:16,
        aspectRatio:"16/9",background:"#000",cursor:"pointer",
      }} onClick={()=>setPlaying(true)}>
        {!playing?(
          <>
            <img src={IMG.videoThumb} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(9,9,15,0.45)"}}/>
            <div style={{
              position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              <div style={{
                width:68,height:68,borderRadius:"50%",
                background:"rgba(174,234,0,0.95)",
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:`0 0 40px rgba(174,234,0,0.4)`,
              }}>
                <svg viewBox="0 0 24 24" fill="#000" style={{width:28,height:28,marginLeft:4}}>
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </>
        ):(
          <iframe
            src={`https://iframe.cloudflarestream.com/${CF_VIDEO_ID}?autoplay=true&muted=false`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{width:"100%",height:"100%",border:"none"}}
          />
        )}
      </div>

      {/* Mini testimonials */}
      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {TESTIMONIALS.map((t,i)=>(
          <div key={i} style={{
            flexShrink:0,width:180,background:CARD,borderRadius:12,padding:12,
            border:"1px solid #1e1e2e",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <img src={t.av} alt={t.name} style={{width:28,height:28,borderRadius:"50%",objectFit:"cover"}}/>
              <span style={{fontWeight:700,fontSize:12}}>{t.name}</span>
            </div>
            <div style={{color:"#FFB800",fontSize:10,marginBottom:4}}>{stars(t.stars)}</div>
            <p style={{color:MUTED,fontSize:11,lineHeight:1.4,margin:0}}>{t.text}</p>
          </div>
        ))}
      </div>
      <Btn onClick={onNext}>Siguiente</Btn>
    </div>
  );
}

function ScreenAIChat({ onNext }: { onNext:()=>void }) {
  const [step, setStep] = useState(0);
  const messages = [
    "📈 Estoy analizando tu perfil... Veo que tienes potencial real para llegar a B2 rápido.",
    "🎯 Tu plan incluye lecciones cortas de video, práctica de conversación con IA y ejercicios de pronunciación.",
    "⏱️ ¡Ya casi listo! Estoy preparando tu programa de sesiones diarias personalizadas.",
  ];
  useEffect(()=>{
    if(step<messages.length){ const t=setTimeout(()=>setStep(s=>s+1),1500); return ()=>clearTimeout(t); }
  },[step]);
  const ready = step>=messages.length;
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:24,textAlign:"center"}}>Toques finales</h2>
      {/* Tutor header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <div style={{position:"relative",flexShrink:0}}>
          <img src={IMG.tutor} alt="iola" style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",border:`2px solid ${G}`}}/>
          <div style={{position:"absolute",bottom:0,right:0,width:12,height:12,borderRadius:"50%",background:"#22C55E",border:"2px solid #09090F"}}/>
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:14}}>iola IA</div>
          <div style={{color:G,fontSize:11,fontWeight:600}}>● En línea ahora</div>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24,minHeight:220}}>
        {messages.slice(0,step).map((msg,i)=>(
          <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",animation:"fadeIn .4s ease-out"}}>
            <img src={IMG.tutor} alt="" style={{width:32,height:32,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
            <div style={{
              background:CARD2,borderRadius:"18px 18px 18px 4px",
              padding:"12px 16px",fontSize:14,lineHeight:1.6,
              border:"1px solid #1e1e2e",maxWidth:"85%",
            }}>{msg}</div>
          </div>
        ))}
        {step<messages.length&&(
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <img src={IMG.tutor} alt="" style={{width:32,height:32,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
            <div style={{background:CARD2,borderRadius:"18px 18px 18px 4px",padding:"14px 20px",border:"1px solid #1e1e2e"}}>
              <div style={{display:"flex",gap:5,alignItems:"center",height:18}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{
                    width:8,height:8,borderRadius:"50%",background:G,
                    animation:`bounce .8s ease-in-out ${i*.2}s infinite`,
                  }}/>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Btn onClick={onNext} disabled={!ready}>{ready?"Siguiente":"Procesando..."}</Btn>
    </div>
  );
}

function ScreenEmail({ email, onEmail, onNext }: {
  email:string; onEmail:(e:string)=>void; onNext:()=>void;
}) {
  const code = useRef(Math.random().toString(36).substring(2,7).toUpperCase()).current;
  return (
    <div>
      {/* Plan ready banner */}
      <div style={{
        background:`linear-gradient(135deg,rgba(174,234,0,0.15),rgba(0,212,255,0.07))`,
        border:`1px solid rgba(174,234,0,0.25)`,borderRadius:20,
        padding:"20px 16px",marginBottom:24,textAlign:"center",
      }}>
        <div style={{fontSize:36,marginBottom:8}}>✅</div>
        <div style={{fontWeight:900,fontSize:18,marginBottom:4}}>
          ¡Tu plan <span style={{color:G}}>#{code}</span> está listo!
        </div>
        <div style={{color:MUTED,fontSize:13}}>Personalizado para tu nivel y objetivos</div>
      </div>

      <AvatarRow avatars={[IMG.av1,IMG.av2,IMG.av3,IMG.av4]}/>
      <p style={{textAlign:"center",color:MUTED,fontSize:12,marginBottom:20}}>
        Únete a <strong style={{color:TEXT}}>500,000+</strong> estudiantes de iola Speak
      </p>

      <div style={{position:"relative",marginBottom:16}}>
        <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:18}}>✉️</span>
        <input type="email" placeholder="Tu email" value={email} onChange={e=>onEmail(e.target.value)}
          style={{
            width:"100%",padding:"16px 18px 16px 48px",borderRadius:14,
            border:`1.5px solid ${email?G:"#2a2a3a"}`,
            background:CARD,color:TEXT,fontSize:16,outline:"none",
            boxSizing:"border-box",fontFamily:"inherit",
          }}
        />
      </div>
      <Btn onClick={onNext} disabled={!email.includes("@")}>Obtener mi plan personalizado →</Btn>
      <p style={{color:MUTED,fontSize:11,marginTop:12,lineHeight:1.6,textAlign:"center"}}>
        Al continuar, aceptas los <u style={{cursor:"pointer"}}>Términos de uso</u> y{" "}
        <u style={{cursor:"pointer"}}>Política de privacidad</u> de iola Speak
      </p>
    </div>
  );
}

function ScreenPaywall({ selectedPlan, onSelectPlan }: {
  selectedPlan:string; onSelectPlan:(id:string)=>void;
}) {
  return (
    <div>
      {/* Urgency header */}
      <div style={{
        background:"rgba(255,68,68,0.08)",border:"1px solid rgba(255,68,68,0.2)",
        borderRadius:12,padding:"10px 14px",marginBottom:20,
        display:"flex",alignItems:"center",gap:10,fontSize:13,
      }}>
        <span>⏰</span>
        <span>Oferta especial termina en <CountdownTimer seconds={600}/></span>
      </div>

      <h2 style={{fontSize:22,fontWeight:900,textAlign:"center",marginBottom:6,lineHeight:1.3}}>
        ¡Elige tu plan y<br/>comienza hoy!
      </h2>
      <p style={{color:MUTED,textAlign:"center",fontSize:13,marginBottom:20}}>Cancela cuando quieras. Sin compromisos.</p>

      {/* Plans */}
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
        {PLANS.map(plan=>(
          <div key={plan.id} onClick={()=>onSelectPlan(plan.id)} style={{
            borderRadius:16,border:`2px solid ${selectedPlan===plan.id?G:"#222"}`,
            background:selectedPlan===plan.id?"rgba(174,234,0,0.05)":CARD,
            padding:"16px 18px",cursor:"pointer",transition:"all .15s",position:"relative",
          }}>
            {plan.popular&&(
              <div style={{
                position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",
                background:G,color:"#000",fontSize:11,fontWeight:800,
                padding:"3px 16px",borderRadius:50,letterSpacing:.5,whiteSpace:"nowrap",
              }}>⭐ EL MÁS POPULAR</div>
            )}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{
                  width:22,height:22,borderRadius:"50%",flexShrink:0,
                  border:`2px solid ${selectedPlan===plan.id?G:"#444"}`,
                  background:selectedPlan===plan.id?G:"transparent",
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>
                  {selectedPlan===plan.id&&<span style={{color:"#000",fontSize:10,fontWeight:900}}>✓</span>}
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:15}}>{plan.label}</div>
                  <div style={{
                    display:"inline-block",background:"rgba(174,234,0,0.12)",color:G,
                    fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:10,marginTop:3,
                  }}>{plan.save}</div>
                  <div style={{color:MUTED,fontSize:12,marginTop:3}}>
                    <s style={{marginRight:4}}>{plan.originalTotal}</s>
                    <strong style={{color:TEXT}}>{plan.saleTotal}</strong>
                  </div>
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontWeight:900,fontSize:26,color:TEXT,lineHeight:1}}>{plan.perDay}</div>
                <div style={{color:MUTED,fontSize:11}}>por día</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee */}
      <div style={{
        background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.2)",
        borderRadius:12,padding:"12px 16px",marginBottom:20,
        display:"flex",alignItems:"center",gap:12,
      }}>
        <span style={{fontSize:28,flexShrink:0}}>🛡️</span>
        <div>
          <div style={{fontWeight:700,fontSize:13,color:"#22C55E"}}>Garantía de 14 días</div>
          <div style={{color:MUTED,fontSize:12,marginTop:2}}>
            Si no estás satisfecho, te devolvemos el 100% del dinero. Sin preguntas.
          </div>
        </div>
      </div>

      <button style={{
        width:"100%",padding:"18px 0",borderRadius:50,border:"none",
        background:`linear-gradient(135deg,${G},#88D400)`,
        color:"#000",fontWeight:900,fontSize:18,cursor:"pointer",marginBottom:8,
        boxShadow:`0 4px 24px rgba(174,234,0,0.3)`,
      }}>
        Obtener mi plan →
      </button>

      <div style={{
        textAlign:"center",color:MUTED,fontSize:12,
        display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:20,
      }}>
        🔒 Pago seguro · Visa · Mastercard · PayPal
      </div>

      {/* What you get */}
      <h3 style={{fontSize:16,fontWeight:800,marginBottom:14,color:G}}>Qué obtienes con iola Speak</h3>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
        {[
          ["🎬","Lecciones de video con hablantes nativos"],
          ["🤖","IA que te corrige en tiempo real"],
          ["🎙️","Entrenamiento de pronunciación"],
          ["📖","Más de 8.500 palabras con repetición espaciada"],
          ["📊","Plan personalizado que evoluciona contigo"],
          ["✅","Conversaciones en situaciones reales"],
        ].map(([icon,text])=>(
          <div key={text as string} style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:14}}>
            <span style={{flexShrink:0}}>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Comparison */}
      <h3 style={{fontSize:16,fontWeight:800,marginBottom:14,textAlign:"center"}}>
        50× más barato que un tutor
      </h3>
      <div style={{borderRadius:16,overflow:"hidden",border:"1px solid #1e1e2e",marginBottom:28}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:"#141420",padding:"10px 16px",fontWeight:700,fontSize:13}}>
          <span style={{color:G}}>iola Speak</span>
          <span style={{textAlign:"right",color:MUTED}}>Tutor privado</span>
        </div>
        {[
          ["Retroalimentación instantánea","Con demora"],
          ["Disponible 24/7","Agenda con días de anticipación"],
          ["Voces y acentos variados","Un solo acento"],
          ["Sin presión ni estrés","Puede ser estresante"],
          ["Desde $0.39/día","$30–80/hora"],
        ].map(([a,b],i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"10px 16px",borderTop:"1px solid #1e1e2e",fontSize:12}}>
            <span>✅ {a}</span>
            <span style={{textAlign:"right",color:MUTED}}>❌ {b}</span>
          </div>
        ))}
      </div>

      {/* Social proof bottom */}
      <AvatarRow avatars={[IMG.av1,IMG.av2,IMG.av3,IMG.av4,IMG.av5,IMG.av6]}/>
      <p style={{textAlign:"center",color:MUTED,fontSize:12,marginBottom:24}}>
        <strong style={{color:G}}>500,000+</strong> estudiantes ya abrieron el mundo con iola Speak
      </p>

      <button style={{
        width:"100%",padding:"18px 0",borderRadius:50,border:"none",
        background:`linear-gradient(135deg,${G},#88D400)`,
        color:"#000",fontWeight:900,fontSize:18,cursor:"pointer",
        boxShadow:`0 4px 24px rgba(174,234,0,0.3)`,marginBottom:20,
      }}>
        Obtener mi plan →
      </button>

      <p style={{color:MUTED,fontSize:11,textAlign:"center",lineHeight:1.6}}>
        La suscripción se renueva automáticamente. Cancela 24h antes del próximo periodo para no ser cobrado.
      </p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function IolaQuiz() {
  const [screen, setScreen] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<QuizState>({
    language:"es", name:"", level:"", studyMethod:[], goal:"",
    difficulties:[], topics:[], practiceTime:"",
    vocabA1:[], vocabB1:[], vocabC1:[], email:"", selectedPlan:"month",
  });

  const next = () => {
    setScreen(s=>s+1);
    topRef.current?.scrollIntoView({behavior:"smooth"});
  };
  const toggle = (key: keyof QuizState, val: string) => setState(s=>{
    const arr = s[key] as string[];
    return {...s, [key]: arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]};
  });
  const set = (key: keyof QuizState, val: string) => setState(s=>({...s,[key]:val}));

  const screens: React.ReactNode[] = [
    <ScreenIntro onNext={next}/>,
    <ScreenLanguage selected={state.language} onSelect={v=>set("language",v)} onNext={next}/>,
    <ScreenName name={state.name} onName={v=>set("name",v)} onNext={next} onSkip={next}/>,
    <ScreenTransition name={state.name} onNext={next}/>,
    <ScreenLevel selected={state.level} onSelect={v=>{set("level",v);setTimeout(next,350);}}/>,
    <ScreenStudyMethod selected={state.studyMethod} onToggle={v=>toggle("studyMethod",v)} onNext={next}/>,
    <ScreenBrainScience onNext={next}/>,
    <ScreenGoal selected={state.goal} onSelect={v=>{set("goal",v);setTimeout(next,350);}}/>,
    <ScreenTrust onNext={next}/>,
    <ScreenDifficulties selected={state.difficulties} onToggle={v=>toggle("difficulties",v)} onNext={next}/>,
    <ScreenDifficultyExplanation difficulty={state.difficulties[0]||"Falta de práctica"} onNext={next}/>,
    <ScreenTopics selected={state.topics} onToggle={v=>toggle("topics",v)} onNext={next}/>,
    <ScreenSocialProof onNext={next}/>,
    <ScreenPracticeTime selected={state.practiceTime} onSelect={v=>{set("practiceTime",v);setTimeout(next,350);}}/>,
    <ScreenReadyForTest onNext={next}/>,
    <ScreenVocabTest words={VOCAB_A1} selected={state.vocabA1} onToggle={w=>toggle("vocabA1",w)} onNext={next} level="A1–A2 · Principiante" pct={82}/>,
    <ScreenVocabTest words={VOCAB_B1} selected={state.vocabB1} onToggle={w=>toggle("vocabB1",w)} onNext={next} level="B1–B2 · Intermedio" pct={85}/>,
    <ScreenVocabTest words={VOCAB_C1} selected={state.vocabC1} onToggle={w=>toggle("vocabC1",w)} onNext={next} level="C1–C2 · Avanzado" pct={88}/>,
    ...GRAMMAR_QUESTIONS.map((q,i)=>(
      <ScreenGrammar key={`g${i}`} q={q} qIndex={i} total={GRAMMAR_QUESTIONS.length} onAnswer={()=>next()}/>
    )),
    <ScreenTestComplete level={state.level} onNext={next}/>,
    <ScreenWhatToExpect slide={0} onNext={next}/>,
    <ScreenWhatToExpect slide={1} onNext={next}/>,
    <ScreenWhatToExpect slide={2} onNext={next}/>,
    <ScreenVideoTestimonial onNext={next}/>,
    <ScreenAIChat onNext={next}/>,
    <ScreenEmail email={state.email} onEmail={v=>set("email",v)} onNext={next}/>,
    <ScreenPaywall selectedPlan={state.selectedPlan} onSelectPlan={v=>set("selectedPlan",v)}/>,
  ];

  return (
    <div style={{background:DARK,color:TEXT,minHeight:"100vh",fontFamily:"Inter,system-ui,sans-serif"}}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        *{box-sizing:border-box}
        input,button{font-family:inherit}
        ::-webkit-scrollbar{width:0}
      `}</style>
      <div ref={topRef}/>
      <div style={{maxWidth:430,margin:"0 auto",padding:"28px 18px 60px",minHeight:"100vh"}}>
        {/* Top logo bar */}
        {screen>0&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <Logo/>
            <div style={{color:MUTED,fontSize:12}}>{screen}/{screens.length-1}</div>
          </div>
        )}
        <div key={screen} style={{animation:"fadeIn .3s ease-out"}}>
          {screens[Math.min(screen,screens.length-1)]}
        </div>
      </div>
    </div>
  );
}
