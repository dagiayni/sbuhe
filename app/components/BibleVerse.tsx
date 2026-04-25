'use client';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface BibleVerseProps {
  verse: { verse: string; reference: string };
  refreshKey: number;
}

export default function BibleVerse({ verse, refreshKey }: BibleVerseProps) {
  return (
    <section className="relative group">
      <motion.div
        key={`quote-bg-${refreshKey}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute -top-6 -left-4 text-accent/5 pointer-events-none"
      >
        <Quote size={120} />
      </motion.div>
      <div className="relative text-center space-y-4 pt-6 px-4">
        <p className="text-2xl font-serif leading-relaxed text-primary italic font-medium">
          "{verse.verse}"
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-accent/20" />
          <p className="text-sm font-bold text-accent tracking-widest uppercase">
            {verse.reference}
          </p>
          <div className="h-px w-8 bg-accent/20" />
        </div>
      </div>
    </section>
  );
}
