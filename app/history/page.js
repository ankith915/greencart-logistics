'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function History() {
  const [simulations, setSimulations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/checkauth').then(res => { if (!res.ok) router.push('/login'); });
    fetch('/api/simulation')
      .then(res => res.json())
      .then(setSimulations);
  }, [router]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="p-2">Timestamp</th>
            <th className="p-2">Drivers</th>
            <th className="p-2">Start Time</th>
            <th className="p-2">Max Hours</th>
            <th className="p-2">Profit</th>
            <th className="p-2">Efficiency</th>
          </tr>
        </thead>
        <tbody>
          {simulations.map(sim => (
            <tr key={sim._id}>
              <td className="p-2">{new Date(sim.timestamp).toLocaleString()}</td>
              <td className="p-2">{sim.numDrivers}</td>
              <td className="p-2">{sim.startTime}</td>
              <td className="p-2">{sim.maxHours}</td>
              <td className="p-2">₹{sim.totalProfit.toFixed(2)}</td>
              <td className="p-2">{sim.efficiencyScore.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}