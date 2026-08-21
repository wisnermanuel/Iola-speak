import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

export const ADMIN_EMAIL = 'wisnermartinezbtc@gmail.com';

interface AuthState {
  session: Session | null;
  user: User | null;
  email: string | null;
  loading: boolean;
  checking: boolean;
  allowed: boolean;
  isAdmin: boolean;
  recovery: boolean;
  clearRecovery: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, sess) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      setSession(sess);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    async function check() {
      const email = session?.user?.email?.toLowerCase();
      if (!email) { setAllowed(false); setChecking(false); return; }
      if (email === ADMIN_EMAIL) { setAllowed(true); setChecking(false); return; }
      setChecking(true);
      const { data } = await supabase
        .from('allowlist')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      if (!active) return;
      setAllowed(!!data);
      setChecking(false);
    }
    check();
    return () => { active = false; };
  }, [session]);

  const email = session?.user?.email?.toLowerCase() ?? null;

  return (
    <AuthContext.Provider value={{
      session, user: session?.user ?? null, email, loading, checking, allowed,
      isAdmin: email === ADMIN_EMAIL,
      recovery, clearRecovery: () => setRecovery(false),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email: email.trim(), password });

export const signUp = (email: string, password: string) =>
  supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin } });

export const sendPasswordReset = (email: string) =>
  supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });

export const updatePassword = (password: string) =>
  supabase.auth.updateUser({ password });

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });

export const signOut = () => supabase.auth.signOut();
