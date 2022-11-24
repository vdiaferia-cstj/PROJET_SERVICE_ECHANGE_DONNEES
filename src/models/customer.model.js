const customerSchema = mongoose.Schema({
    name:{type: String, required:true },
    email: {type: String, required:true, unique:true},
    planet: String,
    coord:{
        lat: {type: Number, min:-1000, max:1000, required:true},
        long : {type: Number, min:-1000, max:1000, required:true},
    },
    phone:{type:String, required:true, maxLength:20},
    birthday:Date,
    referalCode:String
},{
  collection:'planets',
  strict:'throw'
});