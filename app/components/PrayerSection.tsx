'use client';
import { motion } from 'framer-motion';
import { Sun, Moon, BookOpen } from 'lucide-react';

interface PrayerSectionProps {
  isMorningMode: boolean;
  currentPrayer: { title: string; note: string; books: string[] };
}

export default function PrayerSection({ isMorningMode, currentPrayer }: PrayerSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        {isMorningMode ? (
          <Sun size={18} className="text-orange-500" />
        ) : (
          <Moon size={18} className="text-indigo-500" />
        )}
        <h2 className="text-lg font-bold text-primary">የዕለቱ ጸሎት</h2>
      </div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`spiritual-card overflow-hidden relative border-l-4 ${
          isMorningMode 
            ? "border-l-orange-400 bg-orange-50/30" 
            : "border-l-indigo-400 bg-indigo-50/30"
        }`}
      >
        <div className="relative z-10 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">
              {currentPrayer.title}
            </h3>
            <p className="text-primary/80 text-sm leading-relaxed italic">
              {currentPrayer.note}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-accent/70 uppercase tracking-widest">
              <BookOpen size={14} />
              <span>ሊነበቡ የሚገባቸው መጻሕፍት</span>
            </div>
            <ul className="grid gap-2">
              {currentPrayer.books.map((book, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-primary font-medium">
                  <div className={`w-1 h-1 rounded-full ${
                    isMorningMode 
                      ? "bg-orange-400" 
                      : "bg-indigo-400"
                  }`} />
                  {book}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Decorative background icon */}
        <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none">
          {isMorningMode ? (
            <Sun size={120} />
          ) : (
            <Moon size={120} />
          )}
        </div>
      </motion.div>
    </section>
  );
}
