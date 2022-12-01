import mongoose from 'mongoose';
import { PLANET_NAMES } from '../libs/constants.js';


const customerSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  planet: { type: String, required: true, enum: PLANET_NAMES },
  coord: {
    lat: { type: Number, min: -1000, max: 1000, required: true },
    lon: { type: Number, min: -1000, max: 1000, required: true },
  },
  phone: { type: String, required: true, maxLength: 16 },
  birthday: {type: Date, required: true},
  referalCode: String
}, {
  collection: 'Customers',
  strict: 'throw'
});

customerSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'customer',
  justOne:false
});

export default mongoose.model('Customer', customerSchema);