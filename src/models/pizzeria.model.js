import mongoose from 'mongoose';

const pizzeriaSchema = mongoose.Schema({
    planet:{type: String, unique:true, required:true },
    coord:{
        lat: {type: Number, min:-1000, max:1000, required:true},
        lon: {type: Number, min:-1000, max:1000, required:true}, 
    },
    chef:{
        name: {type:String, required:true},
        ancestor: {type:String, required:true},
        speciality: {type:String, required:true},
    }
},{
  collection:'Pizzerias',
  strict:'throw'
});

export default mongoose.model('Pizzeria', pizzeriaSchema);