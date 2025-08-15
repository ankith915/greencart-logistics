import connectDB from '../../../lib/db';
import Driver from '../../../models/Driver';
import Route from '../../../models/Route';
import Order from '../../../models/Order';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectDB();

  // Drivers data (parse | to arrays in actual, but hardcoded)
  const driversData = [
    { name: 'Amit', shift_hours: 6, past_week_hours: [6, 8, 7, 7, 7, 6, 10] },
    { name: 'Priya', shift_hours: 6, past_week_hours: [10, 9, 6, 6, 6, 7, 7] },
    { name: 'Rohit', shift_hours: 10, past_week_hours: [10, 6, 10, 7, 10, 9, 7] },
    { name: 'Neha', shift_hours: 9, past_week_hours: [10, 8, 6, 7, 9, 8, 8] },
    { name: 'Karan', shift_hours: 7, past_week_hours: [7, 8, 6, 6, 9, 6, 8] },
    { name: 'Sneha', shift_hours: 8, past_week_hours: [10, 8, 6, 9, 10, 6, 9] },
    { name: 'Vikram', shift_hours: 6, past_week_hours: [10, 8, 10, 8, 10, 7, 6] },
    { name: 'Anjali', shift_hours: 6, past_week_hours: [7, 8, 6, 7, 6, 9, 8] },
    { name: 'Manoj', shift_hours: 9, past_week_hours: [8, 7, 8, 8, 7, 8, 6] },
    { name: 'Pooja', shift_hours: 10, past_week_hours: [7, 10, 7, 7, 9, 9, 8] },
  ];
  await Driver.deleteMany({});
  await Driver.insertMany(driversData);

  // Routes data
  const routesData = [
    { route_id: 1, distance_km: 25, traffic_level: 'High', base_time_min: 125 },
    { route_id: 2, distance_km: 12, traffic_level: 'High', base_time_min: 48 },
    { route_id: 3, distance_km: 6, traffic_level: 'Low', base_time_min: 18 },
    { route_id: 4, distance_km: 15, traffic_level: 'Medium', base_time_min: 60 },
    { route_id: 5, distance_km: 7, traffic_level: 'Low', base_time_min: 35 },
    { route_id: 6, distance_km: 15, traffic_level: 'Low', base_time_min: 75 },
    { route_id: 7, distance_km: 20, traffic_level: 'Medium', base_time_min: 100 },
    { route_id: 8, distance_km: 19, traffic_level: 'Low', base_time_min: 76 },
    { route_id: 9, distance_km: 9, traffic_level: 'Low', base_time_min: 45 },
    { route_id: 10, distance_km: 22, traffic_level: 'High', base_time_min: 88 },
  ];
  await Route.deleteMany({});
  await Route.insertMany(routesData);

  // Full Orders data (all 50 from CSV)
  const ordersData = [
    { order_id: 1, value_rs: 2594, route_id: 7, delivery_time: '02:07' },
    { order_id: 2, value_rs: 1835, route_id: 6, delivery_time: '01:19' },
    { order_id: 3, value_rs: 766, route_id: 9, delivery_time: '01:06' },
    { order_id: 4, value_rs: 572, route_id: 1, delivery_time: '02:02' },
    { order_id: 5, value_rs: 826, route_id: 3, delivery_time: '00:35' },
    { order_id: 6, value_rs: 2642, route_id: 2, delivery_time: '01:02' },
    { order_id: 7, value_rs: 1763, route_id: 10, delivery_time: '01:47' },
    { order_id: 8, value_rs: 2367, route_id: 5, delivery_time: '01:00' },
    { order_id: 9, value_rs: 247, route_id: 2, delivery_time: '01:12' },
    { order_id: 10, value_rs: 1292, route_id: 6, delivery_time: '01:12' },
    { order_id: 11, value_rs: 1402, route_id: 7, delivery_time: '01:40' },
    { order_id: 12, value_rs: 2058, route_id: 1, delivery_time: '02:11' },
    { order_id: 13, value_rs: 2250, route_id: 3, delivery_time: '00:40' },
    { order_id: 14, value_rs: 635, route_id: 5, delivery_time: '01:05' },
    { order_id: 15, value_rs: 2279, route_id: 10, delivery_time: '01:30' },
    { order_id: 16, value_rs: 826, route_id: 6, delivery_time: '01:15' },
    { order_id: 17, value_rs: 2409, route_id: 9, delivery_time: '00:35' },
    { order_id: 18, value_rs: 2653, route_id: 6, delivery_time: '01:36' },
    { order_id: 19, value_rs: 279, route_id: 2, delivery_time: '01:01' },
    { order_id: 20, value_rs: 1459, route_id: 4, delivery_time: '00:53' },
    { order_id: 21, value_rs: 1186, route_id: 10, delivery_time: '01:23' },
    { order_id: 22, value_rs: 550, route_id: 8, delivery_time: '01:10' },
    { order_id: 23, value_rs: 2381, route_id: 3, delivery_time: '00:16' },
    { order_id: 24, value_rs: 2902, route_id: 8, delivery_time: '01:41' },
    { order_id: 25, value_rs: 876, route_id: 5, delivery_time: '00:58' },
    { order_id: 26, value_rs: 2684, route_id: 7, delivery_time: '01:43' },
    { order_id: 27, value_rs: 2408, route_id: 4, delivery_time: '01:09' },
    { order_id: 28, value_rs: 1834, route_id: 6, delivery_time: '01:33' },
    { order_id: 29, value_rs: 2319, route_id: 8, delivery_time: '01:13' },
    { order_id: 30, value_rs: 1215, route_id: 4, delivery_time: '00:54' },
    { order_id: 31, value_rs: 1584, route_id: 1, delivery_time: '02:32' },
    { order_id: 32, value_rs: 2468, route_id: 4, delivery_time: '01:27' },
    { order_id: 33, value_rs: 1102, route_id: 1, delivery_time: '01:59' },
    { order_id: 34, value_rs: 2784, route_id: 1, delivery_time: '02:09' },
    { order_id: 35, value_rs: 476, route_id: 1, delivery_time: '02:16' },
    { order_id: 36, value_rs: 490, route_id: 9, delivery_time: '00:50' },
    { order_id: 37, value_rs: 1340, route_id: 8, delivery_time: '01:19' },
    { order_id: 38, value_rs: 2408, route_id: 3, delivery_time: '00:44' },
    { order_id: 39, value_rs: 2560, route_id: 8, delivery_time: '01:21' },
    { order_id: 40, value_rs: 2137, route_id: 7, delivery_time: '01:42' },
    { order_id: 41, value_rs: 586, route_id: 2, delivery_time: '01:05' },
    { order_id: 42, value_rs: 1651, route_id: 7, delivery_time: '01:56' },
    { order_id: 43, value_rs: 2112, route_id: 1, delivery_time: '02:01' },
    { order_id: 44, value_rs: 448, route_id: 7, delivery_time: '01:51' },
    { order_id: 45, value_rs: 647, route_id: 4, delivery_time: '01:02' },
    { order_id: 46, value_rs: 979, route_id: 9, delivery_time: '01:03' },
    { order_id: 47, value_rs: 774, route_id: 7, delivery_time: '01:41' },
    { order_id: 48, value_rs: 1340, route_id: 8, delivery_time: '01:21' },
    { order_id: 49, value_rs: 508, route_id: 8, delivery_time: '01:41' },
    { order_id: 50, value_rs: 601, route_id: 1, delivery_time: '02:29' },
  ];
  await Order.deleteMany({});
  await Order.insertMany(ordersData);

  // Seed user
  const hashed = await bcrypt.hash('password', 10);
  await User.deleteMany({});
  await User.create({ username: 'admin', password: hashed });

  return Response.json({ message: 'Data seeded successfully' });
}