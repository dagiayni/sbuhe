'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SaintModalProps {
  selectedSaint: { name: string; story: string } | null;
  onClose: () => void;
}

export default function SaintModal({ selectedSaint, onClose }: SaintModalProps) {
  return (
    <AnimatePresence>
      {selectedSaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-accent/10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent/5 text-muted transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-accent rounded-full" />
                <h3 className="text-2xl font-black text-accent">{selectedSaint.name}</h3>
              </div>

              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-primary/90 text-lg leading-relaxed font-medium italic">
                  {selectedSaint.story}
                </p>
              </div>

              <div className="pt-4 border-t border-accent/5">
                <p className="text-xs text-muted font-bold text-center uppercase tracking-widest">
                  በዛሬው ዕለት የታሰቡ
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
