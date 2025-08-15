// components/DriverForm.js
'use client';
import { useState, useEffect } from 'react';

export default function DriverForm({ onSubmit, initialData }) {
  // defend against null/undefined initialData
  const safeInit = initialData || {};

  // support both Prisma shape and legacy mongo shape:
  // Prisma: { id, name, shiftHours, pastWeekHours }
  // Legacy: { _id, name, shift_hours, past_week_hours }
  const initialName = safeInit.name ?? safeInit.name ?? '';
  const initialShift =
    safeInit.shiftHours ?? safeInit.shift_hours ?? 0;
  const initialPastWeek =
    (safeInit.pastWeekHours && Array.isArray(safeInit.pastWeekHours) ? safeInit.pastWeekHours.join('|') :
     (safeInit.past_week_hours && Array.isArray(safeInit.past_week_hours) ? safeInit.past_week_hours.join('|') : ''));

  const [name, setName] = useState(initialName);
  const [shiftHours, setShiftHours] = useState(initialShift);
  const [pastWeek, setPastWeek] = useState(initialPastWeek);

  useEffect(() => {
    // update when initialData changes
    const s = initialData || {};
    setName(s.name ?? s.name ?? '');
    setShiftHours(s.shiftHours ?? s.shift_hours ?? 0);
    setPastWeek(
      (s.pastWeekHours && Array.isArray(s.pastWeekHours) ? s.pastWeekHours.join('|') :
       (s.past_week_hours && Array.isArray(s.past_week_hours) ? s.past_week_hours.join('|') : ''))
    );
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // send payload expected by your API: shift_hours & past_week_hours
    onSubmit({
      name,
      shift_hours: Number(shiftHours),
      past_week_hours: pastWeek ? pastWeek.split('|').map(Number) : [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="mb-2 p-2 border w-full" />
      <input type="number" value={shiftHours} onChange={e => setShiftHours(+e.target.value)} placeholder="Shift Hours" className="mb-2 p-2 border w-full" />
      <input type="text" value={pastWeek} onChange={e => setPastWeek(e.target.value)} placeholder="Past Week Hours (e.g., 6|8|7)" className="mb-4 p-2 border w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Save Driver</button>
    </form>
  );
}
