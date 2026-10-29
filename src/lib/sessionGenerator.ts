// Deterministic, rule-based session generator (template fallback).
// Pure functions only, so timing rules can be unit tested.

export interface Activity {
  format?: string;
  area?: { length: number; width: number; unit: 'metres' | 'yards' };
  rules?: string[];
  questions?: string[];
  commonErrors?: string[];
  allocation?: { active: number; rotating: number; groups: number };
  diagram?: { players: { x: number; y: number; team: 'attack' | 'defence' | 'neutral'; label?: string }[]; cones: { x: number; y: number }[]; balls: { x: number; y: number }[]; arrows: { x: number; y: number; toX: number; toY: number; kind: 'pass' | 'run' }[] };
  name: string;
  duration: number;
  description: string;
  setup: string;
  equipment: string;
  coachingPoints: string[];
  progressions: string[];
  regressions: string[];
}

export interface Phase {
  name: string;
  duration: number;
  activities: Activity[];
}

export interface TeamInput {
  pitchSize?: string;
  equipment?: string[];
  coachCount?: number;
  units?: 'metres' | 'yards';
  teamName?: string;
  ageGroup?: string;
  skillLevel?: string;
  playerCount?: number | string;
  sessionDuration?: number | string;
  playingStyle?: string;
  sessionGoals?: string;
  currentFocus?: string;
}

export interface SessionPlan {
  overview?: { theme: string; outcome: string };
  title: string;
  duration: number;
  objectives: string[];
  phases: Phase[];
  ageGroup?: string;
  skillLevel?: string;
  playerCount?: number;
  generator: 'template' | 'ai';
}

/** Split `total` into integers proportional to `weights` that sum exactly to `total`. */
export function splitMinutes(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (total * w) / sum);
  const floors = raw.map(Math.floor);
  let remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (let k = 0; remainder > 0; k = (k + 1) % order.length, remainder--) {
    floors[order[k].i] += 1;
  }
  return floors;
}

type Theme = 'passing' | 'finishing' | 'dribbling' | 'defending' | 'wide' | 'transition' | 'possession';

const THEME_KEYWORDS: [Theme, RegExp][] = [
  ['finishing', /finish|shoot|shot|scor|goal ?scor/i],
  ['wide', /wide|cross|wing|flank|cut-?back/i],
  ['defending', /defen|pressing|high press|counter.?press|press as|shape|tackl|compact|out of possession/i],
  ['dribbling', /dribbl|1v1|one v one|run with|beat (a|the) (player|defender)|ball mastery/i],
  ['transition', /transition|counter|regain|turnover/i],
  ['possession', /possession|keep the ball|build.?up|play out/i],
  ['passing', /pass|receiv|first touch|combination/i],
];

export function detectThemes(goals: string, focus = ''): Theme[] {
  const text = `${goals} ${focus}`;
  const found = THEME_KEYWORDS.filter(([, re]) => re.test(text)).map(([t]) => t);
  return found.length ? found : ['passing'];
}

const YOUNG = ['u7', 'u9'];

function areaSize(ageGroup: string, big: boolean) {
  if (YOUNG.includes(ageGroup)) return big ? '30x20 yards' : '15x15 yards';
  if (ageGroup === 'u11') return big ? '40x30 yards' : '20x20 yards';
  return big ? '50x40 yards' : '25x20 yards';
}

/** Small-sided format for n players, e.g. 16 -> "8v8", 13 -> "6v6 + 1 floater". */
export function gameFormat(n: number): string {
  if (n < 2) return '1v1 against the coach';
  const side = Math.floor(n / 2);
  const extra = n - side * 2;
  return extra ? `${side}v${side} + 1 floater` : `${side}v${side}`;
}

/** Rondo-style overload, e.g. 9 players -> "4v2 (x1 group) + 3 rotating". */
export function overloadFormat(n: number): string {
  if (n < 4) return `${Math.max(n - 1, 1)}v1`;
  const groupSize = n >= 12 ? 6 : n >= 8 ? 5 : 4;
  const groups = Math.floor(n / groupSize);
  const spare = n - groups * groupSize;
  const att = groupSize - 2;
  const base = `${att}v2 in ${groups} group${groups > 1 ? 's' : ''}`;
  return spare ? `${base}, ${spare} rotating in` : base;
}

