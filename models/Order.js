import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route_id: { type: Number, required: true },
  delivery_time: { type: String, required: true },
});

export default mongoose.model('Order', orderSchema);