import { noHeadingAge } from './ageGroups';

export interface PracticeSummary {
  id: number; title: string; description: string; duration: string; players: string; difficulty: string; category?: string;
}
export interface PracticeFilters { query: string; players: string; minutes: string; difficulty: string; age: string }

export function matchesPractice(practice: PracticeSummary, filters: PracticeFilters): boolean {
  const text = `${practice.title} ${practice.description}`;
  if (!text.toLowerCase().includes(filters.query.trim().toLowerCase())) return false;
  if (filters.difficulty !== 'all' && practice.difficulty !== filters.difficulty && practice.difficulty !== 'All Levels') return false;
  const range = practice.players.match(/\d+/g)?.map(Number) || [];
  if (filters.players && (Number(filters.players) < range[0] || Number(filters.players) > (range[1] ?? range[0]))) return false;
  const duration = practice.duration.match(/\d+/g)?.map(Number) || [];
  if (filters.minutes !== 'all' && (duration[1] ?? duration[0]) > Number(filters.minutes)) return false;
  // Do not invent age suitability for unverified themes; exclude deliberate heading for younger teams only.
  if (filters.age !== 'all' && noHeadingAge(filters.age) && /heading|headers/i.test(text)) return false;
  return true;
}