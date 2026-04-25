'use client';

import { useState, useEffect, useCallback } from 'react';
import { bibleVerses, dailyTasks, saintStories, prayerData } from '@/lib/data';
import { CheckCircle2, Circle, Quote, Calendar, User, Heart, RefreshCw, Sparkles, Trophy, Sun, Moon, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import { toEthiopianDateString } from '@/lib/date-utils';

export default function Home() {
  const [verse, setVerse] = useState<{ verse: string; reference: string } | null>(null);
  const [tasks, setTasks] = useState<{ text: string; completed: boolean }[]>([]);
  const [story, setStory] = useState<{ name: string; story: string } | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState<{ title: string; note: string; books: string[] } | null>(null);
  const [isMorningMode, setIsMorningMode] = useState(true);

  const randomize = useCallback(() => {
    const randomVerse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
    const shuffledTasks = [...dailyTasks].sort(() => 0.5 - Math.random());
    const selectedTasks = shuffledTasks.slice(0, 3).map(task => ({
      text: task,
      completed: false
    }));
    const randomStory = saintStories[Math.floor(Math.random() * saintStories.length)];

    // Randomize Prayer
    const morning = Math.random() > 0.5;
    const prayers = morning ? prayerData.morning : prayerData.night;
    const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)];

    setVerse(randomVerse);
    setTasks(selectedTasks);
    setStory(randomStory);
    setIsMorningMode(morning);
    setCurrentPrayer(randomPrayer);
    setIsLoaded(true);
    setIsStoryExpanded(false);
  }, []);

  useEffect(() => {
    setCurrentDate(new Date());
    randomize();
  }, [randomize, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    const wasCompleted = newTasks[index].completed;
    newTasks[index].completed = !wasCompleted;
    setTasks(newTasks);

    // Trigger feedback for single task completion
    if (!wasCompleted) {
      const allDone = newTasks.every(t => t.completed);
      if (allDone) {
        triggerCelebration();
      }
    }
  };

  const triggerCelebration = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  if (!isLoaded || !verse || !story || !currentDate || !currentPrayer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-accent"
        >
          <RefreshCw size={32} />
        </motion.div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const isAllComplete = completedCount === 3;

  return (
    <main className="min-h-screen max-w-md mx-auto px-6 py-12 flex flex-col gap-10 overflow-x-hidden selection:bg-accent/20">
      {/* Header / Date */}
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

      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={refreshKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-10"
        >
          {/* Bible Verse Section */}
          <section className="relative group">
            <motion.div
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

          {/* Prayer Section */}
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

          {/* Daily Tasks Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-primary">የዕለቱ ተግባራት</h2>
              </div>
              <motion.span
                key={completedCount}
                initial={{ scale: 1.2, color: '#8B5E3C' }}
                animate={{ scale: 1, color: '#8B5E3C99' }}
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

          {/* Saint of the Day Section */}
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
        </motion.div>
      </AnimatePresence>

      <footer className="mt-auto py-8 text-center">
        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.3em] opacity-50">
          ስቡሐ • የእለት ተእለት መንፈሳዊ ጉዞ
        </p>
      </footer>
    </main>
  );
}
