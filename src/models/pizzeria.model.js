import { PLANET_NAMES } from '../libs/constants.js';
import { MONSTER_ANCESTORS } from '../libs/constants.js';
import { PIZZA_TOPPINGS } from '../libs/constants.js';
import mongoose from 'mongoose';

const pizzeriaSchema = mongoose.Schema({
    planet:{type: String, unique:true, required:true, enum:PLANET_NAMES },
    coord:{
        lat: {type: Number, min:-1000, max:1000, required:true},
        lon: {type: Number, min:-1000, max:1000, required:true}, 
    },
    chef:{
        name: {type:String, required:true},
        ancestor: {type:String, required:true, enum:MONSTER_ANCESTORS},
        speciality: {type:String, required:true, enum:PIZZA_TOPPINGS},
    }
},{
  collection:'Pizzerias',
  strict:'throw'
});

pizzeriaSchema.virtual('orders',{
    ref: 'Order',
    localField: '_id',
    foreignField: 'pizzeria',
    justOne:false
})

pizzeriaSchema.virtual('customers',{
    ref: 'Customers',
    localField: '_id',
    foreignField: 'pizzeria',
    justOne:false
})
export default mongoose.model('Pizzeria', pizzeriaSchema);