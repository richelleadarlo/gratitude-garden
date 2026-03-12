import type { GratitudeEntry } from '@/types/gratitude';

interface EntryHistoryProps {
  entries: GratitudeEntry[];
  onEntryHover: (id: number | null) => void;
}

/**
 * EntryHistory - displays past gratitude entries in reverse chronological order.
 * Hovering over an entry highlights its corresponding plant in the garden.
 */
const EntryHistory = ({ entries, onEntryHover }: EntryHistoryProps) => {
  const sortedEntries = [...entries].reverse();

  return (
    <div className="space-y-3" onMouseLeave={() => onEntryHover(null)}>
      {sortedEntries.length > 0 ? (
        sortedEntries.map((entry) => (
          <div
            key={entry.id}
            onMouseEnter={() => onEntryHover(entry.id)}
            onClick={() => onEntryHover(entry.id)}
            className="bg-card p-4 rounded-xl shadow-surface cursor-default hover:shadow-surface-hover transition-shadow duration-200"
          >
            <p className="text-sm font-semibold text-muted-foreground mb-1">
              {new Date(entry.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="text-foreground">{entry.text}</p>
          </div>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-8 bg-card rounded-xl shadow-surface">
          Your past entries will appear here.
        </div>
      )}
    </div>
  );
};

export default EntryHistory;
