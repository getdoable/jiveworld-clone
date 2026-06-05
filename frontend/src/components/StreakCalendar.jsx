import { useState } from 'react';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Local-time YYYY-MM-DD key (avoids UTC off-by-one from toISOString()).
function dayKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Monthly streak calendar. Defaults to the current month, can page back any
// number of months, and stops paging forward at the current month. Days the
// user was active are filled orange; today is outlined.
export default function StreakCalendar({ streak = 0, activeDays = new Set() }) {
  const today = new Date();
  const todayKey = dayKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const isCurrentMonth =
    view.year === today.getFullYear() && view.month === today.getMonth();

  function shift(delta) {
    const d = new Date(view.year, view.month + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  }

  // Monday-first grid. Leading/trailing cells spill into adjacent months.
  const first = new Date(view.year, view.month, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i += 1) {
    const date = new Date(view.year, view.month, i - offset + 1);
    const inMonth = date.getMonth() === view.month;
    const key = dayKey(date.getFullYear(), date.getMonth(), date.getDate());
    cells.push({ label: date.getDate(), inMonth, key });
  }

  return (
    <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-6">
      <div className="text-2xl font-bold text-jw-ink dark:text-gray-100">Current streak</div>
      <div className="mt-1 flex items-center gap-2 text-2xl font-bold text-jw-ink dark:text-gray-100">
        <span className="text-jw-orange">🔥</span>
        {streak}
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <span className="text-xl font-bold text-jw-ink dark:text-gray-100">
          {MONTHS[view.month]} {view.year}
        </span>
        <button
          type="button"
          onClick={() => shift(-1)}
          className="text-2xl leading-none text-jw-ink dark:text-gray-100 hover:opacity-70"
          aria-label="Previous month"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={isCurrentMonth}
          className={`text-2xl leading-none ${
            isCurrentMonth ? 'cursor-default text-gray-300 dark:text-gray-600' : 'text-jw-ink dark:text-gray-100 hover:opacity-70'
          }`}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="mt-3 border-t border-gray-200 dark:border-gray-800 pt-3">
        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-400 dark:text-gray-400">
          {WEEKDAYS.map((d, i) => (
            <div key={i} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-center">
          {cells.map((cell) => {
            const isToday = cell.key === todayKey;
            const isActive = cell.inMonth && activeDays.has(cell.key);

            let cls = 'mx-auto flex h-9 w-12 items-center justify-center rounded-full text-base';
            if (isActive) {
              cls += ' bg-jw-orange font-semibold text-white';
            } else if (isToday) {
              cls += ' border-2 border-jw-orange/60 text-gray-600 dark:text-gray-300';
            } else {
              cls += cell.inMonth ? ' text-gray-600 dark:text-gray-300' : ' text-gray-300 dark:text-gray-600';
            }

            return (
              <div key={cell.key} className="py-1">
                <span className={cls}>{cell.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
