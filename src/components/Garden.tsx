import Plant from './Plant';
import type { GratitudeEntry } from '@/types/gratitude';

interface GardenProps {
  entries: GratitudeEntry[];
  highlightedEntryId: number | null;
  newestEntryId: number | null;
}

/**
 * Garden component - a 7-column grid representing the user's gratitude history.
 * Each cell is a "plot" that holds a plant. Highlighted entries get an accent ring.
 */
const Garden = ({ entries, highlightedEntryId, newestEntryId }: GardenProps) => {
  return (
    <div className="glass-panel rounded-xl p-4">
      {entries.length > 0 ? (
        <div className="grid grid-cols-7 gap-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`aspect-square flex items-center justify-center bg-background/50 rounded-lg transition-all duration-200 ${
                highlightedEntryId === entry.id
                  ? 'ring-2 ring-accent scale-110'
                  : ''
              }`}
            >
              <Plant entry={entry} isNew={entry.id === newestEntryId} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          Your garden is waiting. Plant your first seed of gratitude. 🌱
        </p>
      )}
    </div>
  );
};

export default Garden;
