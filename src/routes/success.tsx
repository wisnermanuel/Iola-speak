import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/success')({
  component: IolaSuccess,
});

const BLUE = '#4C9FFF';
const GREEN = '#AEEA00';
const BG = 'linear-gradient(160deg,#09090F 0%,#0b1a2e 60%,#0d0f1a 100%)';

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7"/>
    </svg>
  );
}

function PWASteps({ platform }: { platform: 'ios' | 'android' }) {
  const APP_URL = 'iola-speak.vercel.app';
  const ios = [
    { n: 1, text: <><strong style={{color:'#fff'}}>Abre Safari</strong> y ve a <strong style={{color:BLUE}}>{APP_URL}</strong></> },
    { n: 2, text: <>Toca el botón <strong style={{color:'#fff'}}>Compartir ↑</strong> en la barra inferior</> },
    { n: 3, text: <>Desliza y toca <strong style={{color:'#fff'}}>"Añadir a pantalla de inicio"</strong></> },
    { n: 4, text: <>Toca <strong style={{color:'#fff'}}>"Añadir"</strong> — Iola aparece como app en tu pantalla</> },
  ];
  const android = [
    { n: 1, text: <><strong style={{color:'#fff'}}>Abre Chrome</strong> y ve a <strong style={{color:BLUE}}>{APP_URL}</strong></> },
    { n: 2, text: <>Toca el menú <strong style={{color:'#fff'}}>⋮</strong> en la esquina superior derecha</> },
    { n: 3, text: <>Toca <strong style={{color:'#fff'}}>"Agregar a pantalla de inicio"</strong></> },
    { n: 4, text: <>Toca <strong style={{color:'#fff'}}>"Agregar"</strong> — listo</> },
  ];
  const steps = platform === 'ios' ? ios : android;
  const label = platform === 'ios' ? '🍎 iPhone / iPad — Safari' : '🤖 Android — Chrome';
  const borderColor = platform === 'ios' ? 'rgba(76,159,255,0.25)' : 'rgba(174,234,0,0.2)';
  const bg = platform === 'ios' ? 'rgba(76,159,255,0.06)' : 'rgba(174,234,0,0.05)';

  return (
    <div style={{ border: `1px solid ${borderColor}`, background: bg, borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>{label}</p>
      {steps.map(s => (
        <div key={s.n} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: 'rgba(76,159,255,0.1)', border: `1px solid rgba(76,159,255,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: BLUE, marginTop: 1 }}>
            {s.n}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>{s.text}</p>
        </div>
      ))}
    </div>
  );
}

export default function IolaSuccess() {
  useEffect(() => {
    const key = 'iola.purchase_fired';
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id') || 'unknown';
    const value = parseFloat(params.get('value') ?? '') || 19.99;
    if (localStorage.getItem(key) !== sessionId) {
      try { (window as any).fbq?.('track', 'Purchase', { value, currency: 'USD', content_name: 'iola_subscription' }); } catch {}
      localStorage.setItem(key, sessionId);
    }
  }, []);

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px 60px', fontFamily: "'Inter',-apple-system,sans-serif", color: '#fff', overflowY: 'auto' }}>
      {/* glow */}
      <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(76,159,255,0.1) 0%,transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ maxWidth: 480, width: '100%', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(174,234,0,0.08)', border: `1px solid rgba(174,234,0,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 24px rgba(174,234,0,0.15)' }}>
            <CheckIcon />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10, background: `linear-gradient(135deg, #AEEA00, #4C9FFF)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ¡Pago confirmado!
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            Crea tu cuenta con el <strong style={{color:'rgba(255,255,255,0.8)'}}>mismo email</strong> que usaste en el pago y tu acceso se activa automáticamente.
          </p>
        </div>

        {/* Beneficios */}
        <div style={{ background: 'rgba(174,234,0,0.05)', border: `1px solid rgba(174,234,0,0.18)`, borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Lo que incluye tu acceso</p>
          {[
            'Plan de inglés 100% personalizado con IA',
            'Práctica diaria de vocabulario y gramática',
            'Actualizaciones incluidas sin costo extra',
          ].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ color: GREEN, fontSize: 14 }}>✓</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{t}</span>
            </div>
          ))}
        </div>

        {/* CTA principal */}
        <a href="/auth" style={{ display: 'block', width: '100%', padding: '16px 24px', background: `linear-gradient(135deg, #AEEA00, #7BC800)`, color: '#050505', fontWeight: 800, fontSize: 16, borderRadius: 14, textAlign: 'center', textDecoration: 'none', marginBottom: 28, boxShadow: '0 4px 24px rgba(174,234,0,0.3)' }}>
          Entrar a Iola Speak →
        </a>

        {/* Instrucciones PWA */}
        <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
          Instala Iola en tu celular
        </p>
        <PWASteps platform="ios" />
        <PWASteps platform="android" />

        {/* Soporte */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 24, lineHeight: 1.6 }}>
          ¿Problemas? Escríbenos a <strong style={{color:'rgba(255,255,255,0.4)'}}>wisnermartinezbtc@gmail.com</strong>
        </p>

      </div>
    </div>
  );
}
