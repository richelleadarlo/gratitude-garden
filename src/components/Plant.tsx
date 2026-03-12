import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Flower2 } from 'lucide-react';
import type { GratitudeEntry } from '@/types/gratitude';

interface PlantProps {
  entry: GratitudeEntry;
  isNew: boolean;
  isRemoving: boolean;
}

/** Flower color variants – deterministically assigned by entry id */
const FLOWER_COLORS = [
  'text-pink-400',
  'text-yellow-400',
  'text-purple-400',
  'text-red-400',
  'text-orange-400',
];

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

/**
 * Plant component – shows a sprout that animates in when first planted,
 * then blossoms into a randomly-coloured flower after 2 hours.
 */
const Plant = ({ entry, isNew, isRemoving }: PlantProps) => {
  const [isFlower, setIsFlower] = useState(
    () => Date.now() - new Date(entry.date).getTime() >= TWO_HOURS_MS,
  );

  const flowerColor = FLOWER_COLORS[entry.id % FLOWER_COLORS.length];

  // Schedule transition from sprout → flower
  useEffect(() => {
    if (isFlower) return;
    const msUntilFlower = Math.max(
      0,
      new Date(entry.date).getTime() + TWO_HOURS_MS - Date.now(),
    );
    const timer = setTimeout(() => setIsFlower(true), msUntilFlower);
    return () => clearTimeout(timer);
  }, [entry.date, isFlower]);

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      initial={isNew ? { opacity: 0, scale: 0, y: 8 } : { opacity: 0, scale: 0.5 }}
      animate={
        isRemoving
          ? {
              opacity: [1, 0.85, 0],
              scale: [1, 0.75, 0],
              y: [0, -3, 7],
              rotate: [0, 6, -8],
            }
          : isNew
          ? {
              opacity: [0, 1, 1, 1],
              scale: [0, 1.35, 0.88, 1],
              y: [8, -4, 1, 0],
            }
          : { opacity: 1, scale: 1, y: 0, rotate: 0 }
      }
      transition={
        isRemoving
          ? { duration: 0.4, times: [0, 0.55, 1], ease: 'easeInOut' }
          : isNew
          ? { duration: 0.75, times: [0, 0.45, 0.75, 1], ease: 'easeOut' }
          : { duration: 0.35, delay: 0.05, ease: [0.3, 0, 0.5, 1] }
      }
    >
      {isFlower ? (
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Flower2 className={`w-5 h-5 sm:w-6 sm:h-6 ${flowerColor}`} />
        </motion.div>
      ) : (
        <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-primary/70" />
      )}
    </motion.div>
  );
};

export default Plant;
