// app/dashboard/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BarChartComponent from '@/components/BarChartComponent';
import PieChartComponent from '@/components/PieChartComponent';

function KpiCard({ title, value, sub }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({ totalProfit: 0, efficiencyScore: 0, onTime: 0, late: 0, fuelCosts: 0, fuelHigh: 0, fuelMedium: 0, fuelLow: 0 });
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/checkauth').then(res => { if (!res.ok) router.push('/login'); });
    fetch('/api/simulation')
      .then(res => res.json())
      .then(sims => setData(sims?.[0] || data))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barData = [
    { name: 'On Time', value: data.onTime },
    { name: 'Late', value: data.late },
  ];

  const pieData = [
    { name: 'High', value: data.fuelHigh },
    { name: 'Medium', value: data.fuelMedium },
    { name: 'Low', value: data.fuelLow },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Total Profit" value={`₹${(data.totalProfit ?? 0).toFixed(2)}`} sub={`Fuel: ₹${(data.fuelCosts ?? 0).toFixed(2)}`} />
        <KpiCard title="Efficiency" value={`${(data.efficiencyScore ?? 0).toFixed(2)}%`} sub={`On time: ${data.onTime ?? 0}`} />
        <KpiCard title="Fuel (breakdown)" value={`₹${(data.fuelCosts ?? 0).toFixed(2)}`} sub={`High: ${data.fuelHigh ?? 0}, Medium: ${data.fuelMedium ?? 0}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Delivery Timeliness</h3>
          <BarChartComponent data={barData} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Fuel by Traffic</h3>
          <PieChartComponent data={pieData} />
        </div>
      </div>
    </div>
  );
}
