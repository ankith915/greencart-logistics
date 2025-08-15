'use client';
import { useState } from 'react';

export default function DriverForm({ onSubmit, initialData = {} }) {
  const [name, setName] = useState(initialData.name || '');
  const [shift_hours, setShiftHours] = useState(initialData.shift_hours || 0);
  const [past_week_hours, setPastWeekHours] = useState(initialData.past_week_hours?.join('|') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      shift_hours,
      past_week_hours: past_week_hours.split('|').map(Number),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="mb-2 p-2 border w-full" />
      <input type="number" value={shift_hours} onChange={e => setShiftHours(+e.target.value)} placeholder="Shift Hours" className="mb-2 p-2 border w-full" />
      <input type="text" value={past_week_hours} onChange={e => setPastWeekHours(e.target.value)} placeholder="Past Week Hours (e.g., 6|8|7)" className="mb-4 p-2 border w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">{initialData._id ? 'Update' : 'Add'} Driver</button>
    </form>
  );
}