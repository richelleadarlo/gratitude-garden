import { motion } from 'framer-motion';
import { Sprout, TreePine, Flower2 } from 'lucide-react';

interface PlantProps {
  entryIndex: number;
}

/**
 * Plant component - renders different plant icons based on milestones.
 * - Entries 1-6: Seedling (Sprout)
 * - Entries 7-29: Tree (TreePine) 
 * - Entries 30+: Flower (Flower2)
 */
const Plant = ({ entryIndex }: PlantProps) => {
  const entryNumber = entryIndex + 1;

  const getPlantIcon = () => {
    if (entryNumber >= 30)
      return <Flower2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />;
    if (entryNumber >= 7)
      return <TreePine className="w-5 h-5 sm:w-6 sm:h-6 text-primary/80" />;
    return <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-primary/70" />;
  };

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.05, ease: [0.3, 0, 0.5, 1] }}
    >
      {getPlantIcon()}
    </motion.div>
  );
};

export default Plant;
