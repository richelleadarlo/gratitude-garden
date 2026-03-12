import { useState } from 'react';

interface GratitudeInputProps {
  addEntry: (text: string) => void;
  hasPostedToday: boolean;
  deleteTodayEntry: () => void;
  isDeletingToday: boolean;
}

const GratitudeInput = ({
  addEntry,
  hasPostedToday,
  deleteTodayEntry,
  isDeletingToday,
}: GratitudeInputProps) => {
  const [text, setText] = useState('');

  // Format today's date in a friendly way
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !hasPostedToday) {
      addEntry(text.trim());
      setText('');
    }
  };

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-xl">
      {/* Display today's date */}
      <p className="text-sm text-white font-bold mb-2">{today}</p>
      <form onSubmit={handleSubmit}>
        {/* Gratitude text area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            hasPostedToday
              ? "You've planted your gratitude for today. See you tomorrow! 🌱"
              : 'What are you grateful for today?'
          }
          disabled={hasPostedToday}
          className="w-full p-4 text-base bg-background rounded-lg shadow-surface-inset focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none transition-all duration-200 disabled:opacity-60"
          rows={3}
        />
        {/* Plant button */}
        <button
          type="submit"
          disabled={hasPostedToday || !text.trim()}
          className="mt-4 w-full sm:w-auto h-11 px-8 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold shadow-surface hover:shadow-surface-hover transition-all duration-200 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed active:scale-[0.98]"
        >
          🌱 Plant Gratitude
        </button>

        {hasPostedToday && (
          <button
            type="button"
            onClick={deleteTodayEntry}
            disabled={isDeletingToday}
            className="mt-3 w-full sm:w-auto h-10 px-6 inline-flex items-center justify-center rounded-full glass-panel text-foreground font-semibold hover:glass-panel-hover transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeletingToday ? 'Removing today\'s entry...' : 'Delete today\'s entry and try again'}
          </button>
        )}
      </form>
    </div>
  );
};

export default GratitudeInput;
