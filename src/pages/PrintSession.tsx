import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { loadSession, type StoredSession } from '@/lib/sessionStore';

// Never render "undefined"/"null" in print output.
const t = (v: unknown) => (v === undefined || v === null ? '' : String(v));
const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter(Boolean).map(String) : []);

const PrintSession = () => {
  const { id = '' } = useParams();
  const [s, setS] = useState<StoredSession | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSession(id).then((r) => (r ? setS(r) : setError('Session not found.'))).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (s) {
      document.title = `${s.plan.title} - Session Plan`;
      const timer = setTimeout(() => window.print(), 300);
      return () => clearTimeout(timer);
    }
  }, [s]);

  if (error) return <p className="p-8">{error}</p>;
  if (!s) return <p className="p-8">Preparing print view...</p>;

  const { plan, teamData } = s;
  const equipment = Array.from(new Set(plan.phases.flatMap((p) => p.activities.map((a) => t(a.equipment))).filter(Boolean)));
  const info: [string, string][] = [
    ['Age group', t(teamData.ageGroup).toUpperCase()],
    ['Skill level', t(teamData.skillLevel)],
    ['Players', t(teamData.playerCount)],
    ['Duration', `${t(plan.duration)} minutes`],
    ['Playing style', t(teamData.playingStyle)],
  ];

  return (
    <div className="print-page max-w-3xl mx-auto p-6 bg-background text-foreground">
      <div className="no-print flex justify-between mb-6">
        <Button variant="ghost" asChild><Link to={`/session/${id}`}><ArrowLeft className="w-4 h-4 mr-2" />Back to session</Link></Button>
        <Button onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" />Print / Save as PDF</Button>
      </div>

      <header className="border-b-2 border-primary pb-4 mb-6 text-center">
        <h1 className="text-3xl font-bold">{t(plan.title)}</h1>
        <p className="text-sm text-muted-foreground">CoachAssist session plan</p>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm mb-6">
        {info.filter(([, v]) => v.trim()).map(([k, v]) => (
          <div key={k}><strong>{k}:</strong> {v}</div>
        ))}
      </section>

      {list(plan.objectives).length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-1">Objectives</h2>
          <ul className="list-disc pl-5 text-sm">{list(plan.objectives).map((o, i) => <li key={i}>{o}</li>)}</ul>
        </section>
      )}

      {equipment.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-1">Equipment</h2>
          <ul className="list-disc pl-5 text-sm">{equipment.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </section>
      )}

      {plan.phases.map((phase, pi) => (
        <section key={pi} className="print-phase mb-6 border border-border rounded-lg overflow-hidden">
          <h2 className="bg-primary text-primary-foreground px-4 py-2 font-bold">{t(phase.name)} ({t(phase.duration)} min)</h2>
          {phase.activities.map((a, ai) => (
            <div key={ai} className="p-4 text-sm space-y-2 border-t border-border first:border-t-0">
              <h3 className="font-semibold text-base">{t(a.name)} – {t(a.duration)} min</h3>
              {t(a.description) && <p><strong>Description:</strong> {t(a.description)}</p>}
              {t(a.setup) && <p><strong>Setup:</strong> {t(a.setup)}</p>}
              {t(a.equipment) && <p><strong>Equipment:</strong> {t(a.equipment)}</p>}
              {[['Coaching points', a.coachingPoints], ['Progressions', a.progressions], ['Regressions', a.regressions]].map(([label, items]) =>
                list(items).length ? (
                  <div key={label as string}>
                    <strong>{label as string}:</strong>
                    <ul className="list-disc pl-5">{list(items).map((x, i) => <li key={i}>{x}</li>)}</ul>
                  </div>
                ) : null,
              )}
            </div>
          ))}
        </section>
      ))}

      <footer className="text-xs text-muted-foreground text-center border-t border-border pt-4">
        Adapt activities to your players, the weather and your facilities.
      </footer>
    </div>
  );
};

export default PrintSession;
