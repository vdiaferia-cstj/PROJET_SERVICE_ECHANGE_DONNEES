import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({

//Dave fait ton esti de modele pck je peux pas faire mon ?embed

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


export default mongoose.model('Order', orderSchema);