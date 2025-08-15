import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PieChartComponent({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}