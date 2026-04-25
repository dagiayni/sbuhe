'use client';
import { useState, useEffect, useCallback } from 'react';
import { bibleVerses, dailyTasks, saintStories, prayerData } from '@/lib/data';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import BibleVerse from './BibleVerse';
import PrayerSection from './PrayerSection';
import DailyTasks from './DailyTasks';
import SaintOfTheDay from './SaintOfTheDay';
import SaintModal from './SaintModal';

interface BasePageProps {
  themeColor: string;
  title: string;
  children?: React.ReactNode;
}

export default function BasePage({ themeColor, title, children }: BasePageProps) {
  const [verse, setVerse] = useState<{ verse: string; reference: string } | null>(null);
  const [tasks, setTasks] = useState<{ text: string; completed: boolean }[]>([]);
  const [story, setStory] = useState<{ name: string; story: string } | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState<{ title: string; note: string; books: string[] } | null>(null);
  const [isMorningMode, setIsMorningMode] = useState(true);
  const [todaysSaints, setTodaysSaints] = useState<{ name: string; story: string }[]>([]);
  const [selectedSaint, setSelectedSaint] = useState<{ name: string; story: string } | null>(null);

  const randomize = useCallback(() => {
    const randomVerse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
    const shuffledTasks = [...dailyTasks].sort(() => 0.5 - Math.random());
    const selectedTasks = shuffledTasks.slice(0, 3).map(task => ({ text: task, completed: false }));
    const randomStory = saintStories[Math.floor(Math.random() * saintStories.length)];
    const morning = Math.random() > 0.5;
    const prayers = morning ? prayerData.morning : prayerData.night;
    const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)];
    const shuffledSaints = [...saintStories].sort(() => 0.5 - Math.random());
    const selectedSaints = shuffledSaints.slice(0, 5);

    setVerse(randomVerse);
    setTasks(selectedTasks);
    setStory(randomStory);
    setIsMorningMode(morning);
    setCurrentPrayer(randomPrayer);
    setTodaysSaints(selectedSaints);
    setIsLoaded(true);
    setIsStoryExpanded(false);
  }, []);

  useEffect(() => {
    setCurrentDate(new Date());
    randomize();
  }, [randomize, refreshKey]);

  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  if (!isLoaded || !verse || !story || !currentDate || !currentPrayer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-accent">
          <RefreshCw size={32} />
        </motion.div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const isAllComplete = completedCount === 3;

  return (
    <div style={{ '--accent': themeColor } as any} className="min-h-screen">
      <main className="max-w-md mx-auto px-6 py-12 flex flex-col gap-10 overflow-x-hidden selection:bg-accent/20">
        <div className="flex items-center justify-start">
          <Link href="/" className="p-2 rounded-full bg-accent/5 text-accent hover:bg-accent/10 transition-colors">
            <ArrowLeft size={20} />
          </Link>
        </div>
        <Header currentDate={currentDate} todaysSaints={todaysSaints} onSaintClick={setSelectedSaint} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={refreshKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-10"
          >
            <BibleVerse verse={verse} refreshKey={refreshKey} />
            <PrayerSection isMorningMode={isMorningMode} currentPrayer={currentPrayer} />
            <DailyTasks tasks={tasks} completedCount={completedCount} isAllComplete={isAllComplete} toggleTask={toggleTask} />
            {children}
            <SaintOfTheDay story={story} isStoryExpanded={isStoryExpanded} setIsStoryExpanded={setIsStoryExpanded} />
          </motion.div>
        </AnimatePresence>

        <footer className="mt-auto py-8 text-center">
          <p className="text-[10px] text-muted font-bold uppercase tracking-[0.3em] opacity-50">
            {title} • የእለት ተእለት መንፈሳዊ ጉዞ
          </p>
        </footer>

        <SaintModal selectedSaint={selectedSaint} onClose={() => setSelectedSaint(null)} />
      </main>
    </div>
  );
}
