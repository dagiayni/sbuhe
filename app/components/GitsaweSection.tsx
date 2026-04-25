'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, BookOpen, Play, Pause, Volume2, VolumeX, Sparkles, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { anaphoras } from '@/lib/data';

interface GitsaweSectionProps {
  data: {
    zeNegéh: {
      misbak: { geez: string; amharic: string; audioUrl: string };
      minbab: { geez: string; amharic: string };
    };
    zeQidasé: {
      minbabat: { title: string; geez: string; amharic: string }[];
      misbak: { geez: string; amharic: string; audioUrl: string };
      finalMinbab: { geez: string; amharic: string };
    };
  };
}

function ReadingBlock({ title, geez, amharic }: { title?: string; geez: string; amharic: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-accent/5 overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between bg-accent/[0.03] hover:bg-accent/[0.06] transition-colors text-left"
      >
        <h4 className="text-xs font-black text-accent/70 uppercase tracking-widest">{title || "ምንባብ"}</h4>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-accent/40"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-5 pt-2 space-y-3 bg-white">
              <p className="text-lg font-serif text-primary font-bold leading-relaxed">{geez}</p>
              <div className="h-px w-8 bg-accent/10" />
              <p className="text-sm text-primary/60 italic">{amharic}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MisbakBlock({ misbak }: { misbak: { geez: string; amharic: string; audioUrl: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [frequencies, setFrequencies] = useState<number[]>(new Array(20).fill(5));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const setupAudio = () => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 64;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
    }
  };

  const updateFrequencies = () => {
    if (analyserRef.current && isPlaying) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const newFreqs = Array.from(dataArray.slice(0, 20)).map(val => (val / 255) * 30 + 5);
      setFrequencies(newFreqs);
      animationRef.current = requestAnimationFrame(updateFrequencies);
    }
  };

  useEffect(() => {
    if (isPlaying) animationRef.current = requestAnimationFrame(updateFrequencies);
    else if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  return (
    <div className="p-6 rounded-3xl bg-accent/[0.05] border border-accent/10 space-y-6 relative overflow-hidden">
      <div className="text-center space-y-3 relative z-10">
        <h4 className="text-[10px] font-black text-accent/60 uppercase tracking-widest flex items-center justify-center gap-2">
          <Music size={12} /> ምስባክ
        </h4>
        <p className="text-xl font-serif text-accent font-black leading-relaxed">{misbak.geez}</p>
        <p className="text-sm text-primary/70 italic font-bold">{misbak.amharic}</p>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="h-10 flex items-end justify-center gap-[2px]">
          {frequencies.map((h, i) => (
            <motion.div key={i} animate={{ height: h }} className="w-1 rounded-full bg-accent/40" />
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setupAudio();
              if (isPlaying) audioRef.current?.pause();
              else audioRef.current?.play();
              setIsPlaying(!isPlaying);
            }}
            className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shrink-0"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="flex-1 space-y-1">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => audioRef.current && (audioRef.current.currentTime = parseFloat(e.target.value))}
              className="w-full h-1 bg-accent/10 rounded-full appearance-none accent-accent"
            />
            <div className="flex justify-between text-[8px] font-black text-accent/40">
              <span>{Math.floor(currentTime/60)}:{(Math.floor(currentTime%60)).toString().padStart(2,'0')}</span>
              <span>{Math.floor(duration/60)}:{(Math.floor(duration%60)).toString().padStart(2,'0')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button 
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              if (audioRef.current) audioRef.current.volume = nextMuted ? 0 : volume;
            }}
            className="text-accent/60 hover:text-accent transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              setIsMuted(val === 0);
              if (audioRef.current) audioRef.current.volume = val;
            }}
            className="w-24 h-1 bg-accent/10 rounded-full appearance-none accent-accent/40"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={misbak.audioUrl}
        crossOrigin="anonymous"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}

export default function GitsaweSection({ data }: GitsaweSectionProps) {
  const [showAnaphora, setShowAnaphora] = useState(false);
  const [currentAnaphora, setCurrentAnaphora] = useState("");

  useEffect(() => {
    const day = new Date().getDate();
    setCurrentAnaphora(anaphoras[day % anaphoras.length]);
  }, []);

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-2 px-1">
        <BookOpen size={18} className="text-accent" />
        <h2 className="text-xl font-black text-primary tracking-tight">ግጻዌ</h2>
      </div>

      <div className="space-y-12">
        {/* ዘነግህ */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-accent/10" />
            <h3 className="text-sm font-black text-accent uppercase tracking-[0.2em]">ዘነግህ</h3>
            <div className="h-px flex-1 bg-accent/10" />
          </div>
          <MisbakBlock misbak={data.zeNegéh.misbak} />
          <ReadingBlock title="ምንባብ" geez={data.zeNegéh.minbab.geez} amharic={data.zeNegéh.minbab.amharic} />
        </div>

        {/* ዘቅዳሴ */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-accent/10" />
            <h3 className="text-sm font-black text-accent uppercase tracking-[0.2em]">ዘቅዳሴ</h3>
            <div className="h-px flex-1 bg-accent/10" />
          </div>

          <div className="flex flex-col items-center gap-1 -mt-2">
            <h4 className="text-2xl font-black text-accent tracking-tight">{currentAnaphora}</h4>
            <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">የዕለቱ ቅዳሴ</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-widest px-1">ምንባባት</h4>
            <div className="grid gap-3">
              {data.zeQidasé.minbabat.map((item, i) => (
                <ReadingBlock key={i} title={item.title} geez={item.geez} amharic={item.amharic} />
              ))}
            </div>
          </div>

          <MisbakBlock misbak={data.zeQidasé.misbak} />
          
          <ReadingBlock title="ምንባብ (ወንጌል)" geez={data.zeQidasé.finalMinbab.geez} amharic={data.zeQidasé.finalMinbab.amharic} />
        </div>
      </div>
    </section>
  );
}
