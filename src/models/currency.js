import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const currencySchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    currencyname:{type:String,required:true,lowecase:true,index:true,unique: true},
    currencydescription:{type:String,lowecase:true,index:true,default:null}
},{ timestamps:true });

currencySchema.plugin(uniqueValidator)

export default mongoose.model('Currency',currencySchema);