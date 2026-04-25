'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Book, User, Heart, ChevronRight } from 'lucide-react';

const categories = [
  { name: "ዲቁና", slug: "dikuna", color: "#1E3A8A", icon: <User size={24} />, description: "ለዲያቆናት የቀረበ መንፈሳዊ አገልግሎት" },
  { name: "ልባም ሴት", slug: "libamset", color: "#059669", icon: <Sparkles size={24} />, description: "የሴቶች መንፈሳዊ ጉዞ" },
  { name: "ኤማሆስ", slug: "emahos", color: "#7C3AED", icon: <Heart size={24} />, description: "የእናቶች መንፈሳዊ ሕይወት" },
  { name: "የቀደመችው መንገድ", slug: "yekdmechewmenged", color: "#991B1B", icon: <Book size={24} />, description: "የአባቶች ትምህርትና ፈለግ" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-6 flex flex-col items-center justify-center gap-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-black text-primary tracking-tight">ስቡሐ</h1>
        <p className="text-muted font-medium uppercase tracking-[0.2em] text-xs">የእለት ተእለት መንፈሳዊ መመሪያ</p>
      </motion.div>

      <div className="grid gap-4 w-full max-w-sm">
        {categories.map((category, index) => (
          <Link key={category.slug} href={`/${category.slug}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-3xl border border-black/5 p-6 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <div 
                className="absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]" 
                style={{ backgroundColor: category.color }}
              />
              
              <div className="flex items-center gap-4 relative z-10">
                <div 
                  className="p-3 rounded-2xl text-white shadow-lg" 
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-primary">{category.name}</h2>
                  <p className="text-xs text-muted font-medium">{category.description}</p>
                </div>

                <ChevronRight className="text-muted group-hover:text-primary transition-colors" size={20} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <footer className="mt-8 text-center opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">ስቡሐ • ፳፻፲፰</p>
      </footer>
    </main>
  );
}
