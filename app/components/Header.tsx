'use client';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { toEthiopianDateString } from '@/lib/date-utils';

interface HeaderProps {
  currentDate: Date;
  todaysSaints: { name: string; story: string }[];
  onSaintClick: (saint: { name: string; story: string }) => void;
}

export default function Header({ currentDate, todaysSaints, onSaintClick }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center gap-2"
    >
      <div className="bg-accent/10 p-3 rounded-full text-accent mb-2 shadow-inner">
        <Calendar size={24} />
      </div>
      <h1 className="text-sm font-bold tracking-[0.2em] text-accent uppercase">
        {toEthiopianDateString(currentDate)}
      </h1>

      {/* Today's Saints Badge List */}
      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2 max-w-[320px]">
          {todaysSaints.map((saint, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSaintClick(saint)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-[10px] font-bold py-1.5 px-3 rounded-full border border-accent/20 bg-accent/[0.03] text-accent/90 shadow-sm whitespace-nowrap hover:bg-accent/10 transition-colors"
            >
              {saint.name}
            </motion.button>
          ))}
        </div>
        <p className="text-[11px] text-accent/60 font-bold italic tracking-wide">
          " በዛሬው ዕለት የሚታሰቡ ቅዱሳን በረከታቸው አይለየን "
        </p>
      </div>
    </motion.div>
  );
}
