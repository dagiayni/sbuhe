'use client';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface SaintOfTheDayProps {
  story: { name: string; story: string };
  isStoryExpanded: boolean;
  setIsStoryExpanded: (expanded: boolean) => void;
}

export default function SaintOfTheDay({ story, isStoryExpanded, setIsStoryExpanded }: SaintOfTheDayProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2 px-1">
        <User size={18} className="text-accent" />
        <h2 className="text-lg font-bold text-primary">የዕለቱ ቅዱስ</h2>
      </div>
      <motion.div
        layout
        className="spiritual-card bg-accent/[0.03] border-accent/10 hover:border-accent/20"
      >
        <motion.h3 layout="position" className="text-xl font-black text-accent mb-3 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-accent rounded-full" />
          {story.name}
        </motion.h3>

        <motion.div
          layout
          initial={false}
          animate={{ height: isStoryExpanded ? "auto" : "4.5rem" }}
          className="overflow-hidden relative"
        >
          <p className="text-primary/90 text-base leading-relaxed font-medium">
            {story.story}
          </p>
          {!isStoryExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
          )}
        </motion.div>

        <button
          onClick={() => setIsStoryExpanded(!isStoryExpanded)}
          className="mt-4 text-accent font-bold text-sm flex items-center gap-1 hover:underline"
        >
          {isStoryExpanded ? "ያነሰ አሳይ" : "ተጨማሪ አንብብ"}
        </button>
      </motion.div>
    </section>
  );
}
