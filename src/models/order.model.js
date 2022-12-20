import mongoose from 'mongoose';
import { PIZZA_SIZES } from '../libs/constants.js';
import { PIZZA_TOPPINGS } from '../libs/constants.js';

const orderSchema = mongoose.Schema({
  pizzeria: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Pizzeria" },
  customer: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  orderDate: { required: true, type: Date, default: Date.now },

  pizzas: [{

    size: { type: String, required: true, enum: PIZZA_SIZES },
    price: {type: String, required: true},
    //orderDate: { type: Number, required: true },
    // topping: [{ type: String, enum: PIZZA_TOPPINGS }]
    toppings: [{type: String, enum: PIZZA_TOPPINGS}]
  }]

}, {
  collection: 'Orders',
  strict: 'throw'
});

// orderSchema.virtual('customers',{
//   ref: 'Customers',
//   localField: '_id',
//   foreignField: 'order',
//   justOne:false
// })

export default mongoose.model('Order', orderSchema);