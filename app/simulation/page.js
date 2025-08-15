'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BarChartComponent from '../../components/BarChartComponent';
import PieChartComponent from '../../components/PieChartComponent';

export default function Simulation() {
  const [numDrivers, setNumDrivers] = useState(5);
  const [startTime, setStartTime] = useState('09:00');
  const [maxHours, setMaxHours] = useState(8);
  const [results, setResults] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/checkauth').then(res => { if (!res.ok) router.push('/login'); });
  }, [router]);

  const runSimulation = async () => {
    const res = await fetch('/api/simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numDrivers, startTime, maxHours }),
    });
    if (res.ok) setResults(await res.json());
    else alert('Error running simulation');
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <form className="bg-white p-4 rounded shadow w-full md:w-1/3">
        <h2 className="text-xl mb-4">Simulation Inputs</h2>
        <label>Number of Drivers</label>
        <input type="number" value={numDrivers} onChange={e => setNumDrivers(+e.target.value)} className="mb-2 p-2 border w-full" />
        <label>Start Time (HH:MM)</label>
        <input type="text" value={startTime} onChange={e => setStartTime(e.target.value)} className="mb-2 p-2 border w-full" />
        <label>Max Hours per Driver</label>
        <input type="number" value={maxHours} onChange={e => setMaxHours(+e.target.value)} className="mb-4 p-2 border w-full" />
        <button type="button" onClick={runSimulation} className="bg-green-500 text-white p-2 w-full rounded">Run Simulation</button>
      </form>
      {results && (
        <div className="w-full md:w-2/3">
          <h2 className="text-xl">Results</h2>
          <p>Total Profit: ₹{results.totalProfit.toFixed(2)}</p>
          <p>Efficiency: {results.efficiencyScore.toFixed(2)}%</p>
          <BarChartComponent data={[{ name: 'On Time', value: results.onTime }, { name: 'Late', value: results.late }]} />
          <PieChartComponent data={[{ name: 'High', value: results.fuelHigh }, { name: 'Medium', value: results.fuelMedium }, { name: 'Low', value: results.fuelLow }]} />
        </div>
      )}
    </div>
  );
}