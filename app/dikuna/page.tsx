'use client';
import BasePage from '../components/BasePage';
import GitsaweSection from '../components/GitsaweSection';
import { gitsaweData } from '@/lib/data';

export default function DikunaPage() {
  return (
    <BasePage themeColor="#1E3A8A" title="ዲቁና">
      <GitsaweSection data={gitsaweData} />
    </BasePage>
  );
}