function technical(theme: Theme, t: TeamInput, n: number): Omit<Activity, 'duration'> {
  const age = t.ageGroup || 'u11';
  const beginner = ['beginner', 'developing'].includes(t.skillLevel || '');
  const small = areaSize(age, false);
  switch (theme) {
    case 'finishing':
      return {
        name: 'Finishing Circuit',
        description: `Two lines feed the striker for quick-fire finishes. ${n} players rotate through server, striker and retriever roles.`,
        setup: `Edge of the box, goal with keeper. Players split into ${Math.max(2, Math.ceil(n / 4))} lines of up to 4.`,
        equipment: 'Goal, 12+ balls, cones, bibs',
        coachingPoints: ['Open body before receiving', 'Shoot early, low and across the keeper', 'Follow in for rebounds', 'Pick your spot before you strike'],
        progressions: ['Add a recovering defender', 'Limit to two touches', 'Serve from wide areas'],
        regressions: ['Ball rolled in stationary', 'Bigger goal or no keeper', 'Shoot from closer'],
      };
    case 'wide':
      return {
        name: 'Wide Delivery & Arrival',
        description: 'Wide players drive to the byline and deliver; two attackers time runs to near post and back post.',
        setup: `Half pitch with channels marked 10 yards in from each touchline. ${n} players rotate wide, central and keeper roles.`,
        equipment: 'Goal, cones for channels, 12+ balls',
        coachingPoints: ['Get your head up before the cross', 'Attack near post, back post and cut-back zone', 'Arrive late, not early', 'Cross with pace into the danger area'],
        progressions: ['Add a defender in the box', 'Delivery within 3 touches', 'Add a full-back to beat 1v1'],
        regressions: ['Unopposed delivery', 'Cross from a stationary ball', 'One attacker only'],
      };
    case 'dribbling':
      return {
        name: '1v1 Gates',
        description: 'Attackers try to dribble through any gate while a defender stops them. Points for each gate.',
        setup: `${small} area with 5-6 cone gates. Players in pairs (${Math.floor(n / 2)} pairs).`,
        equipment: '1 ball per pair, 12 cones, bibs',
        coachingPoints: ['Keep the ball close with small touches', 'Use a feint then change pace', 'Protect the ball with your body', 'Attack the defender’s front foot'],
        progressions: ['Gates must be different each time', 'Time limit of 30 seconds', 'Add a second defender'],
        regressions: ['Defender passive (walking)', 'Bigger gates', 'Unopposed ball mastery first'],
      };
    case 'defending':
      return {
        name: '1v1 / 2v2 Defending Lanes',
        description: 'Defender serves and closes down the attacker, who tries to dribble over the end line.',
        setup: `Lanes ${YOUNG.includes(age) ? '10x15' : '15x25'} yards. Players split into ${Math.max(1, Math.floor(n / 4))} lanes.`,
        equipment: 'Cones, bibs, 1 ball per lane',
        coachingPoints: ['Close down quickly, slow down late', 'Side-on and on your toes', 'Show them away from goal', 'Only tackle when the ball is away from their feet'],
        progressions: ['Go to 2v2 with cover and balance', 'Attacker scores in a mini goal', 'Narrow the lane'],
        regressions: ['Attacker at walking pace', 'Wider end line to defend', 'Coach-led shadow defending'],
      };
    case 'transition':
      return {
        name: 'Win It, Go!',
        description: `Possession game: when defenders win the ball they race to dribble out of the area for a point.`,
        setup: `${small} area. ${overloadFormat(n)}.`,
        equipment: 'Cones, bibs, 2 balls per group',
        coachingPoints: ['First thought on winning it: forward', 'Nearest player presses on losing it', 'React within 3 seconds', 'Support quickly after a regain'],
        progressions: ['Add target gates to dribble through', 'Reduce the reaction time to 3 seconds', 'Lower the overload'],
        regressions: ['Bigger area', 'Bigger overload for attackers', 'Coach calls "switch"'],
      };
    case 'possession':
    case 'passing':
    default:
      return {
        name: beginner ? 'Passing Pairs to Rondo' : 'Rondo Under Pressure',
        description: beginner
          ? 'Start with passing in pairs through gates, then progress to a simple rondo.'
          : `Keep possession against the defenders. 8 passes scores a point; defenders swap in when they win it.`,
        setup: `${small} grid. ${overloadFormat(n)}.`,
        equipment: 'Cones, bibs, 2 balls per group',
        coachingPoints: ['Scan before the ball arrives', 'Open body to see more options', 'Pass into the furthest foot', 'Move to make an angle after you pass'],
        progressions: ['Two-touch limit', 'Shrink the grid', 'Reduce the overload'],
        regressions: ['Bigger grid', 'Add a neutral player', 'Defenders can only intercept, not tackle'],
      };
  }
}

