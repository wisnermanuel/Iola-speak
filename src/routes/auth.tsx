import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAuth, signIn, signUp, sendPasswordReset, updatePassword, signOut, signInWithGoogle } from '@/lib/auth';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
});

const field =
  'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition placeholder:text-white/20 text-white';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PasswordInput({ placeholder, value, onChange, autoComplete }: {
  placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input className={field + ' pr-11'} type={show ? 'text' : 'password'}
        autoComplete={autoComplete} placeholder={placeholder} value={value} onChange={onChange} />
      <button type="button" onClick={() => setShow(s => !s)} tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition">
        <EyeIcon open={show} />
      </button>
    </div>
  );
}

const BG = "linear-gradient(160deg,#09090F 0%,#0b1a2e 60%,#0d0f1a 100%)";
const G = "#AEEA00";

function IolaLogo() {
  return (
    <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#4C9FFF 0%,#9b6cff 100%)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 32px rgba(76,159,255,0.4)' }}>
      <svg viewBox="0 0 100 100" style={{ width:'65%', height:'65%', fill:'none', stroke:'#fff', strokeWidth:7, strokeLinecap:'round' }}>
        {Array.from({length:12},(_,i)=>{const a=(i*30-90)*Math.PI/180;const x1=50+18*Math.cos(a);const y1=50+18*Math.sin(a);const x2=50+44*Math.cos(a);const y2=50+44*Math.sin(a);return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>;})}
      </svg>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position:'fixed', inset:0, background:BG, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      {/* glow */}
      <div style={{ position:'absolute', top:'15%', left:'50%', transform:'translateX(-50%)', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(76,159,255,0.12) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div className="w-full max-w-sm" style={{ position:'relative' }}>
        <div className="text-center mb-8 flex flex-col items-center">
          <IolaLogo />
          <p style={{ color:'rgba(174,234,0,0.7)', fontSize:11, marginTop:10, letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:600 }}>Iola Speak</p>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, marginTop:4 }}>Tu entrenador de inglés con IA</p>
        </div>
        <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:24, backdropFilter:'blur(20px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const { session, allowed, loading, checking } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'main' | 'forgot' | 'sent' | 'reset' | 'denied'>('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [forceLogin, setForceLogin] = useState(false);
  const isSignup = !forceLogin;

  useEffect(() => {
    if (!loading && !checking && session && allowed) navigate({ to: '/' });
    if (!loading && !checking && session && !allowed) setMode('denied');
  }, [session, allowed, loading, checking, navigate]);

  function reset() { setError(''); setNotice(''); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); reset();
    if (!email.trim() || !password) { setError('Completa todos los campos.'); return; }
    if (isSignup) {
      if (password.length < 6) { setError('Mínimo 6 caracteres.'); return; }
      if (password !== password2) { setError('Las contraseñas no coinciden.'); return; }
      setBusy(true);
      const { data, error: err } = await signUp(email, password);
      if (err) {
        const { error: loginErr } = await signIn(email, password);
        setBusy(false);
        if (!loginErr) return;
        setError(err?.message || 'Algo salió mal.'); return;
      }
      setBusy(false);
      if (!data.session) setNotice('Revisa tu email para confirmar tu cuenta.');
    } else {
      setBusy(true);
      const { error: err } = await signIn(email, password);
      setBusy(false);
      if (err) {
        const msg = err?.message || '';
        setError(msg.toLowerCase().includes('email not confirmed')
          ? 'Confirma tu email antes de iniciar sesión.'
          : 'Email o contraseña incorrectos.');
      }
    }
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault(); reset();
    if (!email.trim()) { setError('Ingresa tu email.'); return; }
    setBusy(true);
    await sendPasswordReset(email);
    setBusy(false);
    setMode('sent');
  }

  async function onReset(e: React.FormEvent) {
    e.preventDefault(); reset();
    if (password.length < 6) { setError('Mínimo 6 caracteres.'); return; }
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return; }
    setBusy(true);
    const { error: err } = await updatePassword(password);
    if (err) { setBusy(false); setError('Algo salió mal.'); return; }
    await signOut();
    setBusy(false);
    setNotice('Contraseña actualizada. Inicia sesión.');
    setMode('main'); setForceLogin(true); setPassword(''); setPassword2('');
  }

  if (mode === 'denied') return (
    <Shell>
      <div className="text-center">
        <p className="text-white font-medium mb-2">Sin acceso activo</p>
        <p className="text-white/40 text-sm leading-relaxed mb-6">Este email no tiene un plan activo en Iola Speak.</p>
        <button onClick={() => signOut()} className="text-white/30 hover:text-white text-sm transition">Cerrar sesión</button>
      </div>
    </Shell>
  );

  if (mode === 'sent') return (
    <Shell>
      <div className="text-center">
        <p className="text-white font-medium mb-2">Revisa tu email</p>
        <p className="text-white/40 text-sm mb-6">Te enviamos un enlace para restablecer tu contraseña.</p>
        <button onClick={() => { reset(); setMode('main'); }} className="text-white/50 hover:text-white text-sm transition">Volver</button>
      </div>
    </Shell>
  );

  if (mode === 'reset') return (
    <Shell>
      <p className="text-white font-medium mb-5">Nueva contraseña</p>
      <form onSubmit={onReset} className="space-y-3">
        <PasswordInput placeholder="Nueva contraseña" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        <PasswordInput placeholder="Repetir contraseña" value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button disabled={busy} className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold disabled:opacity-40 transition">Actualizar contraseña</button>
      </form>
    </Shell>
  );

  if (mode === 'forgot') return (
    <Shell>
      <p className="text-white font-medium mb-1">Restablecer contraseña</p>
      <p className="text-white/40 text-sm mb-5">Ingresa tu email y te enviamos el enlace.</p>
      <form onSubmit={onForgot} className="space-y-3">
        <input className={field} type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button disabled={busy} className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold disabled:opacity-40 transition">Enviar enlace</button>
      </form>
      <button onClick={() => { reset(); setMode('main'); }} className="block mx-auto mt-4 text-white/30 hover:text-white text-sm transition">Volver</button>
    </Shell>
  );

  return (
    <div style={{ position:'fixed', inset:0, background:BG, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ position:'absolute', top:'15%', left:'50%', transform:'translateX(-50%)', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(76,159,255,0.12) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div className="w-full max-w-sm" style={{ position:'relative' }}>
        <div className="text-center mb-10 flex flex-col items-center">
          <IolaLogo />
          <p style={{ color:'rgba(174,234,0,0.7)', fontSize:11, marginTop:10, letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:600 }}>Iola Speak</p>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, marginTop:4 }}>Tu entrenador de inglés con IA</p>
        </div>
        <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:24, backdropFilter:'blur(20px)' }}>
          {notice && <p className="text-green-400 text-xs mb-4">{notice}</p>}
          <form onSubmit={onSubmit} className="space-y-3">
            <input className={field} type="email" autoComplete="email" placeholder="tu@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <PasswordInput autoComplete={isSignup ? 'new-password' : 'current-password'}
              placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            {isSignup && (
              <div style={{ animation: 'slideDown 0.25s ease' }}>
                <PasswordInput autoComplete="new-password" placeholder="Repetir contraseña"
                  value={password2} onChange={(e) => setPassword2(e.target.value)} />
              </div>
            )}
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button disabled={busy} className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold disabled:opacity-40 transition hover:bg-white/90">
              {busy ? 'Un momento...' : isSignup ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </form>

          {isSignup && (
            <button onClick={() => { reset(); setForceLogin(true); setPassword(''); setPassword2(''); }}
              className="block mx-auto mt-3 text-white/40 hover:text-white/70 text-xs transition">
              ¿Ya tienes cuenta? Inicia sesión aquí
            </button>
          )}
          {!isSignup && (
            <button onClick={() => { reset(); setMode('forgot'); }}
              className="block mx-auto mt-3 text-white/25 hover:text-white/60 text-xs transition">
              ¿Olvidaste tu contraseña?
            </button>
          )}

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-white/8" />
            <span className="text-white/20 text-xs">o</span>
            <div className="flex-1 border-t border-white/8" />
          </div>

          <button onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-white/8 bg-white/3 hover:bg-white/8 text-sm text-white/70 font-medium transition">
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
      <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
  void G;
}
