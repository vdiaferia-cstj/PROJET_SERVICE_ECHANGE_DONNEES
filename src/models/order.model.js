import mongoose from 'mongoose';
import { PLANET_SIZE } from '../libs/constants.js';
import { PIZZA_TOPPINGS } from '../libs/constants.js';

const orderSchema = mongoose.Schema({
  pizzeria: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Pizzeria" },
  cutomer: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  order: { required: true },

  pizzas: {

    size: { type: string, required: true, enum: PLANET_SIZE },
    orderDate: { type: Number, required: true },
    topping: { type: string, enum: PIZZA_TOPPINGS }

  }

}, {
  collection: 'Orders',
  strict: 'throw'
});

export default mongoose.model('Order', orderSchema);