function tactical(theme: Theme, t: TeamInput, n: number): Omit<Activity, 'duration'> {
  const age = t.ageGroup || 'u11';
  const big = areaSize(age, true);
  const fmt = ageGameFormat(n, age);
  const styleNote = t.playingStyle ? ` Linked to your ${t.playingStyle} style.` : '';
  switch (theme) {
    case 'finishing':
    case 'wide':
      return {
        name: theme === 'wide' ? 'Wide Overload Game' : 'Shooting Zone Game',
        description: `${fmt} game.${theme === 'wide' ? ' Free wide channels where attackers cannot be tackled; goals from crosses count double.' : ' Shots from outside the zone are allowed at any time; goals after 3 passes count double.'}${styleNote}`,
        setup: `${big} pitch with two goals${theme === 'wide' ? ' and wide channels' : ' and a shooting zone marked'}.`,
        equipment: '2 goals, cones, bibs, balls',
        coachingPoints: ['Create space before you shoot', 'Support the ball carrier quickly', 'Attack the box with more than one runner', 'Shoot when you have a sight of goal'],
        progressions: ['Remove the free zone', 'Time limit per attack', 'Add a scoring bonus for first-time finishes'],
        regressions: ['Add a floater for attackers', 'Bigger goals', 'Defenders cannot enter the zone'],
      };
    case 'defending':
      return {
        name: 'Defensive Shape Game',
        description: `${fmt}. Defending team must stay compact; they score by winning the ball and passing into a target player.${styleNote}`,
        setup: `${big} pitch, one goal and two counter-attack gates.`,
        equipment: 'Goal, cones, bibs, balls',
        coachingPoints: ['Stay compact - distances between players short', 'Press as a unit on the trigger', 'Communicate: who presses, who covers', 'Protect the middle first'],
        progressions: ['Add a pressing trigger (bad touch, back pass)', 'Attackers get an extra player', 'Defenders must regain within 6 seconds'],
        regressions: ['Attackers limited to 3 touches', 'Coach freezes play to fix shape', 'Smaller area'],
      };
    case 'transition':
      return {
        name: 'Transition Game',
        description: `${fmt}. When a team loses the ball the coach plays a new ball to the other team straight away.${styleNote}`,
        setup: `${big} pitch with goals at each end.`,
        equipment: '2 goals, cones, bibs, plenty of balls',
        coachingPoints: ['React first - no switching off', 'Counter-press for 5 seconds', 'Forward pass early when you win it', 'Get numbers behind the ball'],
        progressions: ['Goals within 8 seconds of a regain count double', 'Reduce pitch size', 'Uneven teams'],
        regressions: ['Add neutral players', 'Bigger pitch', 'Coach pauses between restarts'],
      };
    case 'dribbling':
      return {
        name: 'Dribble-In Game',
        description: `${fmt}. Teams score by dribbling over the end line under control, or through a goal.${styleNote}`,
        setup: `${big} pitch with end lines as targets.`,
        equipment: 'Cones, bibs, balls',
        coachingPoints: ['Spot space and run into it with the ball', 'Take the defender on in 1v1s', 'Support behind for a safe pass', 'Change direction to beat pressure'],
        progressions: ['Must beat a player before scoring', 'Narrower end lines', 'Add goals'],
        regressions: ['Wider pitch', 'Add a floater', 'Defenders cannot tackle from behind'],
      };
    default:
      return {
        name: 'Possession to Score Game',
        description: `${fmt}. Teams must complete a set number of passes before they can score.${styleNote}`,
        setup: `${big} pitch with two goals.`,
        equipment: '2 goals, cones, bibs, balls',
        coachingPoints: ['Make the pitch big when in possession', 'Play forward when it is on', 'Move after you pass', 'Keep the ball moving quickly'],
        progressions: ['Increase passes required', 'Two-touch limit', 'Remove the floater'],
        regressions: ['Add a floater', 'Fewer passes required', 'Bigger pitch'],
      };
  }
}

