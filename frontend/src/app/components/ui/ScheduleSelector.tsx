import React from 'react';

type Schedule = 'daily' | 'weekly' | 'monthly';

interface ScheduleSelectorProps {
  value: Schedule;
  onChange: (v: Schedule) => void;
  variant?: 'pill' | 'segmented';
}

const OPTIONS: { value: Schedule; label: string }[] = [
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' },
];

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({ value, onChange, variant = 'pill' }) => {
  if (variant === 'segmented') {
    return (
      <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`py-2 rounded-xl text-sm font-bold transition-all ${
              value === opt.value
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            value === opt.value
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
