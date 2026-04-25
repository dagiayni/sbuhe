'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, CheckCircle2, Circle, Sparkles } from 'lucide-react';

interface DailyTasksProps {
  tasks: { text: string; completed: boolean }[];
  completedCount: number;
  isAllComplete: boolean;
  toggleTask: (index: number) => void;
}

export default function DailyTasks({ tasks, completedCount, isAllComplete, toggleTask }: DailyTasksProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-accent" />
          <h2 className="text-lg font-bold text-primary">የዕለቱ ተግባራት</h2>
        </div>
        <motion.span
          key={completedCount}
          initial={{ scale: 1.2, color: 'var(--accent)' }}
          animate={{ scale: 1, color: 'rgba(var(--accent-rgb), 0.6)' }}
          className="text-xs font-bold bg-accent/5 px-2 py-1 rounded-full"
        >
          {completedCount}/3 ተጠናቅቋል
        </motion.span>
      </div>

      <div className={`spiritual-card transition-all duration-500 ${isAllComplete ? 'ring-2 ring-accent/30 shadow-lg shadow-accent/5' : 'hover:shadow-md'}`}>
        <div className="flex flex-col gap-5">
          {tasks.map((task, index) => (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={index}
              onClick={() => toggleTask(index)}
              className="flex items-start gap-4 text-left group"
            >
              <motion.div
                className="mt-1"
                animate={task.completed ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              >
                {task.completed ? (
                  <CheckCircle2 className="text-accent fill-accent/10" size={26} />
                ) : (
                  <Circle className="text-accent/30 group-hover:text-accent/50" size={26} />
                )}
              </motion.div>
              <div className="relative flex-1">
                <span className={`text-[1.05rem] leading-snug transition-all duration-500 ${task.completed ? 'text-muted opacity-60' : 'text-primary'}`}>
                  {task.text}
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: task.completed ? "100%" : 0 }}
                  transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  className="absolute top-[55%] left-0 h-[2px] bg-accent/30 origin-left rounded-full"
                />
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {isAllComplete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-accent/10 text-center space-y-2 overflow-hidden"
            >
              <div className="inline-flex items-center gap-2 text-accent font-bold">
                <Sparkles size={18} />
                <span>ሁሉንም ፈጽመዋል! ተባረኩ!</span>
                <Sparkles size={18} />
              </div>
              <p className="text-xs text-muted">ዛሬን በድል ተወጥተዋል</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
