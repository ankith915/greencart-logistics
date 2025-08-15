'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function History() {
  const [simulations, setSimulations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // auth guard first
      const auth = await fetch('/api/auth/checkauth');
      if (!auth.ok) return router.push('/login');

      try {
        const res = await fetch('/api/simulation');
        if (!res.ok) throw new Error('Failed to load simulations');
        const data = await res.json();
        setSimulations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Load simulations error:', err);
        setSimulations([]);
      }
    })();
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
          {simulations.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No simulation history
              </td>
            </tr>
          ) : (
            simulations.map((sim, idx) => {
              // Pick a stable key: prefer Prisma id, then Mongo _id, then timestamp+index fallback
              const key = sim.id ?? sim._id ?? `${sim.timestamp ?? sim.createdAt ?? ''}-${idx}`;

              // Normalize fields from either Prisma or legacy Mongo shapes
              const timestamp = sim.timestamp ?? sim.createdAt ?? null;
              const drivers = sim.numDrivers ?? sim.num_drivers ?? '-';
              const startTime = sim.startTime ?? sim.start_time ?? '-';
              const maxHours = sim.maxHours ?? sim.max_hours ?? '-';
              const totalProfit = Number(sim.totalProfit ?? sim.total_profit ?? 0);
              const efficiencyScore = Number(sim.efficiencyScore ?? sim.efficiency_score ?? 0);

              const dateStr = timestamp ? new Date(timestamp).toLocaleString() : '-';

              return (
                <tr key={key}>
                  <td className="p-2">{dateStr}</td>
                  <td className="p-2">{drivers}</td>
                  <td className="p-2">{startTime}</td>
                  <td className="p-2">{maxHours}</td>
                  <td className="p-2">₹{totalProfit.toFixed(2)}</td>
                  <td className="p-2">{efficiencyScore.toFixed(2)}%</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
