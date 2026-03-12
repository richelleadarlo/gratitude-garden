import { useState, useEffect, useMemo } from 'react';
import { Flame } from 'lucide-react';
import GratitudeInput from '@/components/GratitudeInput';
import Garden from '@/components/Garden';
import EntryHistory from '@/components/EntryHistory';
import { usePlantSound } from '@/hooks/usePlantSound';
import type { GratitudeEntry } from '@/types/gratitude';

/**
 * Index page - the main Gratitude Garden application.
 * Manages entries in LocalStorage and orchestrates the UI sections.
 */
const Index = () => {
  // Load entries from LocalStorage on mount
  const [entries, setEntries] = useState<GratitudeEntry[]>(() => {
    try {
      const saved = localStorage.getItem('gratitudeEntries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track which entry is highlighted (from history hover/click)
  const [highlightedEntryId, setHighlightedEntryId] = useState<number | null>(null);

  const playSound = usePlantSound();

  // Persist entries to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
  }, [entries]);

  // Add a new gratitude entry
  const addEntry = (text: string) => {
    const newEntry: GratitudeEntry = {
      id: Date.now(),
      text,
      date: new Date().toISOString(),
    };
    setEntries((prev) => [...prev, newEntry]);
    playSound();
  };

  // Check if user already posted today
  const hasPostedToday = entries.some((entry) => {
    return new Date(entry.date).toDateString() === new Date().toDateString();
  });

  // Calculate the current streak of consecutive days
  const streak = useMemo(() => {
    if (entries.length === 0) return 0;

    const uniqueDates = [
      ...new Set(entries.map((e) => new Date(e.date).toDateString())),
    ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const today = new Date();
    const todayStr = today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    // Streak must start from today or yesterday
    if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) return 0;

    let count = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const curr = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);
      const diffDays = (curr.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
      if (Math.round(diffDays) === 1) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [entries]);

  // Determine the current season for a subtle seasonal accent
  const season = useMemo(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }, []);

  const seasonEmoji: Record<string, string> = {
    spring: '🌸',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️',
  };

  return (
    <div className="min-h-svh">
      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-10">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Gratitude Garden
          </h1>
          <p className="text-muted-foreground mt-2">
            A space to cultivate joy, one thought at a time. {seasonEmoji[season]}
          </p>
          {/* Streak counter */}
          {streak > 0 && (
            <div className="inline-flex items-center gap-2 mt-4 bg-accent/20 text-accent-foreground px-3 py-1.5 rounded-full">
              <Flame className="w-4 h-4 text-accent" />
              <span className="font-semibold text-sm tabular-nums">
                {streak} day streak
              </span>
            </div>
          )}
        </header>

        {/* Gratitude input form */}
        <section>
          <GratitudeInput addEntry={addEntry} hasPostedToday={hasPostedToday} />
        </section>

        {/* Garden visualization */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">
            Your Garden
          </h2>
          <Garden entries={entries} highlightedEntryId={highlightedEntryId} />
        </section>

        {/* Entry history */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">
            Entry History
          </h2>
          <EntryHistory entries={entries} onEntryHover={setHighlightedEntryId} />
        </section>
      </main>
    </div>
  );
};

export default Index;
