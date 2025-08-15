// components/DriverForm.js
'use client';
import { useEffect, useState } from 'react';

let Input, Button;
try {
  Input = require('@/components/ui/input').Input;
  Button = require('@/components/ui/button').Button;
} catch {
  Input = ({ ...p }) => <input className="p-2 border rounded w-full" {...p} />;
  Button = ({ children, ...p }) => <button className="bg-blue-600 text-white px-3 py-2 rounded" {...p}>{children}</button>;
}

export default function DriverForm({ initialData = {}, onSubmit }) {
  const safe = initialData || {};
  const [name, setName] = useState(safe.name ?? '');
  const [shiftHours, setShiftHours] = useState(safe.shiftHours ?? safe.shift_hours ?? 8);
  const [pastWeek, setPastWeek] = useState((safe.pastWeekHours ?? safe.past_week_hours ?? []).join('|'));

  useEffect(() => {
    const s = initialData || {};
    setName(s.name ?? '');
    setShiftHours(s.shiftHours ?? s.shift_hours ?? 8);
    setPastWeek((s.pastWeekHours ?? s.past_week_hours ?? []).join('|'));
  }, [initialData]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      shift_hours: Number(shiftHours),
      past_week_hours: pastWeek ? pastWeek.split('|').map(Number) : []
    });
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="sm:col-span-1">
        <label className="text-sm text-slate-600">Name</label>
        <Input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label className="text-sm text-slate-600">Shift Hours</label>
        <Input type="number" value={shiftHours} onChange={e => setShiftHours(+e.target.value)} />
      </div>
      <div>
        <label className="text-sm text-slate-600">Past Week (pipe-separated)</label>
        <Input value={pastWeek} onChange={e => setPastWeek(e.target.value)} />
      </div>
      <div className="sm:col-span-3 flex gap-2">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
