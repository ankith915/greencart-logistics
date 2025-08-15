'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BarChartComponent from '../../components/BarChartComponent';
import PieChartComponent from '../../components/PieChartComponent';

export default function Dashboard() {
  const [data, setData] = useState({ totalProfit: 0, efficiencyScore: 0, onTime: 0, late: 0, fuelCosts: 0, fuelHigh: 0, fuelMedium: 0, fuelLow: 0 });
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/checkauth').then(res => { if (!res.ok) router.push('/login'); });
    fetch('/api/simulation')  // Get latest from history or default
      .then(res => res.json())
      .then(sims => setData(sims[0] || data));  // Use first (latest)
  }, [router]);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl">Total Profit: ₹{data.totalProfit.toFixed(2)}</h2>
        <h2 className="text-xl">Efficiency Score: {data.efficiencyScore.toFixed(2)}%</h2>
        <h2 className="text-xl">Fuel Costs: ₹{data.fuelCosts}</h2>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <BarChartComponent data={barData} />
      </div>
      <div className="p-4 bg-white rounded shadow col-span-1 md:col-span-2">
        <PieChartComponent data={pieData} />
      </div>
    </div>
  );
}