export function generateSessionPhases(t: TeamInput): Phase[] {
  const duration = Number(t.sessionDuration) || 60;
  const n = Math.max(1, Number(t.playerCount) || 12);
  const themes = detectThemes(t.sessionGoals || '', t.currentFocus || '');
  const primary = themes[0];
  const secondary = themes[1] ?? primary;
  const longSession = duration >= 75;

  const names = longSession
    ? ['Warm-Up', 'Technical Practice', 'Tactical Practice', 'Small-Sided Game', 'Cool-Down']
    : ['Warm-Up', 'Technical Practice', 'Tactical Practice', 'Cool-Down'];
  const weights = longSession ? [15, 25, 30, 20, 10] : [15, 35, 35, 15];
  const minutes = splitMinutes(duration, weights);
  const small = areaSize(t.ageGroup || 'u11', false);

  const build = (name: string, total: number): Phase => {
    let parts: Omit<Activity, 'duration'>[];
    let w: number[];
    if (name === 'Warm-Up') {
      parts = [
        {
          name: 'Arrival Activity & Movement',
          description: 'Players arrive and move with a ball: dynamic movements, changes of speed and direction.',
          setup: `${small} area, everyone with a ball.`,
          equipment: '1 ball per player, cones',
          coachingPoints: ['Build intensity gradually', 'Use both feet', 'Head up to avoid others'],
          progressions: ['Add sharp turns on the whistle'], regressions: ['Walk it through first'],
        },
        {
          name: primary === 'finishing' || primary === 'wide' ? 'Passing & Strike Prep' : 'Ball Mastery',
          description: `Individual and paired ball work preparing for today's focus on ${primary}.`,
          setup: `Pairs in a ${small} area.`,
          equipment: '1 ball per pair',
          coachingPoints: ['Soft first touch', 'Quick feet', 'Look up regularly'],
          progressions: ['One-touch only'], regressions: ['Two touches allowed'],
        },
      ];
      w = [1, 1];
    } else if (name === 'Technical Practice') {
      parts = [technical(primary, t, n)];
      w = [1];
    } else if (name === 'Tactical Practice') {
      parts = [tactical(secondary, t, n)];
      w = [1];
    } else if (name === 'Small-Sided Game') {
      parts = [{
        name: `Free Game (${ageGameFormat(n, t.ageGroup || 'u11')})`,
        description: `Open game to apply today's work on ${themes.join(' and ')}. Light-touch coaching only.`,
        setup: `${areaSize(t.ageGroup || 'u11', true)} pitch with two goals.`,
        equipment: '2 goals, bibs, balls',
        coachingPoints: ['Let them play', 'Praise moments linked to the session goal', 'Ask one question at a break'],
        progressions: ['Add a scoring bonus linked to the theme'], regressions: ['Add a floater to help the weaker team'],
      }];
      w = [1];
    } else {
      parts = [{
        name: 'Cool-Down & Review',
        description: YOUNG.includes(t.ageGroup || '') ? 'Walk with the ball, take a drink and share one good moment. Keep the review short and positive.' : 'Light jog and comfortable mobility, then a short review: what went well and one thing to work on.',
        setup: 'Team circle.',
        equipment: 'Water bottles',
        coachingPoints: ['Slow the heart rate gradually', 'Ask players what they learned', 'Finish on a positive'],
        progressions: [], regressions: [],
      }];
      w = [1];
    }
    const split = splitMinutes(total, w);
    return { name, duration: total, activities: parts.map((p, i) => ({ ...p, duration: split[i] })) };
  };

  return names.map((name, i) => build(name, minutes[i])).map(phase => ({ ...phase, activities: phase.activities.map(a => {
    const unit = t.units || 'metres';
    const convert = (s: string) => unit === 'yards' ? s : s.replace(/(\d+)x(\d+) yards/g, (_, l, w) => `${Math.round(Number(l) * 0.9144)}x${Math.round(Number(w) * 0.9144)} metres`).replace(/(\d+) yards/g, (_, d) => `${Math.round(Number(d) * 0.9144)} metres`);
    return { ...a, setup: convert(a.setup), description: convert(a.description) };
  }) }));
}

export function ageGameFormat(n: number, age: string) {
  const max = age === 'u7' ? 5 : age === 'u9' ? 7 : age === 'u11' ? 9 : 11;
  const perGame = max * 2;
  if (n <= perGame) return gameFormat(n);
  const groups = Math.ceil(n / perGame);
  const smaller = Math.floor(n / groups);
  const spare = n % groups;
  return `${groups} pitches: ${gameFormat(smaller)}${spare ? `; ${spare} pitch${spare > 1 ? 'es' : ''} with one extra rotating player` : ''}`;
}

export function buildSessionPlan(t: TeamInput): SessionPlan {
  const objectives = (t.sessionGoals || '')
    .split(/[,;\n]/)
    .map((g) => g.trim())
    .filter(Boolean);
  return {
    title: `${(t.teamName || 'Team').trim()} Training Session`,
    duration: Number(t.sessionDuration) || 60,
    objectives,
    phases: generateSessionPhases(t),
    ageGroup: t.ageGroup,
    skillLevel: t.skillLevel,
    playerCount: Number(t.playerCount) || undefined,
    generator: 'template',
  };
}

/** Recalculate a phase's duration from its activities after edits. */
export function recomputeDurations(plan: SessionPlan): SessionPlan {
  const phases = plan.phases.map((p) => ({
    ...p,
    duration: p.activities.reduce((a, b) => a + (Number(b.duration) || 0), 0),
  }));
  return { ...plan, phases, duration: phases.reduce((a, b) => a + b.duration, 0) };
}
