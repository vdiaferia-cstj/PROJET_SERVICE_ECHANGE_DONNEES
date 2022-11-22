import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({



    name:{type: String, unique:true, required:true },
    discoveredBy: {type: String, index:true},
    discoveryDate: Date,
    temperature: Number,
    satellites:[String],
    position:{
        x: {type: Number, min:-1000, max:1000, required:true},
        y: {type: Number, min:-1000, max:1000, required:true},
        z: {type: Number, min:-1000, max:1000, required:true}
    }
},{
  collection:'Orders',
  strict:'throw'
});

orderSchema.virtual('Pizzerias', {
    localField: '_id',
    foreignField: 'order',
    
});

export default mongoose.model('Order', orderSchema);