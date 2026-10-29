import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { DRAFT_ID, loadSession, saveDraft, updateSessionPlan, type StoredSession } from '@/lib/sessionStore';
import type { SessionPlan } from '@/lib/sessionGenerator';

export function useStoredSession(id: string) {
  const { user, loading: authLoading } = useAuth();
  const [stored, setStored] = useState<StoredSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    if (authLoading) return;
    let active = true; setLoading(true);
    loadSession(id).then(s => { if (active) { setStored(s); setError(s ? '' : 'This session is unavailable.'); } })
      .catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, authLoading, user?.id]);
  const isOwner = id === DRAFT_ID || Boolean(user && stored?.userId === user.id);
  const persist = async (plan: SessionPlan) => {
    if (!stored || !isOwner) throw new Error('Only the session owner can save changes.');
    if (id === DRAFT_ID) saveDraft(stored.teamData, plan);
    else await updateSessionPlan(id, plan);
    setStored({ ...stored, plan });
  };
  return { stored, loading, error, isOwner, persist, user };
}