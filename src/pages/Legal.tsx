import { Link } from 'react-router-dom';
import { SAFEGUARDING } from '@/lib/safety';

const CONTENT = {
  privacy: {
    title: 'Privacy',
    body: [
      'If you create an account, we store your email address, the teams you set up and the sessions you save so you can use them again.',
      'Session details you enter (such as team name, age group and goals) are sent to an AI service to write your plan. Do not enter player names or personal details.',
      'Saved sessions are private unless you choose to share them with a link.',
      'Full details about who runs CoachAssist, how long data is kept and how to contact us will be added here before launch.',
    ],
  },
  terms: {
    title: 'Terms of use',
    body: [
      'CoachAssist gives football coaching suggestions. AI-written plans can contain mistakes, so check every practice before you use it.',
      SAFEGUARDING,
      'CoachAssist is not endorsed by The FA, UEFA or any governing body.',
      'Full terms, including who provides the service, will be added here before launch.',
    ],
  },
};

export default function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const c = CONTENT[kind];
  return (
    <main className="max-w-2xl mx-auto px-5 py-12 space-y-5">
      <Link to="/" className="text-sm text-primary underline">Back to home</Link>
      <h1 className="text-3xl font-semibold">{c.title}</h1>
      {c.body.map(p => <p key={p} className="text-muted-foreground leading-relaxed">{p}</p>)}
    </main>
  );
}
