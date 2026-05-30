import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import meditationSilhouette from "@/assets/meditation-silhouette.webp";
import programaPulso369 from "@/assets/programa-pulso369.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "PULSO 369™ — Sistema de Activación Theta | +100 Audios de Reprogramación Subconsciente" },
      { name: "description", content: "Elimina ansiedad, estrés y bloqueos mentales con +100 audios de reprogramación subconsciente. Acceso inmediato. Garantía 30 días." },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { property: "og:title", content: "PULSO 369™ — Sistema de Activación Theta" },
      { property: "og:description", content: "+100 audios de reprogramación subconsciente. Transforma tu mente en 7 minutos." },
    ],
    links: [
      { rel: "preload", href: "/fonts/cinzel-700.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/fonts/nunito-400.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://res.cloudinary.com" },
      { rel: "dns-prefetch", href: "https://www.youtube.com" },
      { rel: "dns-prefetch", href: "https://connect.facebook.net" },
    ],
    scripts: [
      {
        children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1570966634049561');fbq('track','PageView');(function(){var loaded=false;function load(){if(loaded)return;loaded=true;var t=document.createElement('script');t.async=true;t.src='https://connect.facebook.net/en_US/fbevents.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(t,s);cleanup()}var evts=['scroll','mousemove','touchstart','keydown','click'];function cleanup(){evts.forEach(function(e){window.removeEventListener(e,load,{passive:true})})}evts.forEach(function(e){window.addEventListener(e,load,{passive:true,once:true})});setTimeout(load,4000)})();`,
      },
      {
        src: "https://cdn.utmify.com.br/scripts/utms/latest.js",
        async: true,
        defer: true,
        
      },
    ],
  }),
});

// ----- Helpers -----
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function openPayment(url: string) {
  const width = Math.min(480, window.innerWidth - 40);
  const height = Math.min(700, window.innerHeight - 40);
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  let abandoned = false;
  const popup = window.open(
    url,
    `hotmart_checkout_${Date.now()}`,
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
  );
  if (!popup || popup.closed || typeof popup.closed === "undefined") {
    window.location.href = url;
    return;
  }
  try {
    window.fbq?.("track", "InitiateCheckout");
  } catch {}
  // Detect abandoned main checkout → trigger downsell immediately
  if (url === PAY_MAIN) {
    let timer: ReturnType<typeof setInterval>;
    const fire = () => {
      if (abandoned) return;
      abandoned = true;
      clearInterval(timer);
      try { window.focus(); } catch {}
      window.dispatchEvent(new CustomEvent("pulso369:checkout-abandoned"));
    };
    const checkClosed = () => {
      try {
        if (popup.closed) fire();
      } catch {
        fire();
      }
    };
    timer = setInterval(() => {
      checkClosed();
    }, 250);
    window.setTimeout(() => clearInterval(timer), 20 * 60 * 1000);
    try { popup.focus(); } catch {}
  }
}

const PAY_MAIN = "https://pay.hotmart.com/D104670166G?off=3mjpzfny&checkoutMode=10";
const PAY_DOWN = "https://pay.hotmart.com/D104670166G?off=txwv0h80&checkoutMode=10";

// Reveal wrapper
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{ animation: "fadeUp .6s ease-out both", animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// ----- Hero Particles Canvas -----
function ParticlesCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.readyState === "complete") setReady(true);
    else {
      const onLoad = () => setReady(true);
      window.addEventListener("load", onLoad, { once: true });
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);
  useEffect(() => {
    if (!ready) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    // Skip particles entirely on mobile or reduced-motion → big perf win, no visual loss
    if (reduceMotion || isMobile) return;
    let raf = 0;
    let running = false;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const COUNT = 40;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };

    type P = { x: number; y: number; r: number; a: number; s: number };
    const particles: P[] = [];

    const init = () => {
      resize();
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: (0.5 + Math.random() * 1.5) * dpr,
          a: 0.1 + Math.random() * 0.5,
          s: (0.2 + Math.random() * 0.6) * dpr,
        });
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.s;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      init();
      tick();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible && document.visibilityState === "visible") start();
      else stop();
    }, { threshold: 0.05 });
    io.observe(canvas);

    const onVis = () => {
      if (document.visibilityState === "visible" && visible) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [ready]);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" style={{ willChange: "transform" }} aria-hidden />;
}

