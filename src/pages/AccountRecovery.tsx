import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validPassword } from '@/lib/password';
export default function AccountRecovery() {
  const [reset, setReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { const { data } = supabase.auth.onAuthStateChange(event => { if (event === 'PASSWORD_RECOVERY') setReset(true); }); return () => data.subscription.unsubscribe(); }, []);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMessage('');
    if (reset && !validPassword(password, confirm)) { setMessage('Use matching passwords with at least eight characters, uppercase, lowercase, a number and a symbol.'); return; }
    setBusy(true);
    try { const { error } = reset ? await supabase.auth.updateUser({ password }) : await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account/recovery` }); if (error) throw error; setMessage(reset ? 'Password updated. You can return to your account.' : 'If that account exists, check your email for a reset link.'); } catch { setMessage('Could not complete the request. Please try again.'); } finally { setBusy(false); }
  };
  return <main className="max-w-md mx-auto px-4 py-16 space-y-6"><Button asChild variant="ghost"><Link to="/account">Back to account</Link></Button><h1 className="text-3xl font-bold">{reset ? 'New password' : 'Reset password'}</h1><form onSubmit={submit} className="space-y-4">{reset ? <><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)} /><Label htmlFor="repeat-password">Repeat password</Label><Input id="repeat-password" type="password" autoComplete="new-password" required value={confirm} onChange={e => setConfirm(e.target.value)} /></> : <><Label htmlFor="reset-email">Email</Label><Input id="reset-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></>}<Button disabled={busy} type="submit">{busy ? 'Please wait…' : reset ? 'Update password' : 'Send reset link'}</Button>{message && <p role="status">{message}</p>}</form></main>;
}