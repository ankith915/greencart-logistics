import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
  numDrivers: Number,
  startTime: String,
  maxHours: Number,
  totalProfit: Number,
  efficiencyScore: Number,
  onTime: Number,
  late: Number,
  fuelCosts: Number,
  fuelHigh: Number,
  fuelMedium: Number,
  fuelLow: Number,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Simulation', simulationSchema);