// ----- Countdown -----
function Countdown() {
  const [t, setT] = useState({ h: 0, m: 15, s: 0 });
  useEffect(() => {
    const KEY = "pulso369_expiry_15";
    const DUR = 15 * 60 * 1000;
    let exp = Number(sessionStorage.getItem(KEY) || 0);
    if (!exp || exp < Date.now()) {
      exp = Date.now() + DUR;
      sessionStorage.setItem(KEY, String(exp));
    }
    const tick = () => {
      const d = Math.max(0, exp - Date.now());
      setT({
        h: Math.floor(d / 3600000),
        m: Math.floor((d % 3600000) / 60000),
        s: Math.floor((d % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex justify-center gap-3 sm:gap-5 my-6">
      {[
        { v: t.h, l: "Horas" },
        { v: t.m, l: "Minutos" },
        { v: t.s, l: "Segundos" },
      ].map((x) => (
        <div key={x.l} className="text-center">
          <div
            className="font-cinzel font-bold text-[clamp(2.2rem,8vw,3.5rem)] leading-none"
            style={{ color: "#D4AF37" }}
          >
            {pad(x.v)}
          </div>
          <div className="text-[11px] uppercase tracking-widest mt-1" style={{ color: "#9090B8" }}>
            {x.l}
          </div>
        </div>
      ))}
    </div>
  );
}

const RECENT_ACCESS = [
  { name: "María G.", flag: "🇲🇽" },
  { name: "Carlos Ruiz", flag: "🇪🇸" },
  { name: "Ana L.", flag: "🇦🇷" },
  { name: "Roberto M.", flag: "🇨🇴" },
  { name: "Laura Pérez", flag: "🇨🇱" },
  { name: "Diego S.", flag: "🇵🇪" },
  { name: "Valentina R.", flag: "🇺🇾" },
  { name: "Sofía Herrera", flag: "🇪🇨" },
  { name: "Andrés V.", flag: "🇩🇴" },
  { name: "Camila Torres", flag: "🇨🇷" },
];

// ----- Animated Counter (increments by 1 every 8s, elegant transition) -----
function AnimatedCounter({ start = 12800, prefix = "+", intervalMs = 8000, className = "", style }: { start?: number; prefix?: string; intervalMs?: number; className?: string; style?: React.CSSProperties }) {
  const [n, setN] = useState(start);
  const [notice, setNotice] = useState<(typeof RECENT_ACCESS)[number] | null>(null);
  useEffect(() => {
    const KEY = "pulso369_counter_base";
    const T = "pulso369_counter_t0";
    let base = Number(localStorage.getItem(KEY));
    let t0 = Number(localStorage.getItem(T));
    if (!base || base < start) { base = start; localStorage.setItem(KEY, String(base)); }
    if (!t0) { t0 = Date.now(); localStorage.setItem(T, String(t0)); }
    const compute = () => base + Math.floor((Date.now() - t0) / intervalMs);
    setN(compute());
    // Poll every 2s instead of every 1s — counter only changes every 8s
    const id = setInterval(() => {
      if (document.hidden) return;
      const next = compute();
      setN((current) => {
        if (next > current) {
          const person = RECENT_ACCESS[next % RECENT_ACCESS.length];
          setNotice(person);
          window.setTimeout(() => setNotice((shown) => (shown === person ? null : shown)), 4600);
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [start, intervalMs]);
  const formatted = n.toLocaleString("en-US");
  return (
    <span className="relative inline-flex flex-col items-center align-baseline">
      <span className={`inline-flex items-baseline ${className}`} style={style}>
        {prefix}
        <span className="relative inline-block tabular-nums" style={{ minWidth: "0.5em" }}>
          <span
            key={formatted}
            className="inline-block"
            style={{ animation: "numFlip .55s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            {formatted}
          </span>
        </span>
      </span>
      {notice && (
        <span
          key={`${notice.name}-${n}`}
          className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold"
          style={{
            transform: "translateX(-50%)",
            background: "rgba(6,6,15,0.94)",
            border: "1px solid rgba(212,175,55,0.55)",
            color: "#EEE8FF",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            backdropFilter: "blur(8px)",
            animation: "popIn .45s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <span style={{ marginRight: 6 }}>{notice.flag}</span>
          {notice.name} accedió al programa
        </span>
      )}
    </span>
  );
}

function LiveCounter({ className = "", style, prefix = "+" }: { className?: string; style?: React.CSSProperties; prefix?: string }) {
  const START = 19233;
  const [n, setN] = useState(START);
  const [live, setLive] = useState(false);
  useEffect(() => {
    setLive(true);
    const id = setInterval(() => {
      if (document.hidden) return;
      setN((v) => v + 1);
    }, 25000);
    return () => clearInterval(id);
  }, []);
  const formatted = n.toLocaleString("en-US");
  return (
    <span className={`inline-flex items-baseline tabular-nums ${className}`} style={style} suppressHydrationWarning>
      {prefix}
      <span className="relative inline-block">
        <span
          key={live ? formatted : "intro"}
          className="inline-block"
          style={live ? { animation: "numFlip .55s cubic-bezier(0.22,1,0.36,1) both" } : undefined}
        >
          {formatted}
        </span>
      </span>
    </span>
  );
}

// ----- Testimonial Video (autoplay muted on view, button to unmute) -----
function TestimonialVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [load, setLoad] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { setLoad(true); io.disconnect(); break; }
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const post = (func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  };

  const toggleSound = () => {
    if (muted) { post("unMute"); post("playVideo"); setMuted(false); }
    else { post("mute"); setMuted(true); }
  };

  const src = "https://www.youtube.com/embed/xGDPqS2Or0k?autoplay=1&mute=1&loop=1&playlist=xGDPqS2Or0k&controls=0&playsinline=1&modestbranding=1&rel=0&enablejsapi=1";

  return (
    <div ref={wrapRef} className="relative" style={{ aspectRatio: "9/16", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(212,175,55,0.4)", boxShadow: "0 0 40px rgba(212,175,55,0.15)" }}>
      {load && (
        <iframe
          ref={iframeRef}
          src={src}
          title="Testimonio Pulso 369"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      )}
      <button
        onClick={toggleSound}
        className="absolute left-1/2 -translate-x-1/2 top-3 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
        style={{
          background: muted ? "linear-gradient(135deg,#F0CE6A,#D4AF37)" : "rgba(0,0,0,0.6)",
          color: muted ? "#06060F" : "#EEE8FF",
          border: "1px solid rgba(212,175,55,0.6)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          backdropFilter: "blur(6px)",
          zIndex: 2,
        }}
      >
        {muted ? "🔊 Pulsa aquí para activar el audio" : "🔇 Silenciar"}
      </button>
    </div>
  );
}

// ----- Custom Audio Player capped at 4:00 -----
const CAP = 240;
function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}
function AudioPreview() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => {
      if (el.currentTime >= CAP) {
        el.pause();
        el.currentTime = CAP;
        setPlaying(false);
        setTime(CAP);
      } else {
        setTime(el.currentTime);
      }
    };
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      if (el.currentTime >= CAP) el.currentTime = 0;
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = ref.current;
    if (!el) return;
    const v = Math.min(CAP, Math.max(0, Number(e.target.value)));
    el.currentTime = v;
    setTime(v);
  };

  return (
    <div
      className="w-full rounded-2xl p-4 flex items-center gap-3"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.25)" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button
        onClick={toggle}
        aria-label={playing ? "Pausar" : "Reproducir"}
        className="shrink-0 rounded-full flex items-center justify-center"
        style={{
          width: 48,
          height: 48,
          background: "linear-gradient(135deg,#F0CE6A,#D4AF37)",
          color: "#06060F",
          fontWeight: 700,
        }}
      >
        {playing ? "❚❚" : "▶"}
      </button>
      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs tabular-nums" style={{ color: "#9090B8" }}>{fmt(time)}</span>
        <input
          type="range"
          min={0}
          max={CAP}
          step={0.1}
          value={time}
          onChange={seek}
          className="flex-1 accent-[#D4AF37]"
          style={{ height: 4 }}
        />
        <span className="text-xs tabular-nums" style={{ color: "#9090B8" }}>{fmt(CAP)}</span>
      </div>
      <audio
        ref={ref}
        id="pulso-audio"
        preload="none"
        controlsList="nodownload nofullscreen noremoteplayback"
        onContextMenu={(e) => e.preventDefault()}
        style={{ display: "none" }}
      >
        <source
          src="https://res.cloudinary.com/dotzhg9un/video/upload/v1777595147/audio_para_dormir_gteprq.mp3"
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
}

// ----- FAQ accordion -----
const FAQS = [
  ["¿Y si no creo que funcione?", "No necesitas creer. Es neurociencia aplicada. Tu único trabajo es relajarte y escuchar."],
  ["¿Y si me duermo durante los audios?", "Perfecto. Dormirte es señal de que entraste en estado Theta. Tu subconsciente sigue recibiendo la programación."],
  ["¿Es peligroso?", "No existe quedar atrapado. Es un estado natural voluntario. Puedes salir en cualquier momento."],
  ["¿Necesito experiencia previa?", "Absolutamente no. Si puedes escuchar música puedes usar el Pulso 369."],
  ["¿Cuánto hasta ver resultados?", "La mayoría reporta cambios en 3-7 días. Resultados profundos entre la segunda y cuarta semana."],
  ["¿Puedo usarlo si tomo medicamentos?", "Sí. Es complementario a cualquier tratamiento."],
  ["¿Por qué es tan barato?", "Es 100% digital. Sin costos de producción física. Queremos que sea accesible para quien más lo necesita."],
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {FAQS.map(([q, a], i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: "rgba(212,175,55,0.2)", background: "#06060F" }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              style={{ minHeight: 56 }}
            >
              <span className="font-semibold text-[15px]" style={{ color: "#EEE8FF" }}>
                {q}
              </span>
              <span className="ml-3 text-xl" style={{ color: "#D4AF37" }}>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              className="faq-collapse"
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                opacity: isOpen ? 1 : 0,
                transition: "grid-template-rows .3s ease-out, opacity .3s ease-out",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "#9090B8" }}>
                  {a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ----- Sticky Bottom Bar -----
function StickyBottomBar({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "rgba(6,6,15,0.97)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(212,175,55,0.4)",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform .4s ease-out",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider" style={{ color: "#9090B8" }}>
            Precio hoy
          </div>
          <div className="font-cinzel font-bold text-[22px]" style={{ color: "#D4AF37" }}>
            $11.11
          </div>
        </div>
        <button
          onClick={() => openPayment(PAY_MAIN)}
          className="px-5 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg"
          style={{
            background: "linear-gradient(135deg,#F0CE6A,#D4AF37)",
            color: "#06060F",
            minHeight: 44,
          }}
        >
          Acceso Inmediato →
        </button>
      </div>
    </div>
  );
}

// ----- Live Joins Toast (siempre visible, rotación cada ~6s) -----
const JOINS = [
  { n: "María G.", c: "CDMX, México", t: "hace 2 min" },
  { n: "Carlos R.", c: "Bogotá, Colombia", t: "hace 4 min" },
  { n: "Andrea P.", c: "Buenos Aires, Argentina", t: "hace 5 min" },
  { n: "Luis M.", c: "Madrid, España", t: "hace 7 min" },
  { n: "Sofía V.", c: "Lima, Perú", t: "hace 9 min" },
  { n: "Diego H.", c: "Santiago, Chile", t: "hace 11 min" },
  { n: "Valentina T.", c: "Quito, Ecuador", t: "hace 13 min" },
  { n: "Javier L.", c: "Monterrey, México", t: "hace 15 min" },
  { n: "Camila F.", c: "Medellín, Colombia", t: "hace 18 min" },
  { n: "Ricardo S.", c: "Guadalajara, México", t: "hace 21 min" },
  { n: "Paula N.", c: "Caracas, Venezuela", t: "hace 24 min" },
  { n: "Tomás A.", c: "Montevideo, Uruguay", t: "hace 27 min" },
];
function LiveJoinsToast() {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  useEffect(() => {
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const showFor = 6000; // visible 6s
    const hiddenFor = 9000; // oculto 9s -> ciclo total 15s
    const tick = () => {
      if (!alive) return;
      setShow(true);
      timers.push(setTimeout(() => {
        if (!alive) return;
        setShow(false);
        timers.push(setTimeout(() => {
          if (!alive) return;
          setI((p) => (p + 1) % JOINS.length);
          tick();
        }, hiddenFor));
      }, showFor));
    };
    timers.push(setTimeout(tick, 2500));
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);
  const j = JOINS[i];
  return (
    <div
      className="fixed z-[60] left-3 sm:left-5"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 88px)",
        maxWidth: "320px",
        transform: show ? "translateY(0)" : "translateY(20px)",
        opacity: show ? 1 : 0,
        transition: "transform .35s ease-out, opacity .35s ease-out",
        pointerEvents: "none",
      }}
      aria-live="polite"
    >
      <div
        style={{
          background: "rgba(15,15,28,0.96)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: "14px",
          padding: "10px 14px",
          boxShadow: "0 12px 32px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: 36, height: 36, flex: "0 0 36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#9B5DE5,#6B21C8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 14,
          }}
          aria-hidden
        >
          {j.n.charAt(0)}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12.5, color: "#EEE8FF", lineHeight: 1.2 }}>
            <strong style={{ color: "#D4AF37" }}>{j.n}</strong> acaba de entrar a PULSO 369
          </div>
          <div style={{ fontSize: 11, color: "#9090B8", marginTop: 2 }}>
            {j.c} · <span style={{ color: "#0ECECE" }}>● en vivo</span> · {j.t}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- Exit Intent Popup -----
function ExitPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", animation: "fadeIn .25s ease-out both" }}
      onClick={onClose}
    >
      <div
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="w-full max-w-[380px] rounded-2xl p-8 text-center"
        style={{
          background: "#0D0D20",
          border: "1px solid #D4AF37",
          boxShadow: "0 0 60px rgba(212,175,55,0.25)",
          animation: "scaleIn .3s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <div
          className="font-cinzel font-bold text-[22px] mb-2"
          style={{ color: "#D4AF37", animation: "softPulse 2s ease-in-out infinite" }}
        >
          ✦ 3 · 6 · 9 ✦
        </div>
        <h3 className="font-cinzel text-[20px] mb-3" style={{ color: "#EEE8FF" }}>
          Espera un momento.
        </h3>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#9090B8" }}>
          Está bien. Entendemos que $11.11 puede ser mucho ahora mismo.
          <br /><br />
          Por eso tenemos una última opción para ti.
          <br /><br />
          Todo este ecosistema por tan solo <span style={{ color: "#D4AF37", fontWeight: 700 }}>$9.99</span> — precio mínimo, sin recortar nada del programa.
          <br /><br />
          Pero seamos honestos: Esta noche vas a acostarte y mañana todo volverá a empezar y vas a recordar esta pantalla.
        </p>
        <button
          onClick={() => {
            openPayment(PAY_DOWN);
            onClose();
          }}
          className="w-full py-3 rounded-full font-bold text-base mb-3"
          style={{
            background: "linear-gradient(135deg,#F0CE6A,#D4AF37)",
            color: "#06060F",
            minHeight: 48,
          }}
        >
          Acceder por $9.99 →
        </button>
        <button onClick={onClose} className="text-xs underline" style={{ color: "#9090B8" }}>
          No, prefiero seguir igual por ahora
        </button>
      </div>
    </div>
  );
}

// ============== MAIN COMPONENT ==============
function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [showStickyBottom, setShowStickyBottom] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);

  // Sticky bottom after hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyBottom(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Downsell: only after the main checkout popup is closed
  useEffect(() => {
    const onAbandon = () => {
      setExitOpen(true);
    };
    window.addEventListener("pulso369:checkout-abandoned", onAbandon);
    return () => {
      window.removeEventListener("pulso369:checkout-abandoned", onAbandon);
    };
  }, []);

  return (
    <div
      style={{
        background: "#06060F",
        color: "#EEE8FF",
        fontFamily: "Nunito, system-ui, sans-serif",
        minHeight: "100vh",
      }}
    >
      <style>{`
        .font-cinzel{font-family:'Cinzel',serif}
        .font-cormorant{font-family:'Cormorant Garamond',serif}
        .font-dm{font-family:'DM Sans',sans-serif}
        .gold-grad{background:linear-gradient(135deg,#F0CE6A 0%,#D4AF37 50%,#A88B1E 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
        .btn-primary{background:linear-gradient(135deg,#F0CE6A,#D4AF37);color:#06060F;border-radius:9999px;padding:14px 28px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;transition:transform .2s,box-shadow .2s;box-shadow:0 8px 30px rgba(212,175,55,0.25)}
        .btn-primary:hover{transform:scale(1.02);box-shadow:0 12px 40px rgba(212,175,55,0.45)}
        .btn-outline{border:1px solid rgba(212,175,55,0.6);color:#F0CE6A;border-radius:9999px;padding:14px 28px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;background:transparent;transition:all .2s}
        .btn-outline:hover{background:rgba(212,175,55,0.1)}
        .badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:9999px;border:1px solid rgba(212,175,55,0.4);font-size:12px;font-weight:600;color:#F0CE6A;background:rgba(212,175,55,0.05);letter-spacing:.04em}
        .card{background:#12122A;border:1px solid rgba(212,175,55,0.15);border-radius:16px;padding:22px}
        .pulse-btn{animation:pulseGold 2.4s ease-in-out infinite}
        @keyframes pulseGold{0%,100%{box-shadow:0 8px 30px rgba(212,175,55,0.25)}50%{box-shadow:0 8px 50px rgba(212,175,55,0.55)}}
        .red-pulse{animation:redPulse 1.6s ease-in-out infinite}
        @keyframes redPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.5)}50%{box-shadow:0 0 0 10px rgba(239,68,68,0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{from{opacity:0;transform:translateX(-50%) translateY(8px) scale(.96);filter:blur(4px)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1);filter:blur(0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
        @keyframes softPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes numFlip{from{opacity:0;transform:translateY(.5em);filter:blur(3px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
        section{padding:64px 20px;position:relative;content-visibility:auto;contain-intrinsic-size:1px 900px}
        section:first-of-type,section#hero{content-visibility:visible}
        @media(min-width:768px){section{padding:96px 40px}}
        h2.h{font-family:'Cinzel',serif;font-weight:700;font-size:clamp(1.7rem,4.5vw,2.6rem);line-height:1.15;text-align:center;margin-bottom:14px;color:#EEE8FF}
        .sub{text-align:center;color:#9090B8;max-width:680px;margin:0 auto 40px;font-size:clamp(.95rem,2vw,1.05rem);line-height:1.6}
        .container-x{max-width:1100px;margin:0 auto}
        audio::-webkit-media-controls-panel{background:#12122A}
      `}</style>

      {/* SECTION 1: STICKY TOP BAR */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(6,6,15,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <div className="container-x flex items-center justify-between py-3 px-4">
          <div className="font-cinzel font-bold text-sm sm:text-base" style={{ color: "#D4AF37" }}>
            ✦ PULSO 369™
          </div>
          <a
            href="#audio-preview"
            className="px-4 py-2 rounded-full font-bold text-xs sm:text-sm"
            style={{ background: "linear-gradient(135deg,#F0CE6A,#D4AF37)", color: "#06060F", minHeight: 40 }}
          >
            🎧 Quiero Escuchar
          </a>
        </div>
      </header>

      {/* SECTION 2: HERO */}
      <section ref={heroRef} id="hero" style={{ minHeight: "100dvh", display: "flex", alignItems: "center", overflow: "hidden", padding: "80px 20px" }}>
        {/* Layered backgrounds */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(107,33,200,0.35) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(14,206,206,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden style={{ opacity: 0.18 }}>
          <img
            src={meditationSilhouette}
            alt=""
            decoding="async"
            loading="lazy"
            width={600}
            height={600}
            style={{ maxWidth: "min(80vw, 600px)", filter: "blur(1px)" }}
          />
        </div>
        <ParticlesCanvas />

        <div className="container-x relative z-10 text-center">
          <div style={{ animation: "fadeUp .6s ease-out both", animationDelay: ".2s" }}>
            <span className="badge">✦ Sistema de Activación 3 6 9 hrz™ — Audios Profesionales</span>
          </div>
          <h1
            className="font-cinzel font-bold mt-6 leading-[1.05]"
            style={{ fontSize: "clamp(2.1rem,7vw,4.2rem)" }}
          >
            Libérate de la <span className="gold-grad">tensión, la angustia</span> y los <span style={{ color: "#9B5DE5" }}>Bloqueos Mentales</span> en Solo 7 Minutos al Día
          </h1>
          <p
            className="mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
            style={{ color: "#9090B8", animation: "fadeUp .6s ease-out both", animationDelay: ".4s" }}
          >
            Descubre el sistema de <strong style={{ color: "#EEE8FF" }}>+100 audios de autohipnosis profesional</strong> que ha ayudado a miles de personas a reprogramar su mente mientras descansan — <span style={{ color: "#D4AF37" }}>sin esfuerzo, sin meditaciones complicadas, sin años de terapia.</span>
          </p>
          <div
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center"
            style={{ animation: "fadeUp .6s ease-out both", animationDelay: ".6s" }}
          >
            <a
              href="#seccion-2"
              className="btn-primary pulse-btn w-full sm:w-auto"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("seccion-2")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              🎧 TRANSFORMAR MI MENTE
            </a>
            <a
              href="#seccion-2"
              className="btn-outline w-full sm:w-auto"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("seccion-2")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Ver Oferta Especial
            </a>
          </div>
          <div
            className="mt-6 text-sm flex items-center justify-center gap-2"
            style={{ color: "#9090B8", animation: "fadeUp .6s ease-out both", animationDelay: ".8s" }}
          >
            <span style={{ color: "#22C55E" }}>✓</span> Acceso Inmediato · Sin Suscripción · Garantía 30 Días
          </div>
          <div
            className="mt-8 flex flex-wrap justify-center items-center text-xs sm:text-sm gap-4"
            style={{ color: "#9090B8", animation: "fadeUp .6s ease-out both", animationDelay: "1s" }}
          >
            <span><LiveCounter className="font-bold" style={{ color: "#D4AF37" }} /> <span>personas transformadas</span></span>
            <span style={{ color: "rgba(212,175,55,0.3)" }}>|</span>
            <span><strong style={{ color: "#D4AF37" }}>100+</strong> audios profesionales</span>
            <span style={{ color: "rgba(212,175,55,0.3)" }}>|</span>
            <span><strong style={{ color: "#D4AF37" }}>7 minutos</strong> cualquier momento</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: IDENTIFICACIÓN */}
      <section id="seccion-2" style={{ background: "#0D0D20" }}>
        <div className="container-x">
          <Reveal className="text-center"><span className="badge">¿Te identificas con esto?</span></Reveal>
          <Reveal delay={0.1}><h2 className="h mt-4">Sé Exactamente Cómo Te Sientes...</h2></Reveal>
          <div className="max-w-2xl mx-auto mt-8 space-y-5 text-[15px] leading-relaxed" style={{ color: "#9090B8" }}>
            {[
              <>Te despiertas cansado. Aunque hayas dormido 8 horas, <strong style={{ color: "#EEE8FF" }}>tu mente ya está acelerada</strong>. Pensamientos que no puedes controlar. Preocupaciones que no te dejan en paz.</>,
              <>Durante el día, <strong style={{ color: "#EEE8FF" }}>la ansiedad te acompaña como una sombra</strong>. Esa sensación en el pecho. Esa voz interior que te critica. Esa dificultad para concentrarte en lo que realmente importa.</>,
              <>Has intentado de todo: <strong style={{ color: "#EEE8FF" }}>meditaciones, libros, terapias</strong>, pero nada parece funcionar de verdad. El cambio dura unos días… y luego vuelves al mismo patrón.</>,
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.1}><p>{p}</p></Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div
              className="max-w-2xl mx-auto mt-10 p-6 rounded-2xl text-center italic font-cormorant text-[clamp(1.1rem,2.5vw,1.4rem)]"
              style={{ border: "1px solid #6B21C8", background: "rgba(107,33,200,0.08)", color: "#EEE8FF" }}
            >
              "¿Por qué no puedo simplemente sentirme bien? ¿Por qué mi mente no me deja en paz?"
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-center mt-10 mb-6" style={{ color: "#9090B8" }}>
              La razón es simple, pero nadie te la ha explicado correctamente:
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <Reveal>
              <div className="card h-full" style={{ borderColor: "#6B21C8" }}>
                <div className="text-3xl mb-2">🧠</div>
                <h3 className="font-cinzel text-lg mb-2" style={{ color: "#9B5DE5" }}>Tu Mente Consciente</h3>
                <p className="text-sm" style={{ color: "#9090B8" }}>Solo controla el <strong style={{ color: "#EEE8FF" }}>5%</strong> de tus decisiones. Por eso la fuerza de voluntad nunca funciona a largo plazo.</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card h-full" style={{ borderColor: "#D4AF37" }}>
                <div className="text-3xl mb-2">💛</div>
                <h3 className="font-cinzel text-lg mb-2" style={{ color: "#D4AF37" }}>Tu Subconsciente</h3>
                <p className="text-sm" style={{ color: "#9090B8" }}>Controla el <strong style={{ color: "#EEE8FF" }}>95%</strong> de tu vida. Aquí están grabados todos tus miedos, traumas y patrones automáticos.</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="text-center mt-10 font-bold text-lg" style={{ color: "#EEE8FF" }}>
              Para cambiar de verdad, necesitas reprogramar tu subconsciente.
            </p>
            <p className="text-center mt-2 font-cinzel" style={{ color: "#D4AF37" }}>
              Y eso es exactamente lo que hace este sistema.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 4: MECANISMO */}
      <section>
        <div className="container-x">
          <Reveal className="text-center"><span className="badge">✦ El Mecanismo Único</span></Reveal>
          <Reveal delay={0.1}>
            <h2 className="h mt-4">
              Tecnología de Reprogramación Subconsciente en <span className="gold-grad">frecuencia 3 6 9™</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}><p className="sub">El secreto que los terapeutas más caros del mundo usan con sus clientes VIP — ahora disponible para ti.</p></Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="space-y-5">
                <p style={{ color: "#9090B8" }} className="text-[15px] leading-relaxed">
                  Tu cerebro funciona por la mayor parte del día en frecuencia <strong style={{ color: "#EEE8FF" }}>Beta (12-30 Hz)</strong> — el modo de alerta y resistencia. En este estado tu mente crítica bloquea cualquier intento de cambio profundo.
                </p>
                <div className="card" style={{ borderColor: "#0ECECE", background: "rgba(14,206,206,0.05)" }}>
                  <h4 className="font-cinzel" style={{ color: "#0ECECE" }}>frecuencia 3 6 9 Hz · La Puerta del Subconsciente</h4>
                  <p className="text-sm mt-2" style={{ color: "#9090B8" }}>
                    El Pulso 369 combina frecuencias binaurales calibradas con técnicas hipnóticas clínicas para inducir en ese estado automáticamente sin meditación, sin esfuerzo.
                  </p>
                </div>
                <p style={{ color: "#9090B8" }} className="text-[15px] leading-relaxed">
                  El Pulso 369 combina <strong style={{ color: "#EEE8FF" }}>frecuencias binaurales calibradas</strong> con técnicas hipnóticas clínicas para inducir Theta automáticamente — sin meditación, sin esfuerzo.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="card h-full" style={{ background: "#06060F", borderColor: "rgba(212,175,55,0.3)" }}>
                <h3 className="font-cinzel text-xl mb-5">
                  Por Qué Esto es <span className="gold-grad">Diferente</span>
                </h3>
                <ul className="space-y-4">
                  {[
                    ["🎯", "Acceso Directo al Subconsciente", "Bypasea la mente crítica"],
                    ["〰", "Inducción Automática", "Sin experiencia previa"],
                    ["🛡", "100% Seguro y Natural", "El mismo estado de cada noche"],
                    ["⚡", "Resultados Permanentes", "Los cambios se graban a nivel subconsciente"],
                  ].map(([ic, t, d]) => (
                    <li key={t} className="flex gap-3">
                      <div className="text-xl" style={{ color: "#D4AF37" }}>{ic}</div>
                      <div>
                        <div className="font-semibold text-[15px]">{t}</div>
                        <div className="text-sm" style={{ color: "#9090B8" }}>{d}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="text-center mt-10 italic font-cormorant text-xl" style={{ color: "#F0CE6A" }}>
              "Solo necesitas escuchar y relajarte. Tu subconsciente hace el resto."
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 5: TRANSFORMACIÓN */}
      <section style={{ background: "#0D0D20" }}>
        <div className="container-x">
          <Reveal className="text-center"><span className="badge">✨ Transformación Real</span></Reveal>
          <Reveal delay={0.1}><h2 className="h mt-4">Imagina Cómo Será Tu Vida Cuando <span className="gold-grad">logres...</span></h2></Reveal>
          <Reveal delay={0.15}><p className="sub">Estas son las transformaciones reales que experimentarás cuando tu subconsciente esté alineado.</p></Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["☀️", "Despiertas con energía renovada", "Mente clara lista para el día."],
              ["🤫", "Silencias la voz interior crítica", "Confianza auténtica."],
              ["😴", "Duermes profundamente toda la noche", "Sin pastillas ni pensamientos intrusivos."],
              ["🌊", "Te liberas del estrés acumulado", "La tensión se derrite con cada sesión."],
              ["🗝", "Rompes patrones de autosabotaje", "Finalmente podrás avanzar."],
              ["💗", "Sanas heridas emocionales profundas", "De la infancia y relaciones pasadas."],
              ["👑", "Desarrollas autoestima inquebrantable", "Sin depender de aprobación externa."],
              ["🦋", "Superas miedos irracionales", "Que te paralizan e impiden vivir."],
              ["🕊", "Experimentas paz interior genuina", "Ese estado de calma que parecía imposible."],
            ].map(([ic, t, d], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <div className="card h-full">
                  <div className="text-2xl mb-3" style={{ color: "#D4AF37" }}>{ic}</div>
                  <h3 className="font-bold mb-1 text-[15px]">{t}</h3>
                  <p className="text-sm" style={{ color: "#9090B8" }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="text-center mt-10 font-cormorant text-xl italic" style={{ color: "#F0CE6A" }}>
              Y esto es solo el comienzo… cada audio está diseñado para un objetivo específico.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 6: PARA QUIÉN */}
      <section>
        <div className="container-x">
          <Reveal className="text-center"><span className="badge">💜 ¿Con qué luchas?</span></Reveal>
          <Reveal delay={0.1}><h2 className="h mt-4">Este Sistema Fue Creado Para Ti Si <span style={{ color: "#9B5DE5" }}>Sufres De...</span></h2></Reveal>
          <Reveal delay={0.15}><p className="sub">No importa cuánto tiempo hayas luchado. Hay audios específicos para cada desafío.</p></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "😰 Ansiedad y ataques de pánico",
              "😤 Estrés crónico y agotamiento",
              "😴 Insomnio y problemas de sueño",
              "💔 Baja autoestima y falta de confianza",
              "🔪 Autocrítica destructiva",
              "💞 Dependencia emocional en relaciones",
              "🩹 Heridas de la infancia no sanadas",
              "🔄 Comportamientos compulsivos",
              "🔒 Bloqueos de intimidad",
              "🎯 Falta de concentración",
              "⚡ Procrastinación y falta de motivación",
              "🌪 Problemas emocionales acumulados",
            ].map((c, i) => (
              <Reveal key={c} delay={i * 0.04}>
                <div
                  className="rounded-xl px-4 py-3 text-sm h-full flex items-center"
                  style={{ background: "#12122A", border: "1px solid rgba(155,93,229,0.25)" }}
                >
                  {c}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="card mt-10 max-w-2xl mx-auto text-center" style={{ borderColor: "#D4AF37" }}>
              <p className="font-bold text-base">
                Cada Problema Tiene Su Solución Específica
              </p>
              <p className="mt-2 text-sm" style={{ color: "#9090B8" }}>
                El Pulso 369 incluye audios para abordar cada uno desde la raíz.
              </p>
              <a href="#oferta" className="inline-block mt-4 font-bold underline" style={{ color: "#D4AF37" }}>
                Descubre qué incluye →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 11: AUDIO PREVIEW */}
      <section id="audio-preview" style={{ background: "#0D0D20" }}>
        <div className="container-x">
          <Reveal className="text-center"><span className="badge">🎧 Pruébalo Antes de Decidir</span></Reveal>
          <Reveal delay={0.1}><h2 className="h mt-4">Escucha Una Muestra Real</h2></Reveal>
          <Reveal delay={0.15}>
            <div
              className="max-w-xl mx-auto"
              style={{
                border: "1px solid rgba(212,175,55,0.4)",
                padding: 28,
                borderRadius: 20,
                boxShadow: "0 0 40px rgba(212,175,55,0.12), 0 0 80px rgba(212,175,55,0.06)",
                background: "rgba(212,175,55,0.04)",
              }}
            >
              <div className="font-cormorant italic" style={{ color: "#D4AF37", fontSize: 22 }}>
                Escucha esto antes de decidir
              </div>
              <div className="font-dm" style={{ color: "#EEE8FF", fontWeight: 300, fontSize: 13, marginBottom: 20 }}>
                Los primeros minutos del Pulso — el audio que cambia todo
              </div>
              <AudioPreview />
              <div className="font-dm mt-4" style={{ fontWeight: 300, fontSize: 12, color: "#9090B8" }}>
                Esta es solo una muestra de los +150 audios del sistema completo.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 7: QUÉ INCLUYE */}
      <section style={{ background: "#0D0D20" }}>
        <div className="container-x">
          <Reveal className="text-center"><span className="badge">📦 Todo Incluido</span></Reveal>
          <Reveal delay={0.1}><h2 className="h mt-4">Todo Lo Que Recibes en el <span className="gold-grad">Pulso 369™</span></h2></Reveal>
          <Reveal delay={0.15}><p className="sub">Un sistema completo de transformación mental valorado en más de $1,000… a una fracción del precio.</p></Reveal>
          <Reveal delay={0.2}>
            <img
              src={programaPulso369}
              alt="Programa Digital Completo Pulso 369 + Acceso a la App"
              loading="lazy"
              decoding="async"
              width={1568}
              height={628}
              className="mx-auto mb-10 rounded-2xl w-full h-auto"
              style={{ maxWidth: 960 }}
            />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              ["🎧", "+100 Audios de Autohipnosis", "Sesiones para cada área de vida.", "$397"],
              ["🎵", "Música Terapéutica Exclusiva", "Frecuencias binaurales.", "$97"],
              ["🧠", "Frecuencias Mentales de Creación de realidad 369 Hrz", "Ondas calibradas para receptividad máxima.", "$147"],
              ["🎤", "Guía por Voz Profesional", "Narración hipnótica clínica.", "$297"],
              ["📚", "7 Libros PDF de Apoyo", "PNL, hipnosis, sanación, reprogramación.", "$127"],
              ["📱", "Accede a los 150 audios desde tu teléfono en cualquier momento.", "App Exclusiva Pulso 369", "Acceso Permanente"],
            ].map(([ic, t, d, v], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="card h-full flex gap-4">
                  <div className="text-3xl">{ic}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[15px] mb-1">{t}</h3>
                    <p className="text-sm" style={{ color: "#9090B8" }}>{d}</p>
                    <div className="mt-2 text-xs font-bold" style={{ color: "#D4AF37" }}>Valor {v}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <a href="#oferta" className="block max-w-2xl mx-auto mt-10 rounded-2xl text-center p-5"
              style={{ background: "linear-gradient(135deg,rgba(212,175,55,0.15),rgba(107,33,200,0.15))", border: "1px solid rgba(212,175,55,0.4)" }}>
              <span className="text-base sm:text-lg">
                Valor Total: <s style={{ color: "#9090B8" }}>$1,065</s> · <strong style={{ color: "#D4AF37" }}>Hoy por mucho menos ↓</strong>
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* SECTION 10: BONOS */}
      <section>
        <div className="container-x">
          <Reveal className="text-center"><span className="badge">🎁 Incluido Hoy Sin Costo Extra</span></Reveal>
          <Reveal delay={0.1}><h2 className="h mt-4">Pero Espera, Hay Más... ¡<span className="gold-grad">GRATIS</span>!</h2></Reveal>
          <Reveal delay={0.15}><p className="sub">Cuando actúes hoy recibirás estos bonos valorados en más de $141… completamente gratis.</p></Reveal>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              ["⚡", "ACTIVADOR INMEDIATO — Protocolo de Inicio en 24 Horas", "Plan paso a paso desde el día 1.", "$47"],
              ["📖", "REGISTRO DE TRANSFORMACIÓN — Diario de Reprogramación Mental", "Plantilla PDF para registrar tu progreso.", "$27"],
              ["🎧", "ANTI-CRISIS — Sesión de Emergencia para Ansiedad Aguda", "Audio 10 min para crisis de ansiedad aguda.", "$67"],
              ["⭐", "BIBLIOTECA VIVA — Nuevos Audios Automáticos Sin Costo Extra", "Nuevos audios automáticamente, sin costo.", "Sin precio"],
            ].map(([ic, t, d, v], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="card h-full relative">
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: "#22C55E", color: "#06060F" }}>GRATIS</span>
                  <div className="text-3xl">{ic}</div>
                  <h3 className="font-bold mt-2">{t}</h3>
                  <p className="text-sm mt-1" style={{ color: "#9090B8" }}>{d}</p>
                  <div className="text-sm mt-3">
                    <s style={{ color: "#9090B8" }}>{v}</s> <strong style={{ color: "#22C55E" }}>$0</strong>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="card max-w-md mx-auto mt-10" style={{ background: "#0D0D20", borderColor: "rgba(212,175,55,0.4)" }}>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Pulso 369", "$1,065"],
                    ["Bono 1", "$47"],
                    ["Bono 2", "$27"],
                    ["Bono 3", "$67"],
                    ["Bono 4", "Sin precio"],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td className="py-2" style={{ color: "#9090B8" }}>{k}</td>
                      <td className="py-2 text-right">{v}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 font-bold">VALOR TOTAL</td>
                    <td className="py-3 text-right font-bold" style={{ color: "#D4AF37" }}>$1,206+</td>
                  </tr>
                  <tr style={{ borderTop: "1px solid rgba(212,175,55,0.4)" }}>
                    <td className="py-3 font-bold">Tu Inversión Hoy</td>
                    <td className="py-3 text-right font-cinzel font-bold text-xl" style={{ color: "#D4AF37" }}>$11.11</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="max-w-md mx-auto mt-5">
              <button onClick={() => openPayment(PAY_MAIN)} className="btn-primary pulse-btn w-full">
                QUIERO TODO ESTO POR $11.11 →
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 8: TESTIMONIOS */}
      <section>
        <div className="container-x">
          <Reveal className="text-center"><span className="badge">⭐ Historias Reales</span></Reveal>
          <Reveal delay={0.1}><h2 className="h mt-4">Miles de Personas Ya <span className="gold-grad">Transformaron Sus Vidas</span></h2></Reveal>
          <Reveal delay={0.15}><p className="sub">Escucha a personas reales que estaban exactamente donde tú estás ahora.</p></Reveal>

          <Reveal delay={0.2}>
            <div className="mx-auto mb-4" style={{ maxWidth: 320 }}>
              <TestimonialVideo />
              <p className="text-center text-xs mt-3" style={{ color: "#9090B8" }}>
                ▶ Testimonio real de una usuaria del Pulso 369
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              ["Llevaba 5 años con ansiedad crónica. Probé de todo. Estos audios fueron lo único que funcionó. Ahora duermo sin pastillas y me siento en paz.", "Superó ansiedad crónica", "María G.", "México"],
              ["Escéptico total al principio. Después de 2 semanas escuchando antes de dormir mi mente dejó de torturarme.", "Eliminó pensamientos negativos", "Carlos R.", "España"],
              ["Mi terapeuta costaba $150 por sesión. Estos audios me ayudaron más que 2 años de terapia.", "Sanó dependencia emocional", "Ana L.", "Argentina"],
              ["Un mes con los audios de abundancia y conseguí el mejor trabajo de mi vida.", "Eliminó creencias limitantes", "Roberto M.", "Colombia"],
              ["Dejé de buscar validación externa y finalmente me acepto como soy.", "Transformó su autoestima", "Laura P.", "Chile"],
              ["Insomnio de 10 años. Con estos audios en una semana dormía 7 horas seguidas.", "Eliminó insomnio crónico", "Diego S.", "Perú"],
            ].map(([q, r, n, c], i) => (
              <Reveal key={n} delay={i * 0.06}>
                <div className="card h-full flex flex-col">
                  <div className="text-3xl font-cormorant" style={{ color: "#D4AF37", lineHeight: 0.5 }}>❝</div>
                  <p className="italic font-cormorant text-base mt-3" style={{ color: "#EEE8FF" }}>{q}</p>
                  <span className="inline-block self-start mt-4 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.4)" }}>
                    ✓ {r}
                  </span>
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="text-sm font-bold">{n}</div>
                    <div className="text-xs" style={{ color: "#9090B8" }}>{c}</div>
                    <div className="text-xs mt-1" style={{ color: "#D4AF37" }}>★★★★★</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div
              className="mt-10 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
              style={{ border: "1px solid rgba(212,175,55,0.4)", background: "rgba(212,175,55,0.04)" }}
            >
              <div>
                <div className="font-cinzel font-bold text-2xl" style={{ color: "#D4AF37" }}>
                  <LiveCounter />
                </div>
                <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "#9090B8" }}>personas transformadas</div>
              </div>
              {[
                ["4.9/5", "calificación promedio"],
                ["92%", "reportan resultados"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-cinzel font-bold text-2xl" style={{ color: "#D4AF37" }}>{n}</div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "#9090B8" }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>


      {/* SECTION 9: COUNTDOWN + PRECIO */}
      <section id="oferta" style={{ background: "#0D0D20" }}>
        <div className="container-x">
          <Reveal className="text-center">
            <span className="badge red-pulse" style={{ borderColor: "#EF4444", color: "#EF4444", background: "rgba(239,68,68,0.08)" }}>
              🔴 Oferta Especial por Tiempo Limitado
            </span>
          </Reveal>
          <Reveal delay={0.1}><Countdown /></Reveal>

          <Reveal delay={0.15}>
            <div
              className="max-w-md mx-auto rounded-2xl text-center"
              style={{
                border: "1px solid #D4AF37",
                padding: 28,
                background: "linear-gradient(180deg,rgba(212,175,55,0.05),rgba(107,33,200,0.05))",
                boxShadow: "0 0 60px rgba(212,175,55,0.15)",
              }}
            >
              <h3 className="font-cinzel text-2xl gold-grad">PULSO 369™</h3>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "#9090B8" }}>Sistema de Activación Theta™</p>

              <ul className="mt-6 space-y-2 text-left text-sm">
                {[
                  "App Móvil con Acceso de por Vida (futuras actualizaciones inluidas)",
                  "+150 Audios de Autohipnosis Profesional",
                  "App Móvil con Acceso de por Vida ",
                  "7 Libros PDF de PNL e Hipnosis",
                  "Acceso Digital Inmediato y Permanente",
                  "Actualizaciones Gratuitas de por Vida",
                ].map((x) => (
                  <li key={x} className="flex gap-2"><span style={{ color: "#D4AF37" }}>✓</span><span>{x}</span></li>
                ))}
              </ul>

              <div className="mt-6">
                <div className="text-sm" style={{ color: "#9090B8" }}>Valor real: <s>$1,065 USD</s></div>
                <div className="text-xs mt-3" style={{ color: "#9090B8" }}>Tu inversión hoy:</div>
                <div className="font-cinzel font-bold gold-grad" style={{ fontSize: "clamp(3.5rem,14vw,5.5rem)", lineHeight: 1 }}>
                  $11.11
                </div>
                <div className="font-bold mt-1" style={{ color: "#D4AF37" }}>¡Ahorras más de $1,000!</div>
                <p className="text-xs mt-2" style={{ color: "#9090B8" }}>✦ Pago único. Acceso de por vida. Sin suscripciones.</p>
              </div>

              <button onClick={() => openPayment(PAY_MAIN)} className="btn-primary pulse-btn w-full mt-6">
                SÍ, QUIERO TRANSFORMAR MI MENTE →
              </button>
              <p className="text-xs mt-3" style={{ color: "#9090B8" }}>🔒 Pago 100% seguro con encriptación SSL</p>
              <p className="text-xs mt-3" style={{ color: "rgba(212,175,55,0.85)" }}>
                <span style={{ color: "#D4AF37" }}>🛡️</span> Garantía de devolución 30 días — Si no ves resultados, te devolvemos cada centavo. Sin preguntas.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="text-center mt-12 max-w-xl mx-auto">
              <h4 className="font-cinzel text-xl">Piénsalo de Esta Manera...</h4>
              <ul className="mt-4 space-y-2 text-sm" style={{ color: "#9090B8" }}>
                <li>Una sesión con hipnoterapeuta cuesta entre $100 y $300.</li>
                <li>Un año de terapia puede costarte más de $5,000.</li>
                <li>Por menos de una cena para dos obtienes +100 sesiones para toda la vida.</li>
              </ul>
              <p className="font-bold mt-4">Eso es menos de $0.11 por audio.</p>
              <p className="text-sm" style={{ color: "#9090B8" }}>Menos de un café por tu transformación completa.</p>
            </div>
          </Reveal>
        </div>
      </section>


      {/* SECTION 12: GARANTÍA */}
      <section>
        <div className="container-x">
          <Reveal>
            <div
              className="mx-auto text-center rounded-2xl p-8"
              style={{ border: "1px solid #22C55E", maxWidth: 500, background: "rgba(34,197,94,0.04)" }}
            >
              <div style={{ fontSize: 60 }}>🛡️</div>
              <h3 className="font-cinzel text-2xl mt-2" style={{ color: "#22C55E" }}>Garantía Total 30 Días</h3>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "#9090B8" }}>
                Si en los próximos 30 días no sientes una diferencia real en tu nivel de estrés y ansiedad, te devolvemos el 100% de tu dinero. Sin formularios, sin explicaciones, sin preguntas.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 13: FAQ */}
      <section style={{ background: "#0D0D20" }}>
        <div className="container-x">
          <Reveal className="text-center"><span className="badge">❓ Preguntas Frecuentes</span></Reveal>
          <Reveal delay={0.1}><h2 className="h mt-4">¿Tienes Dudas? <span style={{ color: "#9B5DE5" }}>Aquí Están Las Respuestas</span></h2></Reveal>
          <Reveal delay={0.15}><p className="sub">Entiendo tu escepticismo. Aquí respondo las más comunes.</p></Reveal>
          <FAQ />
          <Reveal delay={0.2}>
            <p className="text-center mt-8 italic font-cormorant text-lg" style={{ color: "#F0CE6A" }}>
              ¿Tienes otra pregunta? Recuerda: no tienes nada que perder.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 14: CIERRE */}
      <section style={{ background: "linear-gradient(180deg,#06060F 0%, rgba(107,33,200,0.15) 50%, #06060F 100%)" }}>
        <div className="container-x text-center">
          <Reveal><h2 className="h">El Momento de Decidir <span className="gold-grad">Ha Llegado</span></h2></Reveal>
          <Reveal delay={0.1}>
            <p className="sub">Puedes cerrar esta página y seguir como hasta ahora. O puedes tomar una decisión diferente. Hoy.</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="font-bold max-w-xl mx-auto">
              Una pequeña inversión de <span style={{ color: "#D4AF37" }}>$11.11</span> para un sistema que puede cambiar literalmente cada área de tu vida.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div
              className="max-w-md mx-auto mt-10 rounded-2xl p-7"
              style={{ border: "1px solid #D4AF37", background: "rgba(212,175,55,0.04)" }}
            >
              <div style={{ fontSize: 40 }}>💜</div>
              <h3 className="font-bold text-lg mt-2">Imagina la Persona Que Serás</h3>
              <p className="text-sm mt-3" style={{ color: "#9090B8" }}>
                En 30 días cuando mires hacia atrás te alegrarás de haber tomado esta decisión. Esa persona ya existe dentro de ti. Solo necesitas desbloquearla.
              </p>
              <button onClick={() => openPayment(PAY_MAIN)} className="btn-primary pulse-btn w-full mt-6 text-base">
                ✦ TRANSFORMAR MI MENTE AHORA →
              </button>
              <p className="text-xs mt-3" style={{ color: "#9090B8" }}>
                🔒 Pago 100% Seguro · ⚡ Acceso Inmediato · 🌟 Acceso de Por Vida
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-10">Llevas demasiado tiempo cargando esto solo.</p>
            <p className="font-cinzel mt-1" style={{ color: "#D4AF37" }}>HOY PUEDES CAMBIAR ESO.</p>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{ background: "#06060F", borderTop: "1px solid rgba(212,175,55,0.15)", padding: "40px 20px 100px" }}
      >
        <div className="container-x text-center text-xs leading-relaxed" style={{ color: "#9090B8" }}>
          <p>© 2025 Pulso 369™. Todos los derechos reservados.</p>
          <p className="mt-3 max-w-2xl mx-auto">
            Los resultados pueden variar. Este producto es material educativo y de bienestar. No pretende diagnosticar, tratar, curar ni prevenir ninguna enfermedad. Consulta con un profesional antes de comenzar. Los testimonios son experiencias individuales y no garantizan resultados similares.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a href="#" className="hover:underline">Términos y Condiciones</a>
            <span>·</span>
            <a href="#" className="hover:underline">Política de Privacidad</a>
            <span>·</span>
            <a href="#" className="hover:underline">Contacto</a>
          </div>
        </div>
      </footer>

      <StickyBottomBar visible={showStickyBottom} />
      <ExitPopup open={exitOpen} onClose={() => setExitOpen(false)} />
      <LiveJoinsToast />
    </div>
  );
}
