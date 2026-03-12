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

  const { playPlantSound, playDeleteSound } = usePlantSound();

  // Persist entries to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
  }, [entries]);

  // Add a new gratitude entry
  const [newestEntryId, setNewestEntryId] = useState<number | null>(null);
  const [removingEntryId, setRemovingEntryId] = useState<number | null>(null);
  const [isDeletingToday, setIsDeletingToday] = useState(false);

  const addEntry = (text: string) => {
    const newEntry: GratitudeEntry = {
      id: Date.now(),
      text,
      date: new Date().toISOString(),
    };
    setEntries((prev) => [...prev, newEntry]);
    setNewestEntryId(newEntry.id);
    playPlantSound();
  };

  const latestTodayEntry = useMemo(() => {
    const todayStr = new Date().toDateString();
    const todays = entries.filter(
      (entry) => new Date(entry.date).toDateString() === todayStr,
    );
    if (todays.length === 0) return null;

    return todays.reduce((latest, current) => {
      return new Date(current.date).getTime() > new Date(latest.date).getTime()
        ? current
        : latest;
    });
  }, [entries]);

  // Check if user already posted today
  const hasPostedToday = latestTodayEntry !== null;

  const deleteTodayEntry = () => {
    if (!latestTodayEntry || isDeletingToday) return;

    const targetId = latestTodayEntry.id;
    setIsDeletingToday(true);
    setRemovingEntryId(targetId);
    setHighlightedEntryId((prev) => (prev === targetId ? null : prev));
    playDeleteSound();

    window.setTimeout(() => {
      setEntries((prev) => prev.filter((entry) => entry.id !== targetId));
      setNewestEntryId((prev) => (prev === targetId ? null : prev));
      setRemovingEntryId(null);
      setIsDeletingToday(false);
    }, 430);
  };

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
    <div
      className="min-h-svh bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12 pb-24">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left column: Title + subtitle + input */}
          <div className="space-y-6">
            <header className="text-center flex flex-col items-center">
              <img
                src="/title.png"
                alt="Gratitude Garden"
                className="w-full max-w-sm h-auto drop-shadow-sm"
              />
              <p className="mt-3 glass-panel rounded-full px-4 py-2 text-foreground/95 font-medium drop-shadow-sm">
                A space to cultivate joy, one thought at a time. {seasonEmoji[season]}
              </p>
              {/* Streak counter */}
              {streak > 0 && (
                <div className="inline-flex items-center gap-2 mt-4 glass-panel px-3 py-1.5 rounded-full text-foreground font-semibold">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-sm tabular-nums">
                    {streak} day streak
                  </span>
                </div>
              )}
            </header>

            <section>
              <GratitudeInput
                addEntry={addEntry}
                hasPostedToday={hasPostedToday}
                deleteTodayEntry={deleteTodayEntry}
                isDeletingToday={isDeletingToday}
              />
            </section>
          </div>

          {/* Right column: Garden + Entry History */}
          <div className="space-y-8 lg:self-center">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground drop-shadow-sm">
                Your Garden
              </h2>
              <Garden
                entries={entries}
                highlightedEntryId={highlightedEntryId}
                newestEntryId={newestEntryId}
                removingEntryId={removingEntryId}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground drop-shadow-sm">
                Entry History
              </h2>
              <EntryHistory entries={entries} onEntryHover={setHighlightedEntryId} />
            </section>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20">
        <a
          href="https://richelleadarlo.space/"
          className="text-xs sm:text-sm text-foreground/80 hover:text-foreground transition-colors glass-panel rounded-full px-3 py-1"
        >
          © Richelle Adarlo
        </a>
      </footer>
    </div>
  );
};

export default Index;
