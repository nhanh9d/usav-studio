'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, startOfWeek } from '@/lib/shifts';
import { intlLocale } from '@/lib/boosterI18n';
import { useLocale } from '@/components/booster/LocaleProvider';

export default function WeekNav({ weekStart, onChange }: { weekStart: Date; onChange: (weekStart: Date) => void }) {
  const { locale, t } = useLocale();
  const weekEnd = addDays(weekStart, 6);
  const intl = intlLocale[locale];
  const label = `${weekStart.toLocaleDateString(intl, { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString(intl, { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(addDays(weekStart, -7))}
        className="p-2 rounded-lg border border-[#333] text-muted hover:text-white hover:bg-[#1a1a1a] transition-colors"
        aria-label={t.week.previous}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => onChange(startOfWeek(new Date()))}
        className="px-3 py-2 rounded-lg border border-[#333] text-sm text-white hover:bg-[#1a1a1a] transition-colors"
      >
        {t.week.today}
      </button>
      <button
        onClick={() => onChange(addDays(weekStart, 7))}
        className="p-2 rounded-lg border border-[#333] text-muted hover:text-white hover:bg-[#1a1a1a] transition-colors"
        aria-label={t.week.next}
      >
        <ChevronRight size={18} />
      </button>
      <span className="ml-2 text-sm font-medium text-white">{label}</span>
    </div>
  );
}
