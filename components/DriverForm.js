'use client';
import { useState, useEffect } from 'react';

export default function DriverForm({ onSubmit, initialData = {} }) {
  const [name, setName] = useState(initialData.name || '');
  const [shiftHours, setShiftHours] = useState(initialData.shiftHours ?? 0);
  const [pastWeek, setPastWeek] = useState((initialData.pastWeekHours || []).join('|'));

  useEffect(() => {
    setName(initialData.name || '');
    setShiftHours(initialData.shiftHours ?? 0);
    setPastWeek((initialData.pastWeekHours || []).join('|'));
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">{initialData.id ? 'Update' : 'Add'} Driver</button>
    </form>
  );
}
